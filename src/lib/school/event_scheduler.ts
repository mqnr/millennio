import { scheduleJob } from 'node-schedule';
import { getGroupById, MillennioGroup } from './groups';
import { StateManager } from '../../util/state_manager';
import { changeCurrentEvent } from '../removedschool/change_current_event';
import { eventNotify } from '../removedschool/event_notify';
import { AnnouncementManager } from '../canvas/announcements_manager';
import * as log from '../../util/logging';

const manager = new StateManager('../data/school/class_state.json');

function setEvent(
  cronstring: string,
  group: string,
  event: string,
  force: boolean,
  shouldSend: boolean,
  startModifier: string,
  client: any,
  guildID?: any,
  channelId?: any,
  roleMention?: string
): void {
  scheduleJob({ rule: cronstring, tz: 'removedtimezone' }, () => {
    switch (startModifier) {
      case '-removedgroup1-1':
        changeCurrentEvent(
          client,
          manager,
          'removedsubjectcode1',
          group,
          force
        );
        break;
      case '-removedgroup1-2':
        changeCurrentEvent(
          client,
          manager,
          'removedsubjectcode2',
          group,
          force
        );
        break;
      case '-removedgroup2-1':
        changeCurrentEvent(
          client,
          manager,
          'removedsubjectcode3',
          group,
          force
        );
        break;
      case '-removedgroup2-2':
        changeCurrentEvent(
          client,
          manager,
          'removedsubjectcode4',
          group,
          force
        );
        break;
      default:
        changeCurrentEvent(client, manager, event, group, force);
    }
    if (shouldSend) {
      eventNotify(client, event, group, guildID, channelId, roleMention);
    }
  });
  log.info(
    null,
    `Scheduled ${cronstring} for group ${group.toString()} and event ${event}, with parameters: force: ${force}, shouldSend: ${shouldSend}, startModifier: ${startModifier}`
  );
}

export function setAnnouncementWatcher(
  client: any,
  groupId: string,
  cronstring: string = '*/5 * * * *'
): void {
  const announcementManagerGroup = getGroupById(groupId);
  const announcementManager = new AnnouncementManager(
    announcementManagerGroup.group_id.toString(),
    client,
    announcementManagerGroup.canvas_guild_id,
    announcementManagerGroup.canvas_channel_id
  );
  try {
    announcementManager.refresh();
  } catch (e) {
    log.error(client, e);
  }

  scheduleJob({ rule: cronstring, tz: 'removedtimezone' }, () => {
    if (announcementManagerGroup.canvas_channel_id) {
      try {
        announcementManager.refresh();
        log.debug('Checked Canvas announcements.');
      } catch (e) {
        throw new Error(e);
      }
    }
  });
}

function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkInTime(client: any): Promise<void> {
  const startTimeNormal = 0 * 60 + 0;
  const endTimeNormal = 6 * 60 + 53;

  const today = new Date();
  const inTimeNormal = () => {
    const time = today.getHours() * 60 + today.getMinutes();
    return time >= startTimeNormal && time < endTimeNormal;
  };

  const startTimeExtra = 0 * 60 + 0;
  const endTimeExtra = 9 * 60 + 53;

  const inTimeExtra = () => {
    const time = today.getHours() * 60 + today.getMinutes();
    return time >= startTimeExtra && time < endTimeExtra;
  };

  if (inTimeNormal()) {
    switch (today.getDay()) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        log.info(
          client,
          'In time: class status changed to "hasn\'t started" for groups removedgroup1 and removedgroup2'
        );
        changeCurrentEvent(
          client,
          manager,
          'removedeventcode',
          'removedgroup1',
          false
        );
        await sleep(5000);
        changeCurrentEvent(
          client,
          manager,
          'removedeventcode',
          'removedgroup2',
          false
        );

        break;
      default:
      // do nothing
    }
  }

  await sleep(10000);

  if (inTimeExtra()) {
    switch (today.getDay()) {
      case 3:
        log.info(
          client,
          'In time: class status changed to "hasn\'t started" for group removedgroup2'
        );
        changeCurrentEvent(
          client,
          manager,
          'removedeventcode',
          'removedgroup2',
          false
        );

        break;
      default:
      // no default
    }
  }
}

export function scheduleEvents(client: any): void {
  checkInTime(client);

  let groupRemovedgroup1: MillennioGroup;
  let groupRemovedgroup2: MillennioGroup;
  try {
    groupRemovedgroup1 = getGroupById('removedgroup1');
  } catch (e) {
    throw new Error(e);
  }

  try {
    groupRemovedgroup2 = getGroupById('removedgroup2');
  } catch (e) {
    throw new Error(e);
  }

  const classesRemovedgroup1 = new Map([['00 00 * * 1', 'removedschedule']]);

  const classesRemovedgroup2 = new Map([['00 00 * * 1', 'removedschedule']]);

  const groups = [groupRemovedgroup1, groupRemovedgroup2];
  const maps = [classesRemovedgroup1, classesRemovedgroup2];

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const i in maps) {
    maps[i].forEach((value: string, key: string) => {
      let force: boolean = false;
      if (value.startsWith('FORCE-')) {
        force = true;
        // eslint-disable-next-line no-param-reassign
        value = value.replace('FORCE-', '');
      }
      let shouldSend: boolean = true;
      if (value.endsWith('-DONTSEND') || !groups[i].canvas_channel_id) {
        shouldSend = false;
        // eslint-disable-next-line no-param-reassign
        value = value.replace('-DONTSEND', '');
      }
      let startModifier: string = '';
      if (
        value.endsWith('-removedgroup1-1') ||
        value.endsWith('-removedgroup1-2') ||
        value.endsWith('-removedgroup2-1') ||
        value.endsWith('-removedgroup2-2')
      ) {
        startModifier = value.slice(-6);
        // eslint-disable-next-line no-param-reassign
        value = value.replace(startModifier, '');
      }

      if (!shouldSend) {
        setEvent(
          key,
          groups[i].group_id,
          value,
          force,
          shouldSend,
          startModifier,
          client
        );
      } else {
        setEvent(
          key,
          groups[i].group_id,
          value,
          force,
          shouldSend,
          startModifier,
          client,
          groups[i].zoomlink_guild_id,
          groups[i].zoomlink_channel_id,
          groups[i].zoomlink_role_mention
        );
      }
    });
  }
}
