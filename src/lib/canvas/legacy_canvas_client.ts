import { XMLHttpRequest } from 'xmlhttprequest-ts';
import { ConfigManager } from '../util/config_manager';

const config = new ConfigManager();

export class LegacyCanvasClient {
  apiUrl: string;
  apiKey: string;
  group: string;

  constructor(urlOrGroup: string, token?: string) {
    if (!token) {
      if (urlOrGroup === '603' || urlOrGroup === '604') {
        this.group = urlOrGroup;
        if (urlOrGroup === '603') {
          this.apiUrl = config.school.canvas_base_url;
          this.apiKey = config.secrets.canvasToken603;
        } else if (urlOrGroup === '604') {
          this.apiUrl = config.school.canvas_base_url;
          this.apiKey = config.secrets.canvasToken604;
        } else {
          throw new Error(`Invalid group ${urlOrGroup}`);
        }
      }
    } else {
      this.apiUrl = urlOrGroup;
      this.apiKey = token;
      if (token === config.secrets.canvasToken603) {
        this.group = '603';
      } else if (token === config.secrets.canvasToken604) {
        this.group = '604';
      } else {
        throw new Error('Unknown Canvas token');
      }
    }
  }

  getCourseIdFromShortName(courseShortName: string): string {
    switch (this.group) {
      case '603':
        switch (courseShortName) {
          case 'sem6_art_and_culture':
            return '90032';
          case 'sem6_calculus':
            return '90058';
          case 'sem6_habilidades':
            return '90001';
          case 'sem6_mexico':
            return '90037';
          case 'sem6_philosophy':
            return '90044';
          case 'sem6_science':
            return '90017';
          default:
            throw new Error(
              `Invalid course short name for group ${this.group}: ${courseShortName}`
            );
        }
      case '604':
        switch (courseShortName) {
          case 'sem6_art_and_culture':
            return '90036';
          case 'sem6_calculus':
            return '90060';
          case 'sem6_habilidades':
            return '90007';
          case 'sem6_mexico':
            return '89968';
          case 'sem6_philosophy':
            return '90048';
          case 'sem6_science':
            return '90023';
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
      case '603':
        switch (course) {
          case '90032':
          case '90058':
          case '90001':
          case '90037':
          case '90044':
          case '90017':
            return;
          default:
            throw new Error(
              `Invalid course ID for group ${this.group}: ${course}`
            );
        }
      case '604':
        switch (course) {
          case '90036':
          case '90060':
          case '90007':
          case '89968':
          case '90048':
          case '90023':
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
