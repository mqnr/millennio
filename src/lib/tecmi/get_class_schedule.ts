import * as log from '../../util/logging';
import { StateManager } from '../../util/state_manager';

const horario603ClasesUrl =
  'https://cdn.discordapp.com/attachments/878026734056898580/932081367196500068/unknown.png';
const horario604ClasesUrl = 'https://e-pixel.github.io/chart.jpg';

const horarioSemestreUrl =
  'De momento, no se cuenta con un horario para el semestre.';

export function getClassScheduleUrl(
  client: any,
  context: string,
  group: string
): string {
  switch (context) {
    case 'examenes':
      return new StateManager('../data/school/exams.json').readSync().string;
    case 'semestre':
      return horarioSemestreUrl;
  }

  if (group === '603') {
    switch (context) {
      case 'clases':
        return horario603ClasesUrl;
      default:
        log.notify(
          client,
          `State error in getting class schedule: group ${group}, context ${context}`
        );
        return 'State error.';
    }
  } else if (group === '604') {
    switch (context) {
      case 'clases':
        return horario604ClasesUrl;
      default:
        log.notify(
          client,
          `State error in getting class schedule: group ${group}, context ${context}`
        );
        return 'State error.';
    }
  } else {
    log.notify(
      client,
      `State error in getting class schedule: group ${group}, context ${context}`
    );
    return 'State error.';
  }
}
