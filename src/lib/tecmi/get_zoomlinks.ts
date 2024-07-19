import { parseISO } from 'date-fns';
import { LegacyCanvasClient } from '../canvas/legacy_canvas_client';
import {
  zoomlinkBusinessProcessExtra,
  zoomlinkBusinessProcessNormal,
} from './zoomlinks_bussiness_processing';
import { listCalendarEvents } from '../canvas/calendar_events';
import { CanvasClient } from '../canvas/client';

export async function getZoomlinks(
  c: CanvasClient,
  course: string,
  startDate?: string,
  endDate?: string
) {
  if (!startDate) {
    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);
    startDate = today.toISOString().split('T')[0];
  }

  if (!endDate) {
    endDate = startDate;
  }

  return new Promise<any>((resolve, reject) => {
    listCalendarEvents(
      c,
      new URLSearchParams({
        type: 'event',
        start_date: startDate,
        end_date: endDate,
      })
    )
      .then((calendarEvents) => {
        const regex =
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
        const zobject = {
          courseName: '',
          date: parseISO(startDate),
          url: '',
          group: '',
        };
        const zoomlinksArray = [zobject];
        for (const i in calendarEvents) {
          if (calendarEvents[i].description != undefined) {
            const ceventCourseId = calendarEvents[i].context_code.split('_')[1];
            const event = parseISO(calendarEvents[i].start_at.split('T')[0]);
            let zoomlinks = calendarEvents[i].description.match(regex);

            zoomlinks = zoomlinkBusinessProcessNormal(
              zoomlinks,
              ceventCourseId,
              event,
              this.apiUrl,
              this.apiKey
            );

            if (zoomlinks.length > 0) {
              for (const ix in zoomlinks) {
                const zobject = {
                  courseName: calendarEvents[i].context_name,
                  date: event,
                  url: zoomlinks[ix],
                  group: this.group,
                };
                zoomlinksArray.push(zobject);
              }
            }
          }
        }

        if (Array.isArray(zoomlinksArray)) {
          zoomlinksArray.shift();
          if (zoomlinksArray.length > 0) {
            resolve(zoomlinksArray);
          }
        }
        reject(
          `No valid zoomlinks for course ${course} and group ${this.group} and start date ${startDate} and end date ${endDate}`
        );
      })
      .catch((e) => {
        let zlinkArray: any;
        try {
          zlinkArray = zoomlinkBusinessProcessExtra(
            course,
            startDate,
            endDate,
            this.apiUrl,
            this.apiKey
          );
        } catch (err) {
          reject(e);
        }
        resolve(zlinkArray);
      });
  });
}

export class ZoomlinkGetter extends LegacyCanvasClient {
  async getZoomlink(course: string, startDate?: string, endDate?: string) {
    if (!startDate) {
      let today = new Date();
      const offset = today.getTimezoneOffset();
      today = new Date(today.getTime() - offset * 60 * 1000);
      startDate = today.toISOString().split('T')[0];
    }
    if (!endDate) {
      endDate = startDate;
    }
    return new Promise<any>((resolve, reject) => {
      this.listCalendarEvents(course, 'event', startDate, endDate)
        .then((calendarEvents) => {
          const zobject = {
            courseName: '',
            date: parseISO(startDate),
            url: '',
            group: '',
          };
          const zoomlinksArray = [zobject];
          const regex =
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
          for (const i in calendarEvents) {
            if (calendarEvents[i].description != undefined) {
              const ceventCourseId =
                calendarEvents[i].context_code.split('_')[1];
              const event = parseISO(calendarEvents[i].start_at.split('T')[0]);
              let zoomlinks = calendarEvents[i].description.match(regex);

              zoomlinks = zoomlinkBusinessProcessNormal(
                zoomlinks,
                ceventCourseId,
                event,
                this.apiUrl,
                this.apiKey
              );

              if (zoomlinks.length > 0) {
                for (const ix in zoomlinks) {
                  const zobject = {
                    courseName: calendarEvents[i].context_name,
                    date: event,
                    url: zoomlinks[ix],
                    group: this.group,
                  };
                  zoomlinksArray.push(zobject);
                }
              }
            }
          }

          if (Array.isArray(zoomlinksArray)) {
            zoomlinksArray.shift();
            if (zoomlinksArray.length > 0) {
              resolve(zoomlinksArray);
            }
          }
          reject(
            `No valid zoomlinks for course ${course} and group ${this.group} and start date ${startDate} and end date ${endDate}`
          );
        })
        .catch((e: any) => {
          let zlinkArray: any;
          try {
            zlinkArray = zoomlinkBusinessProcessExtra(
              course,
              startDate,
              endDate,
              this.apiUrl,
              this.apiKey
            );
          } catch (err) {
            reject(e);
          }
          resolve(zlinkArray);
        });
    });
  }
}
