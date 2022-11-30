import {
  CategoryChannel,
  Collection,
  Message,
  MessageAttachment,
  StageChannel,
  StoreChannel,
  VoiceChannel,
} from 'discord.js';
import { FormData } from 'formdata-node';
import { uploadFileForSubmission } from '../canvas/submissions';
import { ConfigManager } from '../../util/config_manager';
import { truncateString } from '../../util/util';
import { CanvasClient } from '../canvas/client';
import { ResourceDoesNotExistError, UnauthorizedError } from '../canvas/errors';
import { listAssignments } from '../canvas/assignments';
import { Embedder } from '../core/embedder';
import { resolveCourseToId } from './resolve_course';

const config = new ConfigManager();

function resolveCourseIdFromUserInput(input: string): string {
  // This function is unimplemented
  return input;
}

export async function canvasProcess(
  msg: Message,
  msgArray: string[]
): Promise<any> {
  const c = new CanvasClient(
    config.school.canvas_base_url,
    config.secrets.canvasTokenRemovedgroup1
  );

  switch (msgArray[0]) {
    case 'listassignments': {
      if (msgArray.length <= 1) {
        return msg.reply('You didn’t provide enough arguments.');
      }

      let courseId: string;
      try {
        courseId = resolveCourseToId('removedgroup', msgArray.slice(1).join());
      } catch (e) {
        return msg.reply('No course matched that name.');
      }

      let assignments: any;
      try {
        assignments = await listAssignments(
          c,
          courseId,
          new URLSearchParams({ per_page: '500' })
        );
      } catch (e) {
        if (e instanceof ResourceDoesNotExistError) {
          return msg.reply('No course with that ID was found.');
        }
        if (e instanceof UnauthorizedError) {
          return msg.reply(
            'You don’t have authorization to access that course.'
          );
        }

        return msg.reply(`There has been an error:\n**${e.message}**`);
      }

      if (!assignments.length) {
        msg.reply('No assignments found for that course.');
      }

      let msgPrep: string = '';
      for (const assignment of assignments) {
        const lockMessage = assignment.locked_for_user
          ? assignment.lock_explanation
          : assignment.locked_for_user;
        msgPrep += `**Name:** ${assignment.name}\n**Locked?** ${lockMessage}\n**ID:** ${assignment.id}\n\n`;
      }

      const courseInfo = await c.get(
        `/api/v1/courses/${courseId}`,
        new URLSearchParams()
      );
      const courseInfoJson = JSON.parse(await courseInfo.text());
      const courseName = courseInfoJson.name;

      return msg.reply(
        truncateString(
          `**Assignments for course “${courseName}”:**\n\n${msgPrep}`,
          1850
        )
      );
    }
    case 'submitassignment': {
      if (msgArray.length <= 2) {
        return msg.reply('You didn’t provide enough arguments.');
      }

      if (msg.author.id !== config.bot.owner_id) {
        return msg.reply(
          'Your Discord account doesn’t have a Canvas token associated with it, or hasn’t been granted permission to use this command.'
        );
      }

      const messageHasReferenceWhichHasAttachments = async (
        m: Message
      ): Promise<false | Collection<String, MessageAttachment>> => {
        if (m.reference !== null) {
          const channel = await m.client.channels.fetch(m.reference.channelId);
          if (
            !(channel instanceof CategoryChannel) &&
            !(channel instanceof StageChannel) &&
            !(channel instanceof StoreChannel) &&
            !(channel instanceof VoiceChannel)
          ) {
            const repliedMessage = await channel.messages.fetch(
              m.reference.messageId
            );
            return repliedMessage.attachments.size
              ? repliedMessage.attachments
              : false;
          }

          return false;
        }

        return false;
      };

      let toUse: Collection<String, MessageAttachment>;
      if (!msg.attachments.size) {
        const presumptive = await messageHasReferenceWhichHasAttachments(msg);
        if (presumptive === false) {
          return msg.reply('You need to provide some file to upload.');
        }
        toUse = presumptive;
      } else {
        toUse = msg.attachments;
      }

      let courseId: string;
      try {
        courseId = resolveCourseToId('removedgroup', msgArray[1]);
      } catch (e) {
        return msg.reply('No course matched that name.');
      }

      toUse.forEach(async (attachment) => {
        const formData = new FormData();
        formData.append('url', attachment.url);
        formData.append('submit_assignment', false);
        formData.append('name', attachment.name);
        formData.append('size', attachment.size);

        try {
          const uploadResp = await uploadFileForSubmission(
            c,
            courseId,
            msgArray[2],
            'self',
            formData
          );
          await msg.reply({
            embeds: [
              new Embedder(msg.author).embed(
                'Func uploadFileForSubmission returned text:',
                truncateString(`\`\`\`\n${uploadResp}\n\`\`\``, 3850)
              ),
            ],
          });
        } catch (e) {
          console.error(e);
          return msg.reply(
            `File upload failed with error:\n**${truncateString(
              e.message,
              150
            )}**`
          );
        }
      });

      return msg.reply('File submission successful.');
    }
    default:
    // do nothing
  }
}
