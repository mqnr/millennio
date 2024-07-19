const specialEvents: string[] = [
  'hasnt_started',
  'day_started',
  'day_ended',
  'sem6_optative',
  'sem6_vocation',
  'weekend',
  'recess',
];

export function eventIsSpecial(eventShortName: string): boolean {
  return specialEvents.indexOf(eventShortName) >= 0;
}
