import { LegacyCanvasClient } from '../canvas/legacy_canvas_client';

/**
 * Resolves a course ID from a user-provided string.
 * @param course
 */
export function resolveCourseToString(course: string): string {
  switch (course) {
    case 'sem6_art_and_culture':
    case 'aac':
    case 'art_and_culture':
    case 'art and culture':
    case 'art-and-culture':
    case 'artandculture':
    case 'arte y cultura':
    case 'arte_y_cultura':
    case 'arte-y-cultura':
    case 'arteycultura':
    case 'arte':
    case 'art':
    case 'culture':
    case 'cultura':
    case '90032':
      return 'sem6_art_and_culture';
    case 'sem6_calculus':
    case 'ci':
    case 'ic':
    case 'cal':
    case 'mat':
    case 'integral_calculus':
    case 'calc':
    case 'integral':
    case 'calculus':
    case 'calculo':
    case 'mate':
    case 'matematicas':
    case 'matemáticas':
    case 'math':
    case 'mathematics':
    case 'cálculo':
    case 'cálculo integral':
      return 'sem6_calculus';
    case 'sem6_habilidades':
    case 'habilidades y valores vi':
    case 'habi':
    case 'habilidades y valores 6':
    case 'hyv':
    case 'hyv6':
    case 'hyvvi':
    case 'hab':
    case 'habilidades':
    case 'abilities':
    case 'abilities and values':
    case 'values':
    case 'valores':
    case 'valores 6':
    case 'valores vi':
    case 'habilidades 6':
    case 'habilidades vi':
      return 'sem6_habilidades';
    case 'sem6_mexico':
    case 'meesx':
    case 'meex':
    case 'mexico':
    case 'mex':
    case 'méx':
    case 'méxico':
    case 'hist':
    case 'historia':
    case 'history':
    case 'méxico en el siglo xxi':
    case 'siglo xxi':
    case 'siglo 21':
    case '21':
    case 'xxi':
    case 'mexico en el siglo xxi':
    case 'méxico en el siglo 21':
    case 'mexico en el siglo 21':
    case 'mexico in the 21st century':
    case 'siglo':
    case 'century':
    case '21st century':
      return 'sem6_mexico';
    case 'sem6_philosophy':
    case 'pf':
    case 'phi':
    case 'filosofia':
    case 'filosofía':
    case 'fil':
    case 'philosophy':
    case 'phil':
    case 'filo':
    case 'pensamiento filosófico':
    case 'pensamiento filosofico':
    case 'pensamiento filósofico':
    case 'filosofico':
    case 'filósofico':
    case 'filosófico':
    case 'philosophical thought':
      return 'sem6_philosophy';
    case 'sem6_science':
    case 'st':
    case 'scith':
    case 'scth':
    case 'cien':
    case 'scienc':
    case 'sci':
    case 'cienc':
    case 'scientific thought':
    case 'scientific':
    case 'science':
    case 'research':
    case 'paper':
    case 'papers':
    case 'academic writing':
    case 'academic':
    case 'investigacion':
    case 'investigación':
    case 'investigation':
    case 'cientifico':
    case 'científico':
    case 'pensamiento científico':
    case 'ciencia':
    case 'ciencias':
      return 'sem6_science';
    case 'sem6_optative':
    case 'optative':
    case 'optativa':
    case 'sdiplc':
    case 'opt':
    case 'optv':
    case 'optav':
    case 'sist':
    case 'syst':
    case 'sistemas':
    case 'informacion':
    case 'información':
    case 'sistemas de informacion':
    case 'sistemas de información':
    case 'sistemas de informacion para la competitividad':
    case 'sistemas de información para la competitividad':
    case 'systems':
    case 'system':
    case 'sys':
    case 'sis':
    case 'info':
    case 'information':
    case 'information system':
    case 'information systems':
    case 'information systems for competitivity':
    case 'info sys':
    case 'info system':
    case 'info systems':
    case 'infosys':
      return 'sem6_optative';
    default:
      throw new Error('invalid course provided');
  }
}

export function resolveCourseToId(group: string, course: string): string {
  const canvas = new LegacyCanvasClient(group);
  return canvas.getCourseIdFromShortName(resolveCourseToString(course));
}
