import { ZoomlinkGetter } from './get_zoomlinks';

export class ZoomlinkGetterFormatter extends ZoomlinkGetter {
  async getAndFormatZoomlinks(
    courseId: string,
    startDate?: any,
    endDate?: any
  ) {
    const datesFlag =
      (startDate && startDate !== '') || (endDate && endDate !== '');

    return new Promise<any>((resolve, reject) => {
      this.getZoomlink(courseId, startDate, endDate)
        .then((zoomlinks) => {
          let formattedZoomlinks = '';
          if (datesFlag) {
            for (const i in zoomlinks) {
              const dateStr = zoomlinks[i].date.toISOString().split('T')[0];
              formattedZoomlinks += `**${dateStr}:** [${zoomlinks[i].courseName}](${zoomlinks[i].url})`;
              if (parseInt(i) !== zoomlinks.length - 1) {
                formattedZoomlinks += '\n';
              }
            }
          } else {
            for (const i in zoomlinks) {
              formattedZoomlinks += `[${zoomlinks[i].courseName}](${zoomlinks[i].url})`;
              if (parseInt(i) !== zoomlinks.length - 1) {
                formattedZoomlinks += '\n';
              }
            }
          }
          resolve(formattedZoomlinks);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
