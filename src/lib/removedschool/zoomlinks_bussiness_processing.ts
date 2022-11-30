import { parseISO } from 'date-fns';
import { LegacyCanvasClient } from '../canvas/legacy_canvas_client';
import { WordDetector } from '../../util/word_detector';
import { bannedZoomlinksGroupremoved1 } from './banned_zoomlinks';
// import { arraysEqual } from '../util/array_utils';
import { getDates } from '../../util/util';

export function zoomlinkBusinessProcessNormal(
  zoomlinks: any,
  courseId: string,
  event: Date,
  apiUrl: string,
  apiKey: string
): any {
  const canvas = new LegacyCanvasClient(apiUrl, apiKey);

  if (canvas.group === 'removedgroup1') {
    const detector = new WordDetector(bannedZoomlinksGroupremoved1);
    const zoomlinkstList = zoomlinks.filter((a) => !detector.detectsWords(a));
    // if (!arraysEqual(zoomlinks, zoomlinkstList)) {
    return zoomlinkstList;
    // }

    // switch (event.getDay()) {
    // case 1:
    // case 3:
    //   if (courseId === canvas.getCourseIdFromShortName('removedsubjectcode')) {
    //     zoomlinkstList.push('removedzoomlink1');
    //     return zoomlinkstList;
    //   }
    // case 2:
    // case 4:
    //   if (courseId === canvas.getCourseIdFromShortName('removedsubjectcode')) {
    //     zoomlinkstList.push('removedzoomlink2');
    //   }
    // }
  }

  return zoomlinks;
}

export function zoomlinkBusinessProcessExtra(
  courseId: string,
  startDateStr: string,
  endDateStr: string,
  apiUrl: string,
  apiKey: string
): any {
  const canvas = new LegacyCanvasClient(apiUrl, apiKey);
  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);
  const dateArray = getDates(startDate, endDate);

  const zobject = {
    courseName: '',
    date: startDate,
    url: '',
    group: '',
  };

  const zobjects = [zobject];

  for (const date of dateArray) {
    switch (date.getDay()) {
      case 1:
      case 3:
        if (
          courseId === canvas.getCourseIdFromShortName('removedsubjectcode') &&
          canvas.group === 'removedgroup'
        ) {
          const newZobject = {
            courseName: 'removedsubject',
            date,
            url: 'removedzoomlink',
            group: canvas.group,
          };
          zobjects.push(newZobject);
        }
        break;
      case 2:
      case 4:
        if (
          courseId === canvas.getCourseIdFromShortName('removedsubjectcode') &&
          canvas.group === 'removedgroup'
        ) {
          const newZobject = {
            courseName: 'removedsubject',
            date,
            url: 'removedzoomlink',
            group: canvas.group,
          };
          zobjects.push(newZobject);
        }
        break;
    }
  }

  zobjects.shift();
  if (zobjects.length === 0) {
    throw new Error('No new zoomlinks');
  }
  return zobjects;
}
