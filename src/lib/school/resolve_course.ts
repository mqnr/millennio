import { LegacyCanvasClient } from '../canvas/legacy_canvas_client';

/**
 * Resolves a course ID from a user-provided string.
 * @param course
 */
export function resolveCourseToString(course: string): string {
  switch (course) {
    case 'removedsubjectaliases1':
      return 'removedsubjectcode1';
    case 'removedsubjectaliases2':
      return 'removedsubjectcode2';
    case 'removedsubjectaliases3':
      return 'removedsubjectcode3';
    case 'removedsubjectaliases4':
      return 'removedsubjectcode4';
    case 'removedsubjectaliases5':
      return 'removedsubjectcode5';
    case 'removedsubjectaliases6':
      return 'removedsubjectcode6';
    case 'removedsubjectaliases7':
      return 'removedsubjectcode7';
    default:
      throw new Error('invalid course provided');
  }
}

export function resolveCourseToId(group: string, course: string): string {
  const canvas = new LegacyCanvasClient(group);
  return canvas.getCourseIdFromShortName(resolveCourseToString(course));
}
