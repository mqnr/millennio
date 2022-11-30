import { XMLHttpRequest } from 'xmlhttprequest-ts';
import { ConfigManager } from '../../util/config_manager';

const config = new ConfigManager();

export class LegacyCanvasClient {
  apiUrl: string;
  apiKey: string;
  group: string;

  constructor(urlOrGroup: string, token?: string) {
    if (!token) {
      if (urlOrGroup === 'removedgroup1' || urlOrGroup === 'removedgroup2') {
        this.group = urlOrGroup;
        if (urlOrGroup === 'removedgroup1') {
          this.apiUrl = config.school.canvas_base_url;
          this.apiKey = config.secrets.canvasTokenRemovedgroup1;
        } else if (urlOrGroup === 'removedgroup2') {
          this.apiUrl = config.school.canvas_base_url;
          this.apiKey = config.secrets.canvasTokenRemovedgroup2;
        } else {
          throw new Error(`Invalid group ${urlOrGroup}`);
        }
      }
    } else {
      this.apiUrl = urlOrGroup;
      this.apiKey = token;
      if (token === config.secrets.canvasTokenRemovedgroup1) {
        this.group = 'removedgroup1';
      } else if (token === config.secrets.canvasTokenRemovedgroup2) {
        this.group = 'removedgroup2';
      } else {
        throw new Error('Unknown Canvas token');
      }
    }
  }

  getCourseIdFromShortName(courseShortName: string): string {
    switch (this.group) {
      case 'removedgroup1':
        switch (courseShortName) {
          case 'removedsubjectcode1':
            return 'removedid1';
          case 'removedsubjectcode2':
            return 'removedid2';
          case 'removedsubjectcode3':
            return 'removedid3';
          case 'removedsubjectcode4':
            return 'removedid4';
          case 'removedsubjectcode5':
            return 'removedid5';
          case 'removedsubjectcode6':
            return 'removedid6';
          default:
            throw new Error(
              `Invalid course short name for group ${this.group}: ${courseShortName}`
            );
        }
      case 'removedgroup2':
        switch (courseShortName) {
          case 'removedsubjectcode1':
            return 'removedid1';
          case 'removedsubjectcode2':
            return 'removedid2';
          case 'removedsubjectcode3':
            return 'removedid3';
          case 'removedsubjectcode4':
            return 'removedid4';
          case 'removedsubjectcode5':
            return 'removedid5';
          case 'removedsubjectcode6':
            return 'removedid6';
          default:
            throw new Error(
              `Invalid course short name for group ${this.group}: ${courseShortName}`
            );
        }
      default:
        throw new Error(
          `Invalid group for retrieval of course ID from short name: ${this.group}`
        );
    }
  }

  validateCourseId(course: string): void {
    switch (this.group) {
      case 'removedgroup1':
        switch (course) {
          case 'removedid1':
          case 'removedid2':
          case 'removedid3':
          case 'removedid4':
          case 'removedid5':
          case 'removedid6':
            return;
          default:
            throw new Error(
              `Invalid course ID for group ${this.group}: ${course}`
            );
        }
      case 'removedgroup2':
        switch (course) {
          case 'removedid1':
          case 'removedid2':
          case 'removedid3':
          case 'removedid4':
          case 'removedid5':
          case 'removedid6':
            return;
          default:
            throw new Error(
              `Invalid course ID for group ${this.group}: ${course}`
            );
        }
      default:
        throw new Error(
          `Invalid group for course ID validation: ${this.group}`
        );
    }
  }

