import React from 'react';
import { getModule } from '@vizality/webpack';
const { string: { toTitleCase }, object: { isEmptyObject } } = require('@vizality/util');

import { CheckPermissions } from '../constants';
import { FakeBotTagTooltip } from '../components/FakeBotTagTooltip';

const { Permissions } = getModule('Permissions');
const { getGuild } = getModule(m => m?._dispatchToken && m?.getGuild);
const { getGuildId } = getModule('getGuildId', 'getLastSelectedGuildId');
const { getMember } = getModule(m => m?._dispatchToken && m?.getMember);

function getTooltip (isOwner, isStaff, place, { Owner, Admin, Management, Icons = false }) {
  if (isOwner || !isEmptyObject(isStaff)) {
    const tooltipText = isOwner
      ? 'Server Owner'
      : Object.keys(isStaff).includes('Administrator')
        ? 'Administrator'
        : `Management\n(${Object.keys(isStaff).map(x => x.replace('Manage ', '')).join(', ')})`;
    const type = isOwner ? { Owner } : Object.keys(isStaff).includes('Administrator') ? { Admin } : { Management };

    return <FakeBotTagTooltip TText={tooltipText} type={type} icons={Icons} place={place} />;
  }
}

export default (userId, place, SettingsPreview, ...args) => {
  const guildId = getGuildId();
  if (place === 'None' || (!guildId || guildId === '@me') && !SettingsPreview) return;

  if (SettingsPreview) {
    const tags = [];

    tags.push(getTooltip(true, {}, place, ...args)); // Owner
    tags.push(getTooltip(false, { Administrator: true }, place, ...args)); // Admin

    const isStaff = {};
    for (const permission of CheckPermissions) {
      if (permission !== 'ADMINISTRATOR') isStaff[toTitleCase(permission)] = true;
    }
    tags.push(getTooltip(false, isStaff, place, ...args)); // Management (All)

    return <>{tags}</>;
  }

  const guild = getGuild(guildId);
  if (!guild) return;
  const isOwner = guild.isOwner(userId);
  const isStaff = {};

  const roles = getMember(guildId, userId)?.roles;
  if (roles) {
    for (const role of roles) {
      const RolePermissions = guild.getRole(role)?.permissions;
      for (const permission of CheckPermissions) {
        if ((RolePermissions & Permissions[permission]) === Permissions[permission].to32BitNumber()) isStaff[toTitleCase(permission)] = true;
      }
    }
  }

  return getTooltip(isOwner, isStaff, place, ...args);
};
