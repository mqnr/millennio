import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, DMChannel } from 'discord.js';
import { LegacyCanvasClient } from '../lib/canvas/legacy_canvas_client';
import { MillennioCommand } from '../lib/core/command';
import { ConfigManager } from '../util/config_manager';
import * as log from '../util/logging';
import { Replier, Retorter } from '../lib/core/sender_replier';
import { getGroupByGuildId, getGroupByMemberId } from '../lib/school/groups';

const config = new ConfigManager().school;

const cmdData = new SlashCommandBuilder()
  .setName('canvas')
  .setDescription('Varias utilidades para navegar Canvas.')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('courses')
      .setDescription('Obtiene información relacionada a los cursos.')
      .addStringOption((option) =>
        option
          .setName('target')
          .setDescription('La clase que se quiere.')
          .addChoice('Art and culture', 'sem6_art_and_culture')
          .addChoice('Cálculo integral', 'sem6_calculus')
          .addChoice('Habilidades y valores VI', 'sem6_habilidades')
          .addChoice('México en el siglo XXI', 'sem6_mexico')
          .addChoice('Pensamiento filosófico', 'sem6_philosophy')
          .addChoice('Scientific thought', 'sem6_science')
          .addChoice('Tecmi-wide', 'all')
          .setRequired(true)
      )
      .addStringOption((subcomandante) =>
        subcomandante
          .setName('action')
          .setDescription('La acción que se quiere.')
          .addChoice('List students', 'list_students')
          .addChoice('List teachers', 'list_teachers')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('grupo')
          .setDescription('El grupo para el cual se quiere la información.')
          .addChoice('603', '603')
          .addChoice('604', '604')
      )
  );

const cmdExecuter = async (interaction: CommandInteraction) => {
  let defaultGroupId: string;
  try {
    defaultGroupId = getGroupByMemberId(interaction.user.id).group_id;
  } catch (e) {
    if (interaction.channel instanceof DMChannel) {
      log.notify(
        interaction.client,
        `COMMAND "${interaction.commandName}" EXECUTED BY DM BY NON-TECMILENIO USER. OFFENDING USER TAG: ${interaction.user.tag} - OFFENDING USER ID: ${interaction.user.id}`
      );
      return interaction.reply(
        "You haven't been cleared to use this bot. This incident will be reported."
      );
    }

    try {
      defaultGroupId = getGroupByGuildId(interaction.guildId).group_id;
    } catch (err) {
      if (err.message.includes('no group with guild ID')) {
        log.notify(
          interaction.client,
          `COMMAND "${interaction.commandName}" EXECUTED OUTSIDE OF A TECMILENIO GUILD. OFFENDING GUILD ID: ${interaction.guildId}`
        );
      } else {
        log.error(interaction.client, err);
      }
    }
  }

  const replier = new Replier(interaction, '#e43d30');
  await replier.interaction.deferReply({
    ephemeral: !(interaction.channel instanceof DMChannel),
  });

  switch (interaction.options.getSubcommand()) {
    case 'courses': {
      const action = interaction.options.getString('action');
      const targetCourse = interaction.options.getString('target');
      let group = interaction.options.getString('grupo');
      if (!group) {
        group = defaultGroupId;
      }

      const canvas = new LegacyCanvasClient(group);
      let courseId: string;
      try {
        courseId =
          targetCourse === 'all'
            ? '25689'
            : canvas.getCourseIdFromShortName(targetCourse);
      } catch (e) {
        log.notify(
          interaction.client,
          `State error in command ${cmdData.name}: course short name was ${targetCourse}`
        );
        return replier.editReply(
          'Canvas course state error',
          'This incident will be reported.'
        );
      }

      let objective: string;
      if (action === 'list_students') {
        objective = 'student';
      } else if (action === 'list_teachers') {
        objective = 'teacher';
      } else {
        log.notify(
          interaction.client,
          `State error in command ${cmdData.name}: action was ${action}`
        );
        return replier.editReply(
          'Canvas course state error',
          'This incident will be reported.'
        );
      }

      canvas
        .listUsersInCourse(courseId, objective)
        .then(async (users) => {
          let messageBody: string = '';
          for (const i in users) {
            messageBody += `**Name:** ${users[i].name}\n**ID:** ${users[i].id}`;
            if (parseInt(i, 10) !== users.length - 1) {
              messageBody += '\n\n';
            }
          }
          const retorter = new Retorter(
            {
              replier: { interaction, color: replier.color },
              canEditOriginal: true,
            },
            '\n\n',
            650
          );
          return retorter.retort('Canvas courses response', messageBody);
        })
        .catch(async (e) => {
          log.error(interaction.client, e);
          return replier.editReply(
            'Canvas course error',
            `Command failed with following error:\n**${e}**`
          );
        });
      break;
    }
    default:
      log.notify(
        interaction.client,
        `State error in interaction with command ${
          cmdData.name
        }: subcommand ${interaction.options.getSubcommand()}`
      );
  }
};

export const cmd = new MillennioCommand(cmdData, cmdExecuter);
