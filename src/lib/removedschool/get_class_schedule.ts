import * as log from '../../util/logging';
import { StateManager } from '../../util/state_manager';

const horarioRemovedgroup1ClasesUrl = 'removedurl1';
const horarioRemovedgroup2ClasesUrl = 'removedurl2';

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

  if (group === 'removedgroup1') {
    switch (context) {
      case 'clases':
        return horarioRemovedgroup1ClasesUrl;
      default:
        log.notify(
          client,
          `State error in getting class schedule: group ${group}, context ${context}`
        );
        return 'State error.';
    }
  } else if (group === 'removedgroup2') {
    switch (context) {
      case 'clases':
        return horarioRemovedgroup2ClasesUrl;
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