  async listAssignments(courseId: string) {
    const ceventGroup = this.group;
    return new Promise<any>((resolve, reject) => {
      try {
        this.validateCourseId(courseId);
      } catch (e) {
        reject(e);
      }

      const url = `${this.apiUrl}/api/v1/courses/${courseId}/assignments?per_page=500`;

      const request = new XMLHttpRequest();
      request.open('GET', url);

      request.setRequestHeader('Authorization', `Bearer ${this.apiKey}`);

      request.send();

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          let assignments: any;
          try {
            assignments = JSON.parse(request.responseText);
          } catch (e) {
            reject(
              `Unable to parse JSON in response for assignments retrieval for course ${courseId} and group ${ceventGroup}: ${request.responseText}`
            );
          }
          if (Array.isArray(assignments)) {
            if (assignments.length > 0) {
              resolve(assignments);
            } else {
              reject(
                `No assignments for course ${courseId} in group ${ceventGroup}`
              );
            }
          } else {
            reject(
              `Invalid response for assignments retrieval for course ${courseId} and group ${ceventGroup}: ${request.responseText}`
            );
          }
        }
      };
    });
  }

  async listCalendarEvents(
    courseId: string,
    type?: 'event' | 'assignment',
    startDate?: string,
    endDate?: string
  ) {
    const ceventGroup = this.group;
    return new Promise<any>((resolve, reject) => {
      if (!startDate) {
        let today = new Date();
        const offset = today.getTimezoneOffset();
        today = new Date(today.getTime() - offset * 60 * 1000);
        startDate = today.toISOString().split('T')[0];
      }
      if (!endDate) {
        endDate = startDate;
      }
      if (!type) {
        type = 'event';
      }

      try {
        this.validateCourseId(courseId);
      } catch (e) {
        reject(e);
      }

      const url = `${this.apiUrl}/api/v1/calendar_events?context_codes[]=course_${courseId}&type=${type}&start_date=${startDate}&end_date=${endDate}`;

      const request = new XMLHttpRequest();
      request.open('GET', url);

      request.setRequestHeader('Authorization', `Bearer ${this.apiKey}`);

      request.send();

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          let calendarEvents: any;
          try {
            calendarEvents = JSON.parse(request.responseText);
          } catch (e) {
            reject(
              `Unable to parse JSON in response for calendar events retrieval for course ${courseId} and group ${ceventGroup}: ${request.responseText}`
            );
          }
          if (Array.isArray(calendarEvents)) {
            if (calendarEvents.length > 0) {
              resolve(calendarEvents);
            } else {
              reject(
                `No calendar events for course ${courseId} in group ${ceventGroup}`
              );
            }
          } else {
            reject(
              `Invalid response for calendar events retrieval for course ${courseId} and group ${ceventGroup}: ${request.responseText}`
            );
          }
        }
      };
    });
  }

  async listUsersInCourse(courseId: string, searchTerm: string): Promise<any> {
    const lusersGroup = this.group;
    return new Promise<any>((resolve, reject) => {
      const url = `${this.apiUrl}/api/v1/courses/${courseId}/users?per_page=500&enrollment_type[]=${searchTerm}`;

      const request = new XMLHttpRequest();
      request.open('GET', url);

      request.setRequestHeader('Authorization', `Bearer ${this.apiKey}`);

      request.send();

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          let usersList: any;
          try {
            usersList = JSON.parse(request.responseText);
          } catch (e) {
            reject(
              `Unable to parse JSON in response for users retrieval for course ${courseId} and group ${lusersGroup}: ${request.responseText}`
            );
          }
          if (Array.isArray(usersList)) {
            if (usersList.length > 0) {
              resolve(usersList);
            } else {
              reject(
                `No users received for course ${courseId} in group ${lusersGroup}`
              );
            }
          } else {
            reject(
              `Invalid response for users retrieval for course ${courseId} and group ${lusersGroup}: ${request.responseText}`
            );
          }
        }
      };
    });
  }

  async getAnnouncements(courseId: string, latestOnly: boolean): Promise<any> {
    const lannonGroup = this.group;
    return new Promise<any>((resolve, reject) => {
      try {
        this.validateCourseId(courseId);
      } catch (e) {
        reject(e);
      }

      const url = `${
        this.apiUrl
      }/api/v1/announcements?context_codes[]=course_${courseId}&latest_only=${latestOnly.toString()}&start_date=2022-01-01&end_date=2022-06-30`;

      const request = new XMLHttpRequest();
      request.open('GET', url);

      request.setRequestHeader('Authorization', `Bearer ${this.apiKey}`);

      request.send();

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          let announcements: any;
          try {
            announcements = JSON.parse(request.responseText);
          } catch (e) {
            reject(
              `Unable to parse JSON in response for last announcement retrieval for course ${courseId} and group ${lannonGroup}: ${request.responseText}`
            );
          }
          if (Array.isArray(announcements)) {
            if (announcements.length > 0) {
              resolve(announcements);
            } else {
              reject(
                `No announcements for course ${courseId} in group ${lannonGroup}`
              );
            }
          } else {
            reject(
              `Invalid response for last announcement retrieval for course ${courseId} and group ${lannonGroup}: ${request.responseText}`
            );
          }
        }
      };
    });
  }
}
