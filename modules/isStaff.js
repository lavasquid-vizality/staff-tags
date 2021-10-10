import { isEqual } from 'lodash';
import React, { memo } from 'react';
import { getModule } from '@vizality/webpack';
import { isEmptyObject } from '@vizality/util/object';

import { FakeBotTagTooltip } from '../components/FakeBotTagTooltip';

import { CheckPermissions, defaultSettings } from '../constants';

const { getGuild } = getModule(m => m.getGuild);
const { getChannel } = getModule(m => m.getChannel);
const { getMember } = getModule(m => m.getMember);
const { can } = getModule(m => m.can && m.ALL);

const GetTooltip = memo(({ isOwner = false, isThreadCreator = false, isStaff = {}, place = 'None', color = null, Owner, ThreadCreator, Admin, Management, Icons }) => {
  const tooltipText = isOwner
    ? 'Server Owner'
    : isThreadCreator
      ? 'Thread Creator'
      : Object.keys(isStaff).includes('Administrator')
        ? 'Administrator'
        : `Management\n(${Object.keys(isStaff).map(x => x.replace('Manage ', '')).join(', ')})`;
  const type = isOwner ? { Owner } : isThreadCreator ? { ThreadCreator } : Object.keys(isStaff).includes('Administrator') ? { Admin } : { Management };

  return <FakeBotTagTooltip TText={tooltipText} type={type} icons={Icons} place={place} color={color} />;
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});

export default function (guildId, channelId, userId, place) {
  const SettingsPreview = location.pathname === '/vizality/plugin/staff-tags/settings';
  if (place === 'None' || guildId === '@me' && !SettingsPreview) return;

  const tagNames = {
    Owner: this.settings.get('TNOwner', defaultSettings.TNOwner),
    ThreadCreator: this.settings.get('TNThreadCreator', defaultSettings.TNThreadCreator),
    Admin: this.settings.get('TNAdmin', defaultSettings.TNAdmin),
    Management: this.settings.get('TNManagement', defaultSettings.TNManagement),
    Icons: place === 'MemberList' ? this.settings.get('TNIcons', defaultSettings.TNIcons) : false
  };

  if (SettingsPreview) {
    const tags = [];

    tags.push(<GetTooltip isOwner={true} place={place} {...tagNames} />); // Owner
    tags.push(<GetTooltip isThreadCreator={true} place={place} {...tagNames} />); // Thread Creator
    tags.push(<GetTooltip isStaff={{ Administrator: true }} place={place} {...tagNames} />); // Admin

    const isStaff = {};
    for (const [ name ] of Object.entries(CheckPermissions)) {
      if (name !== 'Administrator') isStaff[name] = true;
    }
    tags.push(<GetTooltip isStaff={isStaff} place={place} {...tagNames} />); // Management (All)

    return <>{tags}</>;
  }

  const guild = getGuild(guildId);
  if (!guild) return;
  const channel = getChannel(channelId);

  const isOwner = guild.isOwner(userId);
  const isThreadCreator = channel ? channel.isThread() && channel.isOwner(userId) : false;
  const isStaff = {};

  for (const [ name, permission ] of Object.entries(CheckPermissions)) {
    if (can(permission, userId, guild)) isStaff[name] = true;
  }

  const color = getMember(guildId, userId)?.colorString;

  return <>
    {isThreadCreator && <GetTooltip isThreadCreator={isThreadCreator} place={place} color={color} {...tagNames} />}
    {(isOwner || !isEmptyObject(isStaff)) && <GetTooltip isOwner={isOwner} isStaff={isStaff} place={place} color={color} {...tagNames} />}
  </>;
}
