/* eslint-disable multiline-comment-style */
import { Permissions } from '@vizality/discord/constants';

export const Colors = {
  Owner: '#FAA61A', // Gold (Owner)
  ThreadCreator: '#FFBD00', // Lighter Gold (Thread Creator)
  Admin: '#C0C0C0', // Silver (Admin)
  Management: '#CD7F32' // Bronze (Management)
};

export const CheckPermissions = Object.freeze({
  Administrator: Permissions.ADMINISTRATOR,
  Guild: Permissions.MANAGE_GUILD,
  Channels: Permissions.MANAGE_CHANNELS,
  Threads: Permissions.MANAGE_THREADS,
  Messages: Permissions.MANAGE_MESSAGES
  // Webhooks: Permissions.MANAGE_WEBHOOKS,
  // Events: Permissions.MANAGE_EVENTS,
  // Roles: Permissions.MANAGE_ROLES,
  // EmojisAndStickers: Permissions.MANAGE_EMOJIS_AND_STICKERS,
  // Nicknames: Permissions.MANAGE_NICKNAMES
});

export const DefaultSettings = Object.freeze({
  TNOwner: 'Owner',
  TNThreadCreator: 'Thread Creator',
  TNAdmin: 'Admin',
  TNManagement: 'Management',
  TNIcons: false,
  MLShow: true,
  UPShow: true,
  UMShow: true
});
