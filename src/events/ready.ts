import { MillennioClient } from '../lib/core/client';
import { MillennioEvent } from '../lib/core/event';
import {
  setAnnouncementWatcher,
  scheduleEvents,
} from '../lib/school/event_scheduler';
import * as log from '../util/logging';

export default class ReadyEvent extends MillennioEvent {
  constructor() {
    super('ready', true);
  }

  static async execute(client: MillennioClient) {
    scheduleEvents(client);
    setAnnouncementWatcher(client, '603', '*/15 * * * * *');
    log.notify(client, `Ready. Logged in as ${client.user.tag}`);
  }
}
