import { scheduleJob } from 'node-schedule';
import { getGroupById, MillennioGroup } from './groups';
import { StateManager } from '../../util/state_manager';
import { changeCurrentEvent } from '../tecmi/change_current_event';
import { eventNotify } from '../tecmi/event_notify';
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
  scheduleJob({ rule: cronstring, tz: 'America/Hermosillo' }, () => {
    switch (startModifier) {
      case '-603-1':
        changeCurrentEvent(client, manager, 'sem6_optative', group, force);
        break;
      case '-603-2':
        changeCurrentEvent(client, manager, 'sem6_philosophy', group, force);
        break;
      case '-604-1':
        changeCurrentEvent(client, manager, 'sem6_optative', group, force);
        break;
      case '-604-2':
        changeCurrentEvent(client, manager, 'sem6_calculus', group, force);
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

  scheduleJob({ rule: cronstring, tz: 'America/Hermosillo' }, () => {
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
          'In time: class status changed to "hasn\'t started" for groups 603 and 604'
        );
        changeCurrentEvent(client, manager, 'hasnt_started', '603', false);
        await sleep(5000);
        changeCurrentEvent(client, manager, 'hasnt_started', '604', false);

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
          'In time: class status changed to "hasn\'t started" for group 604'
        );
        changeCurrentEvent(client, manager, 'hasnt_started', '604', false);

        break;
      default:
      // no default
    }
  }
}

export function scheduleEvents(client: any): void {
  checkInTime(client);

  let group603: MillennioGroup;
  let group604: MillennioGroup;
  try {
    group603 = getGroupById('603');
  } catch (e) {
    throw new Error(e);
  }

  try {
    group604 = getGroupById('604');
  } catch (e) {
    throw new Error(e);
  }

  const classes603 = new Map([
    ['00 00 * * 1-5', 'hasnt_started-DONTSEND'], // Mon Tue Wed Thu Fri 00:00 - Hasn't started
    ['50 6 * * 1,3,5', 'day_started-603-1'], // Mon Wed Fri 06:50 - Comienzo del día escolar
    ['57 6 * * 1,3,5', 'sem6_optative'], // Mon Wed Fri 06:57 - Optativa
    ['27 8 * * 1', 'sem6_art_and_culture'], // Mon 08:27 - Art and culture
    ['57 9 * * 1', 'sem6_mexico'], // Mon 09:57 - México en el siglo XXI
    ['27 11 * * 1', 'sem6_habilidades'], // Mon 11:27 - Habilidades y valores VI
    ['00 14 * * 1', 'day_ended'], // Mon Fri 14:00 - Se termina el día
    ['50 6 * * 2,4', 'day_started-603-2'], // Tue Thu 06:50 - Comienzo del día escolar
    ['27 11 * * 1', 'sem6_habilidades'], // Mon 11:27 - Habilidades y valores VI
    ['57 6 * * 2,4', 'sem6_philosophy'], // Tue Thu 06:57 - Pensamiento filosófico
    ['30 9 * * 2', 'recess'], // Tue 09:30 - Receso
    ['57 09 * * 2,4', 'sem6_vocation'], // Tue Thu 09:57 - Plan vocacional
    ['57 10 * * 2,4', 'sem6_calculus'], // Tue Thu 10:57 - Cálculo integral
    ['30 13 * * 2', 'day_ended'], // Tue 13:30 - Se termina el día
    ['27 8 * * 3,5', 'sem6_science'], // Wed Fri 08:27 - Scientific thought
    ['00 10 * * 3,5', 'recess'], // Wed Fri 10:00 - Receso
    ['27 10 * * 3', 'sem6_art_and_culture'], // Wed 10:27 - Art and culture
    ['00 12 * * 3', 'day_ended'], // Wed 12:00 - Se termina el día
    ['00 9 * * 4', 'recess'], // Thu 09:00 - Receso
    ['00 13 * * 4', 'day_ended'], // Tue 13:00 - Se termina el día
    ['27 10 * * 5', 'sem6_mexico'], // Fri 10:27 - México en el siglo XXI
    ['57 11 * * 5', 'sem6_habilidades'], // Fri 11:57 - Habilidades y valores VI
    ['00 14 * * 5', 'FORCE-weekend'], // Fri 14:00 - Empieza el fin de semana
  ]);

  const classes604 = new Map([
    ['01 00 * * 1-5', 'hasnt_started-DONTSEND'], // Mon Tue Wed Thu Fri 00:00 - Hasn't started
    ['49 6 * * 1,3,5', 'day_started-604-1'], // Mon Wed Fri 06:49 - Comienzo del día escolar
    ['56 6 * * 1,3,5', 'sem6_optative'], // Mon Wed Fri 06:56 - Optativa
    ['26 8 * * 1', 'sem6_habilidades'], // Mon 08:26 - Habilidades y valores VI
    ['26 10 * * 1,5', 'sem6_mexico'], // Mon Fri 10:26 - México en el siglo XXI
    ['59 11 * * 1', 'day_ended'], // Mon 11:59 - Se termina el día
    ['49 6 * * 2,4', 'day_started-604-2'], // Tue Thu 06:49 - Comienzo del día escolar
    ['56 6 * * 2,4', 'sem6_calculus'], // Tue Thu 06:56 - Cálculo integral
    ['29 9 * * 2', 'recess'], // Tue 09:29 - Receso
    ['56 09 * * 2,4', 'sem6_vocation'], // Tue Thu 09:56 - Plan vocacional
    ['56 10 * * 2,4', 'sem6_philosophy'], // Tue Thu 10:56 - Plan vocacional
    ['29 13 * * 2', 'day_ended'], // Tue 13:29 - Se termina el día
    ['26 8 * * 3', 'sem6_art_and_culture'], // Wed 08:26 - Art and culture
    ['56 09 * * 3,5', 'recess'], // Wed 09:56 - Receso
    ['26 10 * * 3', 'sem6_science'], // Wed 10:26 - Scientific thought
    ['56 11 * * 3', 'sem6_habilidades'], // Wed 11:56 - Habilidades y valores VI
    ['29 14 * * 3', 'day_ended'], // Wed 14:29 - Se termina el día
    ['56 8 * * 4', 'recess'], // Thu 08:56 - Receso
    ['56 12 * * 4', 'day_ended'], // Thu 12:56 - Se termina el día
    ['26 8 * * 5', 'sem6_art_and_culture'], // Fri 08:26 - Art and culture
    ['56 11 * * 5', 'sem6_science'], // Fri 11:56 - Scientific thought
    ['29 13 * * 5', 'FORCE-weekend'], // Fri 13:29 - Empieza el fin de semana
  ]);

  const groups = [group603, group604];
  const maps = [classes603, classes604];

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
        value.endsWith('-603-1') ||
        value.endsWith('-603-2') ||
        value.endsWith('-604-1') ||
        value.endsWith('-604-2')
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
