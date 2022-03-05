/* eslint-disable multiline-comment-style */
import { getModule } from '@vizality/webpack';

const Constants = getModule(m => m.API_HOST);

export const Colors = Object.freeze({
  Owner: Constants.Colors.STATUS_YELLOW, // Gold (Owner)
  ThreadCreator: Constants.Colors.PREMIUM_PERK_YELLOW, // Lighter Gold (Thread Creator)
  Admin: '#C0C0C0', // Silver (Admin)
  Management: '#CD7F32' // Bronze (Management)
});

export const CheckPermissions = Object.freeze({
  Administrator: Constants.Permissions.ADMINISTRATOR,
  Guild: Constants.Permissions.MANAGE_GUILD,
  Channels: Constants.Permissions.MANAGE_CHANNELS,
  Threads: Constants.Permissions.MANAGE_THREADS,
  Messages: Constants.Permissions.MANAGE_MESSAGES,
  Members: Constants.Permissions.MODERATE_MEMBERS
  // Webhooks: Constants.Permissions.MANAGE_WEBHOOKS,
  // Events: Constants.Permissions.MANAGE_EVENTS,
  // Roles: Constants.Permissions.MANAGE_ROLES,
  // GuildExpressions: Constants.Permissions.MANAGE_GUILD_EXPRESSIONS,
  // Nicknames: Constants.Permissions.MANAGE_NICKNAMES
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
