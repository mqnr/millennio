/* eslint-disable no-await-in-loop */
import { LegacyCanvasClient } from './legacy_canvas_client';
import { ConfigManager } from '../../util/config_manager';
import { Sender } from '../core/sender_replier';
import { StateManager } from '../../util/state_manager';
import { expandEventName } from '../school/expand_event_name';
import { htmlToMarkdown } from '../../util/util';
import * as log from '../../util/logging';
import { logger } from '../core/logger';

const config = new ConfigManager().school;

export class AnnouncementManager extends LegacyCanvasClient {
  client: any;
  sender: Sender;

  constructor(group: string, client: any, guildID: string, channelId: string) {
    super(group);
    this.client = client;
    this.sender = new Sender(client, guildID, channelId, '#e43d30');
  }

  async refresh(): Promise<void> {
    const stateManager = new StateManager(
      '../data/school/announcement_ids.json'
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const shortName of config.course_short_names) {
      const courseId = this.getCourseIdFromShortName(shortName);

      let response: any;
      let hadError = false;
      try {
        response = await this.getAnnouncements(courseId, true);
      } catch (e) {
        if (e.includes('No announcements for course')) {
          log.debug(e);
        } else {
          log.error(this.client, e);
        }
        hadError = true;
      }

      if (!hadError && Array.isArray(response) && response.length > 0) {
        const announcementId = response[0].id;

        let announcementState: any;
        try {
          announcementState = await stateManager.read();
        } catch (e) {
          throw new Error(`Error in reading announcement state: ${e}`);
        }

        const announcementStateForGroup = announcementState[this.group];
        const stateAnnouncementId = announcementStateForGroup[shortName];

        if (stateAnnouncementId !== announcementId) {
          logger.info(
            `Last announcement mismatch in ${courseId}: had ${stateAnnouncementId} and received ${announcementId}. Correcting...`
          );
          announcementState[this.group][shortName] = announcementId;
          let editResponse: any;
          try {
            // eslint-disable-next-line no-await-in-loop
            editResponse = await stateManager.edit(announcementState);
          } catch (e) {
            throw new Error(`Error in writing announcement state: ${e}`);
          }
          log.info(this.client, editResponse);

          let markdownBody: string = '';
          try {
            markdownBody = htmlToMarkdown(response[0].message);
          } catch (e) {
            throw new Error(
              `Error in parsing HTML body of announcement with ID ${announcementId} for group ${this.group}: ${e}`
            );
          }

          if (response[0].attachments.length > 0) {
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const i in response[0].attachments) {
              const iter = parseInt(i, 10);

              if (iter === 0) {
                markdownBody += '\n\n';
              }
              markdownBody += `**Archivo adjunto ${iter + 1}:** [${
                response[0].attachments[iter].filename
              }](${response[0].attachments[iter].url})`;

              if (iter !== response[0].attachments.length - 1) {
                markdownBody += '\n';
              }
            }
          }

          this.sender.sendAdvanced(
            response[0].author.display_name,
            response[0].author.avatar_image_url,
            `${expandEventName(shortName)}: ${response[0].title}`,
            markdownBody
          );
        }
      } else if (!hadError && !Array.isArray(response)) {
        logger.error(`Couldn't parse response: ${response}`);
      } else if (!hadError && response.length <= 0) {
        logger.error('No announcements received.');
      }
    }
  }
}
