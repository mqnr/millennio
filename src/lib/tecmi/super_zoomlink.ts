import { StateManager } from '../../util/state_manager';
import { thereAreClasses } from './class_checker';
import { eventIsSpecial } from './event_type_determiner';
import { ZoomlinkGetterFormatter } from './zoomlink_formatter';

export class ZoomlinkResolverGetterFormatter extends ZoomlinkGetterFormatter {
  async getResolveAndFormatZoomlinks(
    eventShortName: any,
    startDate: any,
    endDate: any
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const manager = new StateManager('../data/school/class_state.json');

      const itsToday = (date) => {
        const today = new Date();
        return today.toISOString().split('T')[0] === date;
      };

      let classStatusIsRelevant: boolean = false;
      let haveToResolveCourse: boolean = false;
      if (!startDate && !endDate) {
        classStatusIsRelevant = true;
      }
      if (startDate === endDate) {
        if (itsToday(startDate)) {
          classStatusIsRelevant = true;
        }
      }
      if (startDate && !endDate) {
        if (itsToday(startDate)) {
          classStatusIsRelevant = true;
        }
      }
      if (!startDate && endDate) {
        if (itsToday(endDate)) {
          classStatusIsRelevant = true;
        }
      }

      if (!(eventShortName && eventShortName !== '')) {
        haveToResolveCourse = true;
      }

      if (classStatusIsRelevant) {
        thereAreClasses(this.group)
          .then((response) => {
            if (response === true) {
              if (haveToResolveCourse) {
                manager
                  .read()
                  .then((stateObject) => {
                    const currentEventShortName =
                      stateObject[parseInt(this.group)].currentEvent;
                    if (eventIsSpecial(currentEventShortName)) {
                      const returnedObject = {
                        event: currentEventShortName,
                        message: '',
                        isSpecial: true,
                        shouldNotifyOfNoClass: false,
                      };
                      resolve(returnedObject);
                    } else {
                      this.getAndFormatZoomlinks(
                        this.getCourseIdFromShortName(currentEventShortName),
                        startDate,
                        endDate
                      )
                        .then((formattedzoomlinks) => {
                          const returnedObject = {
                            event: currentEventShortName,
                            message: formattedzoomlinks,
                            isSpecial: false,
                            shouldNotifyOfNoClass: false,
                          };
                          resolve(returnedObject);
                        })
                        .catch((err) =>
                          reject(`Error in getting and formatting URLs: ${err}`)
                        );
                    }
                  })
                  .catch((e) => reject(`Error in resolving course: ${e}`));
              } else {
                this.getAndFormatZoomlinks(
                  this.getCourseIdFromShortName(eventShortName),
                  startDate,
                  endDate
                )
                  .then((formattedzoomlinks) => {
                    const returnedObject = {
                      event: eventShortName,
                      message: formattedzoomlinks,
                      isSpecial: false,
                      shouldNotifyOfNoClass: false,
                    };
                    resolve(returnedObject);
                  })
                  .catch((err) =>
                    reject(`Error in getting and formatting URLs: ${err}`)
                  );
              }
            } else if (response === false) {
              const returnedObject = {
                event: eventShortName,
                message: '',
                isSpecial: false,
                shouldNotifyOfNoClass: true,
              };
              resolve(returnedObject);
            }
          })
          .catch((e) => reject(`Error in class status verification: ${e}`));
      }

      if (haveToResolveCourse) {
        manager
          .read()
          .then((stateObject) => {
            const currentEventShortName =
              stateObject[parseInt(this.group)].currentEvent;
            if (eventIsSpecial(currentEventShortName)) {
              const returnedObject = {
                event: currentEventShortName,
                message: '',
                isSpecial: true,
                shouldNotifyOfNoClass: false,
              };
              resolve(returnedObject);
            } else {
              this.getAndFormatZoomlinks(
                this.getCourseIdFromShortName(currentEventShortName),
                startDate,
                endDate
              )
                .then((formattedzoomlinks) => {
                  const returnedObject = {
                    event: currentEventShortName,
                    message: formattedzoomlinks,
                    isSpecial: false,
                    shouldNotifyOfNoClass: false,
                  };
                  resolve(returnedObject);
                })
                .catch((err) =>
                  reject(`Error in getting and formatting URLs: ${err}`)
                );
            }
          })
          .catch((e) => reject(`Error in resolving course: ${e}`));
      } else {
        this.getAndFormatZoomlinks(
          this.getCourseIdFromShortName(eventShortName),
          startDate,
          endDate
        )
          .then((formattedzoomlinks) => {
            const returnedObject = {
              event: eventShortName,
              message: formattedzoomlinks,
              isSpecial: false,
              shouldNotifyOfNoClass: false,
            };
            resolve(returnedObject);
          })
          .catch((err) =>
            reject(`Error in getting and formatting URLs: ${err}`)
          );
      }
    });
  }
}
