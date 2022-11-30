import { Interaction } from 'discord.js';
import { MillennioEvent } from '../lib/core/event';
import { MillennioClient } from '../lib/core/client';
import { logger } from '../lib/core/logger';

export default class InteractionCreateEvent extends MillennioEvent {
  constructor() {
    super('interactionCreate', false);
  }

  static async execute(interaction: Interaction, client: MillennioClient) {
    if (!interaction.isCommand()) {
      return;
    }
    if (interaction.options.getSubcommand(false) === null) {
      logger.info(
        `${interaction.user.tag} in #${
          (interaction.channel as any).name
        } triggered an interaction: ${interaction.commandName}`
      );
    } else {
      logger.info(
        `${interaction.user.tag} in #${
          (interaction.channel as any).name
        } triggered an interaction: ${
          interaction.commandName
        } ${interaction.options.getSubcommand(false)}`
      );
    }

    if (!client.commands.has(interaction.commandName)) return;

    try {
      const inter = client.commands.get(interaction.commandName) as any;
      await inter(interaction);
    } catch (error) {
      logger.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command.',
        ephemeral: true,
      });
    }
  }
}
