import TurndownService from 'turndown';

export function htmlToMarkdown(htmlInput: string): string {
  return new TurndownService().turndown(htmlInput);
}

export function arraysEqual(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}

export function getDates(startDate: Date, stopDate: Date): any {
  const dateArray = [];
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return dateArray;
}

export function truncateString(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n)}...`;
}

interface PluralMap {
  s: string;
  isare: string;
  hashave: string;
  yies: string;
}

export function plural(obj: Array<any> | Map<any, any>): PluralMap {
  return !(
    (Array.isArray(obj) && obj.length > 1) ||
    (obj instanceof Map && obj.size > 1)
  )
    ? { s: '', isare: 'is', hashave: 'has', yies: 'y' }
    : { s: 's', isare: 'are', hashave: 'have', yies: 'ies' };
}
