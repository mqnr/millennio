import { Sender } from '../core/sender_replier';
import { eventIsSpecial } from './event_type_determiner';
import { ZoomlinkGetterFormatter } from './zoomlink_formatter';
import { thereAreClasses } from './class_checker';
import * as log from '../../util/logging';
import { expandEventName } from '../school/expand_event_name';

const moduleName = 'removedschool module';
const removedschoolLogo = 'removedlogolink';

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
          const title = 'removedschool status';
          switch (event) {
            case 'removedeventcode1':
              return sender.sendAdvanced(
                moduleName,
                removedschoolLogo,
                title,
                'El día escolar ha empezado.'
              );
            case 'removedeventcode2':
              return sender.sendAdvanced(
                moduleName,
                removedschoolLogo,
                title,
                'El día escolar ha terminado.'
              );
            case 'removedsubjectcode1':
              return sender.sendAdvanced(
                moduleName,
                removedschoolLogo,
                title,
                '- [removedsubject](removedzoomlink)\n- [removedsubject](removedzoomlink)\n- [removedsubject](removedzoomlink)\n- [removedsubject](removedzoomlink)\n- [removedsubject](removedzoomlink)',
                roleMention
              );
            case 'removedsubjectcode2':
              return sender.sendAdvanced(
                moduleName,
                removedschoolLogo,
                title,
                'removedsubject está a punto de empezar.',
                roleMention
              );
            case 'removedeventcode3':
              return sender.sendAdvanced(
                moduleName,
                removedschoolLogo,
                title,
                'Ha empezado el receso.'
              );
            case 'removedeventcode4':
              return sender.sendAdvanced(
                moduleName,
                removedschoolLogo,
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
              removedschoolLogo,
              'removedschool link error',
              `Had the following error:\n**${e}**`
            );
          }

          zget
            .getAndFormatZoomlinks(course)
            .then((formattedZoomlink) =>
              sender.sendAdvanced(
                moduleName,
                removedschoolLogo,
                'removedschool link',
                formattedZoomlink,
                roleMention
              )
            )
            .catch((err) => {
              log.error(client, err);
              return sender.sendAdvanced(
                moduleName,
                removedschoolLogo,
                'removedschool link error',
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
