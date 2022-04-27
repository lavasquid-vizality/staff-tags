import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { Messages } from '@vizality/i18n';
import { getModule } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';

import OverflowTooltip from './components/OverflowTooltip';

import isStaff from './modules/isStaff';
import TempPatch from './modules/TempPatch';
import getModalLazy from './modules/getModalLazy';
import { DefaultSettings } from './constants';

const { overflow } = getModule(m => m.overflow && Object.keys(m).length === 1);
const { headerTagNoNickname, headerTagWithNickname } = getModule('headerTag');
let { nameTagNoCustomStatus, nameTagWithCustomStatus } = getModule('nameTag', 'additionalActionsIcon') ?? {};

export default class StaffTags extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    // Member List Item
    const MemberListItem = patch(getModule(m => m.AVATAR_DECORATION_PADDING).default, 'type', (args, res) => {
      // Name Tooltip if Overflow...
      patch(res.type.prototype, 'render', (args, res) => {
        const name = res.props.name?.props.children;
        if (!name) return res;

        const overflowProps = {
          className: overflow,
          'aria-label': false
        };
        res.props.name.props.children = <OverflowTooltip text={name} tooltipText={name} {...overflowProps} />;

        return res;
      });

      // Decorators
      patch(res.type.prototype, 'renderDecorators', (args, res, _this) => {
        if (!this.settings.get('MLShow', DefaultSettings.MLShow)) return res;

        for (const [ index, child ] of res.props.children.entries()) {
          if (child?.props.text === Messages.GUILD_OWNER) res.props.children[index] = null;
        }

        const { guildId, channel, user: { id: userId } } = _this.props;
        const channelId = channel?.id;

        const FakeBotTagTooltip = isStaff.call(this, guildId, channelId, userId, 'MemberList');
        if (FakeBotTagTooltip) res.props.children.splice(res.props.children.length - 2, 0, FakeBotTagTooltip);

        return res;
      });

      MemberListItem();
    });

    // User Popout
    patch(getModule(m => m.type?.displayName === 'UserPopoutContainer'), 'type', (args, res) => {
      const { guildId, channelId, userId } = args[0];

      TempPatch(res, 'type', Type => {
        TempPatch(findInReactTree(Type, m => m.type?.displayName === 'UserPopoutInfo'), 'type', Type => {
          TempPatch(findInReactTree(Type, m => m.type?.displayName === 'DiscordTag'), 'type', (_Type, Args) => {
            Args.guildId = guildId;
            Args.channelId = channelId;
            Args.userId = userId;
          }, true);
          return Type;
        });
        return Type;
      });

      return res;
    });
    // User Modal
    getModalLazy(getModule.bind(this, m => m.default?.displayName === 'UserProfileModal')).then(module => patch(module, 'default', (args, res) => {
      const { guildId, user: { id: userId } } = args[0];

      TempPatch(findInReactTree(res, m => m.type?.displayName === 'UserProfileModalHeader'), 'type', Type => {
        TempPatch(findInReactTree(Type, m => m.type?.displayName === 'DiscordTag'), 'type', (_Type, Args) => {
          Args.guildId = guildId;
          Args.userId = userId;
        }, true);
        return Type;
      });

      return res;
    }));

    // Name Tag
    patch(getModule(m => m.default?.displayName === 'NameTag'), 'default', (args, res) => {
      if (!nameTagNoCustomStatus) ({ nameTagNoCustomStatus, nameTagWithCustomStatus } = getModule('nameTag', 'additionalActionsIcon') ?? {});

      const { className, guildId, channelId, userId } = args[0];

      if (userId || location.pathname === '/vizality/plugin/staff-tags/settings') {
        const place = className === headerTagNoNickname && this.settings.get('UPShow', DefaultSettings.UPShow)
          ? 'UserPopout'
          : className === headerTagWithNickname && this.settings.get('UPShow', DefaultSettings.UPShow)
            ? 'UserPopoutNick'
            : (className === nameTagNoCustomStatus || className === nameTagWithCustomStatus) && this.settings.get('UMShow', DefaultSettings.UMShow)
              ? (!res.props.className.endsWith(' userModalName') ? res.props.className += ' userModalName' : 'None', 'UserModal')
              : 'None';

        const FakeBotTagTooltip = isStaff.call(this, guildId, channelId, userId, place);
        if (FakeBotTagTooltip) res.props.children.push(FakeBotTagTooltip);
      }

      return res;
    });
  }
}
