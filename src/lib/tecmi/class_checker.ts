import { StateManager } from '../../util/state_manager';
import { groupIdIsRegistered } from '../school/groups';

export function thereAreClasses(groupId: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    if (!groupIdIsRegistered(groupId)) {
      reject(`Unknown group ${groupId}`);
    }
    const manager = new StateManager('../data/school/class_state.json');

    manager
      .read()
      .then((classState) => resolve(classState[groupId].thereAreClasses))
      .catch((e) => reject(e));
  });
}
