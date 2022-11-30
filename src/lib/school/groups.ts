import { Snowflake } from 'discord-api-types';
import { ConfigManager } from '../../util/config_manager';

const config = new ConfigManager().school;

/**
 * An interface representing a Millennio group.
 */
export interface MillennioGroup {
  /**
   * The Group's ID.
   */
  group_id: string;
  /**
   * The ID list of Discord guilds corresponding to the Group.
   */
  guild_ids: Snowflake[];
  /**
   * The ID of the guild where the Group is to send Canvas announcements.
   */
  canvas_guild_id: Snowflake | null | '';
  /**
   * The ID of the channel where the Group is to send Canvas announcements.
   */
  canvas_channel_id: Snowflake | null | '';
  /**
   * The Id of the guild where the Group is to send Zoom URLs.
   */
  zoomlink_guild_id: Snowflake | null | '';
  /**
   * The ID of the channel where the Group is to send Zoom URLs.
   */
  zoomlink_channel_id: Snowflake | null | '';
  /**
   * The string (meant to mention a role) that the Group is to include in every relevant Zoom URL message.
   */
  zoomlink_role_mention: string | null | '';
  /**
   * The Discord IDs of every known member of the Group.
   */
  known_member_ids: Snowflake[];
}

/**
 * Gets all Millennio groups in the configuration file.
 *
 * @returns {MillennioGroup} All Millennio groups.
 */
export function allGroups(): MillennioGroup[] {
  return config.groups;
}

/**
 * Gets a Millennio group by its group ID (`group_id` field.)
 *
 * @param groupId The group ID of the desired group.
 * @returns {MillennioGroup} The found Millennio group.
 */
export function getGroupById(groupId: string): MillennioGroup {
  const r = allGroups().filter((g) => g.group_id === groupId);
  if (r.length === 1) {
    return r[0];
  }

  if (r.length > 1) {
    throw new Error(`more than one group object with ID ${groupId}`);
  }

  throw new Error(`no group with ID ${groupId}`);
}

/**
 * Gets a Millennio group by a member ID in its `member_ids` field.
 *
 * @param id The member ID in the desired group.
 * @returns {MillennioGroup} The found Millennio group.
 */
export function getGroupByMemberId(id: string): MillennioGroup {
  const r = allGroups().filter((g) => g.known_member_ids.includes(id));
  if (r.length === 1) {
    return r[0];
  }

  if (r.length > 1) {
    throw new Error(`more than one group object with member ID ${id}`);
  }

  throw new Error(`no group with member ID ${id}`);
}

/**
 * Gets a Millennio group by a guild ID in its `guild_ids` field.
 *
 * @param id The guild ID in the desired group.
 * @returns {MillennioGroup} The found Millennio group.
 */
export function getGroupByGuildId(id: string): MillennioGroup {
  const r = allGroups().filter((g) => g.guild_ids.includes(id));
  if (r.length === 1) {
    return r[0];
  }

  if (r.length > 1) {
    throw new Error(`more than one group object guild ID ${id}`);
  }

  throw new Error(`no group with guild ID ${id}`);
}

/**
 * Checks if a Millennio group is registered in the configuration file.
 *
 * @param groupId The group ID to check.
 * @returns {boolean} Whether the group ID is registered.
 */
export function groupIdIsRegistered(groupId: string): boolean {
  const r = allGroups().filter((g) => g.group_id === groupId);
  return r.length > 0;
}
