import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';

import { OverflowTooltip } from './components/OverflowTooltip';

import isStaff from './modules/isStaff';
import TempPatch from './modules/TempPatch';
import { defaultSettings } from './constants';

const { overflow } = getModule((m => m.overflow && Object.keys(m).length === 1));
const { headerTagNoNickname, headerTagWithNickname } = getModule('headerTag');
const { nameTagWithCustomStatus, nameTagNoCustomStatus } = getModule('nameTag', 'additionalActionsIcon');

export default class extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    // Name Tooltip if Overflow...
    patch(getModule(m => m.displayName === 'MemberListItem').prototype, 'render', (args, res) => {
      const name = res.props.name?.props.children;
      if (!name) return res;

      const overflowProps = {
        className: overflow,
        'aria-label': false
      };
      res.props.name.props.children = <OverflowTooltip text={name} tooltipText={name} {...overflowProps} />;

      return res;
    });

    // Member List (Bot Tag, Crown, Nitro)
    patch(getModule(m => m.displayName === 'MemberListItem').prototype, 'renderDecorators', (args, res, _this) => {
      if (!this.settings.get('MLShow', defaultSettings.MLShow)) return res;

      for (const [ index, child ] of res.props.children.entries()) {
        if (child?.props.text === 'Server Owner') res.props.children[index] = null;
      }

      const { guildId, channel, user: { id: userId } } = _this.props;
      const channelId = channel?.id;

      const FakeBotTagTooltip = isStaff.call(this, guildId, channelId, userId, 'MemberList');
      if (FakeBotTagTooltip) res.props.children.splice(res.props.children.length - 2, 0, FakeBotTagTooltip);

      return res;
    });

    // User Popout
    patch(getModule(m => m.type?.displayName === 'UserPopoutContainer'), 'type', (args, res) => {
      const { guildId, channelId, userId } = args[0];

      TempPatch(res, 'type', Type => {
        TempPatch(findInReactTree(Type, m => m.type?.displayName === 'UserPopoutInfo'), 'type', Type => {
          TempPatch(findInReactTree(Type, m => m.type?.displayName === 'DiscordTag'), 'type', null, () => ({ guildId, channelId, userId }));
        });
      });

      return res;
    });
    // User Modal
    patch(getModule(m => m.default?.displayName === 'UserProfileModal'), 'default', (args, res) => {
      const { guildId, user: { id: userId } } = args[0];

      TempPatch(findInReactTree(res, m => m.type?.displayName === 'UserProfileModalHeader'), 'type', Type => {
        TempPatch(findInReactTree(Type, m => m.type?.displayName === 'DiscordTag'), 'type', null, () => ({ guildId, userId }));
      });

      return res;
    });

    // Name Tag
    patch(getModule(m => m.default?.displayName === 'NameTag'), 'default', (args, res) => {
      const { className, guildId, channelId, userId } = args[0];

      if (userId || location.pathname === '/vizality/plugin/staff-tags/settings') {
        const place = (className === headerTagNoNickname && this.settings.get('UPShow', defaultSettings.UPShow))
          ? 'UserPopout'
          : (className === headerTagWithNickname && this.settings.get('UPShow', defaultSettings.UPShow))
            ? 'UserPopoutNick'
            : ((className === nameTagWithCustomStatus || className === nameTagNoCustomStatus) && this.settings.get('UMShow', defaultSettings.UMShow))
              ? (!res.props.className.endsWith(' userModalName') ? res.props.className += ' userModalName' : 'None', 'UserModal')
              : 'None';

        const FakeBotTagTooltip = isStaff.call(this, guildId, channelId, userId, place);
        if (FakeBotTagTooltip) res.props.children.push(FakeBotTagTooltip);
      }

      return res;
    });
  }
}
