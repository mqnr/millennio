import { StateManager } from '../../util/state_manager';
import * as log from '../../util/logging';

export function changeCurrentEvent(
  client: any,
  stateManager: StateManager,
  courseShortName: string,
  group: string,
  force: boolean
) {
  stateManager.read().then((classState) => {
    classState[group].currentEvent = courseShortName;
    if (classState[group].thereAreClasses || force) {
      stateManager
        .edit(classState)
        .then((reply) => log.info(client, reply))
        .catch((e) => log.error(client, e));
    }
  });
}
