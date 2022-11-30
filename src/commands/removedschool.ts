import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, DMChannel } from 'discord.js';
import { MillennioCommand } from '../lib/core/command';
import { Replier } from '../lib/core/sender_replier';
import { getClassScheduleUrl } from '../lib/removedschool/get_class_schedule';
import { changeCurrentEvent } from '../lib/removedschool/change_current_event';
import { StateManager } from '../util/state_manager';
import { ZoomlinkResolverGetterFormatter } from '../lib/removedschool/super_zoomlink';
import { ConfigManager } from '../util/config_manager';
import * as log from '../util/logging';
import { expandEventName } from '../lib/school/expand_event_name';
import { getGroupByGuildId, getGroupByMemberId } from '../lib/school/groups';

const config = new ConfigManager();

const cmdData = new SlashCommandBuilder()
  .setName('removedschool')
  .setDescription('Varias utilidades informacionales de removedschool.')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('horario')
      .setDescription('Manda el horario.')
      .addStringOption((option) =>
        option
          .setName('contexto')
          .setDescription('El horario que se quiere.')
          .addChoice('Clases', 'clases')
          .addChoice('Semestre', 'semestre')
          .addChoice('Exámenes', 'examenes')
      )
      .addStringOption((option) =>
        option
          .setName('grupo')
          .setDescription('El grupo de la clase que se quiere.')
          .addChoice('removedgroup1', 'removedgroup1')
          .addChoice('removedgroup2', 'removedgroup2')
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('link')
      .setDescription('Recupera un enlace a una clase.')
      .addStringOption((option) =>
        option
          .setName('clase')
          .setDescription('El link de clase que se quiere.')
          .addChoice('removedsubject1', 'removedsubjectcode1')
          .addChoice('removedsubject2', 'removedsubjectcode2')
          .addChoice('removedsubject3', 'removedsubjectcode3')
          .addChoice('removedsubject4', 'removedsubjectcode4')
          .addChoice('removedsubject5', 'removedsubjectcode5')
          .addChoice('removedsubject6', 'removedsubjectcode6')
          .addChoice('removedevent', 'removedeventcode')
      )
      .addStringOption((option) =>
        option
          .setName('grupo')
          .setDescription('El grupo de la clase que se quiere.')
          .addChoice('removedgroup1', 'removedgroup1')
          .addChoice('removedgroup2', 'removedgroup2')
      )
      .addStringOption((option) =>
        option
          .setName('fecha-de-inicio')
          .setDescription(
            'La fecha desde la que se deben recuperar links. Formato: yyyy-mm-dd'
          )
      )
      .addStringOption((option) =>
        option
          .setName('fecha-de-fin')
          .setDescription(
            'La fecha desde la que ya no se deben recuperar links. Formato: yyyy-mm-dd'
          )
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('clase-actual')
      .setDescription('Regresa la clase actual.')
      .addStringOption((option) =>
        option
          .setName('grupo')
          .setDescription('El grupo del cual la clase actual se quiere.')
          .addChoice('removedgroup1', 'removedgroup1')
          .addChoice('removedgroup2', 'removedgroup2')
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('cambiar-estado')
      .setDescription('Cambia el estado actual del grupo.')
      .addStringOption((option) =>
        option
          .setName('evento')
          .setDescription('El estado al que se quiere cambiar.')
          .addChoice('removedsubject1', 'removedsubjectcode1')
          .addChoice('removedsubject2', 'removedsubjectcode2')
          .addChoice('removedsubject3', 'removedsubjectcode3')
          .addChoice('removedsubject4', 'removedsubjectcode4')
          .addChoice('removedsubject5', 'removedsubjectcode5')
          .addChoice('removedsubject6', 'removedsubjectcode6')
          .addChoice('removedevent1', 'removedeventcode1')
          .addChoice('removedevent2', 'removedeventcode2')
          .addChoice('removedevent3', 'removedeventcode3')
          .addChoice('removedevent4', 'removedeventcode4')
          .addChoice('removedevent5', 'removedeventcode5')
          .addChoice('removedevent6', 'removedeventcode6')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('grupo')
          .setDescription('El grupo cuyo evento se quiere cambiar.')
          .addChoice('removedgroup1', 'removedgroup1')
          .addChoice('removedgroup2', 'removedgroup2')
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('cambiar-texto-examenes')
      .setDescription(
        'Comando de administrador: cambia el texto de /removedschool horario contexto:Exámenes.'
      )
      .addStringOption((option) =>
        option
          .setName('texto')
          .setDescription('El texto al que cambiar.')
          .setRequired(true)
      )
  );

const cmdExecuter = async (i: CommandInteraction) => {
  let defaultGroupId: string;
  try {
    defaultGroupId = getGroupByMemberId(i.user.id).group_id;
  } catch (e) {
    if (i.channel instanceof DMChannel) {
      log.notify(
        i.client,
        `COMMAND "${i.commandName}" EXECUTED BY DM BY NON-removedschool USER. OFFENDING USER TAG: ${i.user.tag} - OFFENDING USER ID: ${i.user.id}`
      );
      return i.reply(
        "You haven't been cleared to use this bot. This incident will be reported."
      );
    }

    try {
      defaultGroupId = getGroupByGuildId(i.guildId).group_id;
    } catch (err) {
      if (err.message.includes('no group with guild ID')) {
        log.notify(
          i.client,
          `COMMAND "${i.commandName}" EXECUTED OUTSIDE OF A removedschool GUILD. OFFENDING GUILD ID: ${i.guildId}`
        );
      } else {
        log.error(i.client, err);
      }
    }
  }

  const replier = new Replier(i, '#2ca645');
  await replier.interaction.deferReply({
    ephemeral: !(i.channel instanceof DMChannel),
  });

  switch (i.options.getSubcommand()) {
    case 'horario': {
      const context = i.options.getString('contexto')
        ? i.options.getString('contexto')
        : 'clases';
      let group = i.options.getString('grupo');
      if (!group) {
        group = defaultGroupId;
      }

      const classSchedule = getClassScheduleUrl(i.client, context, group);
      return replier.editReplyNormal(classSchedule);
    }
    case 'link': {
      let group = i.options.getString('grupo');
      const courseShortName = i.options.getString('clase');
      const startDate = i.options.getString('fecha-de-inicio');
      const endDate = i.options.getString('fecha-de-fin');

      let errorEnder = '';
      if (!group) {
        group = defaultGroupId;
      } else {
        errorEnder = ` para el grupo ${group}`;
      }

      if (courseShortName === 'removedeventcode') {
        return replier.editReply(
          'removedschool link response',
          '- [removedevent1](removedzoomlink1)\n- [removedevent2](removedzoomlink2)\n- [removedevent3](removedzoomlink3)\n- [removedevent4](removedzoomlink4)\n- [removedevent5](removedzoomlink5)'
        );
      }

      const zget = new ZoomlinkResolverGetterFormatter(group);

      zget
        .getResolveAndFormatZoomlinks(courseShortName, startDate, endDate)
        .then((response) => {
          const errorTitle = 'removedschool link error';
          if (response.shouldNotifyOfNoClass) {
            return replier.editReply(
              errorTitle,
              `Hoy no hay clases${errorEnder}.`
            );
          }
          if (response.isSpecial) {
            switch (response.event) {
              case 'removedeventcode1':
                return replier.editReply(
                  'removedschool link response',
                  '- [removedevent1](removedzoomlink1)\n- [removedevent2](removedzoomlink2)\n- [removedevent3](removedzoomlink3)\n- [removedevent4](removedzoomlink4)\n- [removedevent5](removedzoomlink5)'
                );
              case 'removedeventcode2':
                return replier.editReply(
                  errorTitle,
                  'Plan vocacional está en curso.'
                );
              case 'removedeventcode3':
                return replier.editReply(
                  errorTitle,
                  `El día escolar no ha empezado todavía${errorEnder}.`
                );
              case 'removedeventcode4':
                return replier.editReply(
                  errorTitle,
                  `El día escolar ha terminado${errorEnder}.`
                );
              case 'removedeventcode5':
                return replier.editReply(
                  errorTitle,
                  `Actualmente, es fin de semana.`
                );
              case 'removedeventcode6':
                return replier.editReply(
                  errorTitle,
                  `El receso está en curso${errorEnder}.`
                );
              default:
                log.notify(
                  i.client,
                  `Received invalid special event for group ${group}: ${response.event}`
                );
                return replier.editReply(
                  errorTitle,
                  'Received invalid special event.'
                );
            }
          } else {
            return replier.editReply(
              'removedschool link response',
              response.message
            );
          }
        })
        .catch((e) => {
          log.error(i.client, e);
          if (e.includes('No calendar events for course')) {
            log.debug(e);
            return replier.editReply(
              'removedschool link error',
              `No se encontaron eventos del calendario para esa clase.`
            );
          }
          if (e.includes('Invalid date or invalid datetime for')) {
            log.debug(e);
            return replier.editReply(
              'removedschool link error',
              'Has introducido una fecha inválida para la fecha de inicio o la fecha de fin. El formato correcto es el siguiente: `yyyy-MM-dd`.'
            );
          }
          log.error(i.client, e);
          return replier.editReply(
            'removedschool link error',
            `Received the following error:\n**${e}**`
          );
        });
      break;
    }
    case 'clase-actual': {
      const readCurrentEventManager = new StateManager(
        '../data/school/class_state.json'
      );
      let group = i.options.getString('grupo');
      let titleEnder = '';
      if (!group) {
        group = defaultGroupId;
      } else {
        titleEnder = ` for group ${group}`;
      }

      readCurrentEventManager
        .read()
        .then((classState) =>
          replier.editReply(
            `Current class response${titleEnder}`,
            `${expandEventName(classState[parseInt(group, 10)].currentEvent)}.`
          )
        )
        .catch((e) => {
          replier.editReply(
            `Current class error${titleEnder}`,
            `This command encountered the following error:\n**${e}**`
          );
          return log.notify(
            i.client,
            `Error in reading class state for group ${group}: ${e}`
          );
        });
      break;
    }
    case 'cambiar-estado': {
      const changeEventManager = new StateManager(
        '../data/school/class_state.json'
      );
      const eventShortName = i.options.getString('evento');
      let group = i.options.getString('grupo');
      let ender = '';
      if (!group) {
        group = defaultGroupId;
      } else {
        ender = ` para el grupo ${group}`;
      }

      if (
        i.user.id !== config.bot.owner_id &&
        i.user.id !== config.school.removedname_id
      ) {
        return replier.editReply(
          'removedschool change-status response',
          'Lo siento, no tienes suficientes permisos para hacer eso.'
        );
      }
      if (group === 'removedgroup' && i.user.id !== config.bot.owner_id) {
        return replier.editReply(
          'removedschool change-status response',
          'Lo siento, no tienes suficientes permisos para hacer eso.'
        );
      }

      changeCurrentEvent(
        i.client,
        changeEventManager,
        eventShortName,
        group,
        true
      );

      let eventName: string;
      try {
        eventName = expandEventName(eventShortName);
      } catch (e) {
        return replier.editReply(
          'removedschool change-class error',
          `Command returned the following error:\n**${e}**`
        );
      }
      return replier.editReply(
        'removedschool change-class response',
        `Clase cambiada a **${eventName}**${ender}.`
      );
    }
    case 'cambiar-texto-examenes': {
      const text: string = i.options.getString('texto');
      const manager = new StateManager('../data/school/exams.json');
      const prevText = manager.readSync().string;
      const obj = { string: text };
      await manager.edit(obj);
      return replier.editReply(
        'removedschool cambiar-texto-examenes response',
        `Text changed from:\n\`\`\`${prevText}\`\`\`\nto:\n\`\`\`${text}\`\`\``
      );
    }
    default:
      log.notify(
        i.client,
        `State error in interaction with command ${
          cmdData.name
        }: subcommand ${i.options.getSubcommand()}`
      );
  }
};

export const cmd = new MillennioCommand(cmdData, cmdExecuter);
