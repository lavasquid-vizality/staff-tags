import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch, unpatchAll } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

import isStaff from './modules/isStaff';
import { OverflowTooltip } from './components/OverflowTooltip';
import { defaultSettings } from './constants';

const { headerTagNoNickname, headerTagWithNickname } = getModule('headerTag');
const { nameTagWithCustomStatus, nameTagNoCustomStatus } = getModule('nameTag', 'additionalActionsIcon');

function DefaultSettings (settingsSet) {
  for (const [ key, value ] of Object.entries(defaultSettings)) {
    settingsSet(key, value);
  }
}

export default class extends Plugin {
  start () {
    if (!this.settings.getKeys().length) DefaultSettings(this.settings.set);

    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    // Name Tooltip if Overflow...
    patch(getModule(m => m?.displayName === 'MemberListItem').prototype, 'render', (args, res) => {
      const name = res.props.name?.props.children;
      if (!name) return res;

      const overflowProps = {
        className: getModule('overflow').overflow,
        'aria-label': false
      };
      res.props.name.props.children = <OverflowTooltip text={name} tooltipText={name} {...overflowProps} />;

      return res;
    });

    // Member List (Bot Tag, Crown, Nitro)
    patch(getModule(m => m?.displayName === 'MemberListItem').prototype, 'renderDecorators', (args, res) => {
      if (!this.settings.get('MLShow', true)) return res;

      for (const [ index, child ] of res.props.children.entries()) {
        if (child?.props.text === 'Server Owner') res.props.children[index] = null;
      }

      const userId = res._owner.pendingProps.user.id;

      const tagNames = {
        Owner: this.settings.get('TNOwner', 'Owner'),
        Admin: this.settings.get('TNAdmin', 'Admin'),
        Management: this.settings.get('TNManagement', 'Management'),
        Icons: this.settings.get('TNIcons')
      };
      const FakeBotTagTooltip = isStaff(userId, 'MemberList', location.pathname === '/vizality/plugins/staff-tags', tagNames);
      if (FakeBotTagTooltip) res.props.children.splice(res.props.children.length - 2, 0, FakeBotTagTooltip);

      return res;
    });

    // Name Tag (User Popout & User Modal &  ...)
    patch(getModule(m => m?.default?.displayName === 'DiscordTag'), 'default', (args, res) => {
      res.props.userId = args[0].user.id;
      return res;
    });
    patch(getModule(m => m?.default?.displayName === 'NameTag'), 'default', (args, res) => {
      const { userId, className } = args[0];

      const SettingsPreview = location.pathname === '/vizality/plugins/staff-tags';
      if (userId || SettingsPreview) {
        const place = (className === headerTagNoNickname && this.settings.get('UPShow', true))
          ? 'UserPopout'
          : (className === headerTagWithNickname && this.settings.get('UPShow', true))
            ? 'UserPopoutNick'
            : ((className === nameTagWithCustomStatus || className === nameTagNoCustomStatus) && this.settings.get('UMShow', true))
              ? 'UserModal'
              : 'None';

        const tagNames = {
          Owner: this.settings.get('TNOwner', 'Owner'),
          Admin: this.settings.get('TNAdmin', 'Admin'),
          Management: this.settings.get('TNManagement', 'Management')
        };
        const FakeBotTagTooltip = isStaff(userId, place, SettingsPreview, tagNames);
        if (FakeBotTagTooltip) res.props.children.push(FakeBotTagTooltip);
      }

      return res;
    });
  }

  stop () {
    unpatchAll();
  }
}
