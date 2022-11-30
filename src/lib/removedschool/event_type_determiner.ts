const specialEvents: string[] = [
  'removedeventcode1',
  'removedeventcode2',
  'removedeventcode3',
  'removedeventcode4',
  'removedeventcode5',
  'removedeventcode6',
  'removedeventcode7',
];

export function eventIsSpecial(eventShortName: string): boolean {
  return specialEvents.indexOf(eventShortName) >= 0;
}
