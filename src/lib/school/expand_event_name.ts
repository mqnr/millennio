export function expandEventName(eventShortName: string): string {
  switch (eventShortName) {
    case 'removedsubjectcode1':
      return 'removedsubject1';
    case 'removedsubjectcode2':
      return 'removedsubject2';
    case 'removedsubjectcode3':
      return 'removedsubject3';
    case 'removedsubjectcode4':
      return 'removedsubject4';
    case 'removedsubjectcode5':
      return 'removedsubject5';
    case 'removedsubjectcode6':
      return 'removedsubject6';
    case 'removedeventcode':
      return 'removedevent1';
    case 'removedeventcode1':
      return 'removedevent2';
    case 'removedeventcode2':
      return 'removedevent3';
    case 'removedeventcode3':
      return 'removedevent4';
    case 'removedeventcode4':
      return 'removedevent5';
    case 'removedeventcode5':
      return 'removedevent6';
    default:
      throw new Error(
        `Invalid event short name for name expansion: ${eventShortName}`
      );
  }
}
