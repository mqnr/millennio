import { Sender } from '../core/sender_replier';
import { eventIsSpecial } from './event_type_determiner';
import { ZoomlinkGetterFormatter } from './zoomlink_formatter';
import { thereAreClasses } from './class_checker';
import * as log from '../../util/logging';
import { expandEventName } from '../school/expand_event_name';

const moduleName = 'Tecmilenio module';
const tecmiLogo =
  'https://cdn.discordapp.com/attachments/899341481435865139/902646882151571546/tecmi-logo.png';

export function eventNotify(
  client,
  event,
  group,
  guildId,
  channelId,
  roleMention
) {
  const sender = new Sender(client, guildId, channelId, '#2ca645');

  thereAreClasses(group.toString())
    .then((areThere) => {
      if (areThere) {
        if (eventIsSpecial(event)) {
          const title = 'Tecmi status';
          switch (event) {
            case 'day_started':
              return sender.sendAdvanced(
                moduleName,
                tecmiLogo,
                title,
                'El día escolar ha empezado.'
              );
            case 'day_ended':
              return sender.sendAdvanced(
                moduleName,
                tecmiLogo,
                title,
                'El día escolar ha terminado.'
              );
            case 'sem6_optative':
              return sender.sendAdvanced(
                moduleName,
                tecmiLogo,
                title,
                '- [Bienestar integral](https://tecmilenio.zoom.us/j/87188501102)\n- [Ciencia y tecnología para el desarrollo](https://tecmilenio.zoom.us/j/87695764858)\n- [Escenarios mundiales](https://itesm.zoom.us/j/94066380747)\n- [Negocios éxitosos](https://tecmilenio.zoom.us/j/89541920269)\n- [Sistemas de la información para la competitividad](https://tecmilenio.zoom.us/j/88246037114)',
                roleMention
              );
            case 'sem6_vocation':
              return sender.sendAdvanced(
                moduleName,
                tecmiLogo,
                title,
                'Plan vocacional está a punto de empezar.',
                roleMention
              );
            case 'recess':
              return sender.sendAdvanced(
                moduleName,
                tecmiLogo,
                title,
                'Ha empezado el receso.'
              );
            case 'weekend':
              return sender.sendAdvanced(
                moduleName,
                tecmiLogo,
                title,
                'Ha empezado el fin de semana.'
              );
            default:
              log.error(
                client,
                `Invalid special event for event notifier: ${event}`
              );
          }
        } else {
          const zget = new ZoomlinkGetterFormatter(group.toString());
          let course: string;
          try {
            course = zget.getCourseIdFromShortName(event);
          } catch (e) {
            log.error(client, e);
            return sender.sendAdvanced(
              moduleName,
              tecmiLogo,
              'Tecmi link error',
              `Had the following error:\n**${e}**`
            );
          }

          zget
            .getAndFormatZoomlinks(course)
            .then((formattedZoomlink) =>
              sender.sendAdvanced(
                moduleName,
                tecmiLogo,
                'Tecmi link',
                formattedZoomlink,
                roleMention
              )
            )
            .catch((err) => {
              log.error(client, err);
              return sender.sendAdvanced(
                moduleName,
                tecmiLogo,
                'Tecmi link error',
                `No se ha podido determinar un enlace de Zoom para la materia de **${expandEventName(
                  event
                )}**. Usa los medios oficiales para obtener el enlace, si lo hay.`
              );
            });
        }
      }
    })
    .catch((e) => log.error(client, e));
}
