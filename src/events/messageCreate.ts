import { DMChannel, GuildChannel, Message } from 'discord.js';
import { MillennioClient } from '../lib/core/client';
import { MillennioEvent } from '../lib/core/event';
import { canvasProcess } from '../lib/school/canvas_process';
import * as log from '../util/logging';

export default class MessageCreateEvent extends MillennioEvent {
  constructor() {
    super('messageCreate', false);
  }

  static async execute(message: Message, client: MillennioClient) {
    if (message.author.bot) return;

    // Message pipeline
    if (message.content.startsWith('.')) {
      const info = MessageCreateEvent.judge(message);

      if (info.triggered) {
        const where =
          message.channel instanceof DMChannel
            ? 'through DMs'
            : `in #${(message.channel as GuildChannel).name}`;
        log.info(
          client,
          `${message.author.tag} triggered ${where} a message command: ${info.name}`
        );
      }
    } else if (message.channel instanceof DMChannel) {
      log.debug(`${message.author.tag} said: ${message.content}`);
    }
  }

  /**
   * Judges the execution path for a prefixed message.
   *
   * @param message A Discord Message.
   * @returns Whether the message triggered a command or not.
   */
  private static judge(message: Message): { triggered: boolean; name: string } {
    const msgArray = message.content.replace('.', '').split(' ');

    if (msgArray.length) {
      switch (msgArray[0].toLowerCase()) {
        case 'canvas':
          msgArray.shift();
          canvasProcess(message, msgArray);

          return { triggered: true, name: 'canvas' };
        default:
        // do nothing
      }
    }

    return { triggered: false, name: '' };
  }
}
