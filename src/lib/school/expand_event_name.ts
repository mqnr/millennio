export function expandEventName(eventShortName: string): string {
  switch (eventShortName) {
    case 'sem6_art_and_culture':
      return 'Art and culture';
    case 'sem6_calculus':
      return 'Cálculo integral';
    case 'sem6_habilidades':
      return 'Habilidades y valores VI';
    case 'sem6_mexico':
      return 'México en el siglo XXI';
    case 'sem6_philosophy':
      return 'Pensamiento filosófico';
    case 'sem6_science':
      return 'Scientific thought';
    case 'sem6_optative':
      return 'Optativa';
    case 'sem6_vocation':
      return 'Plan vocacional';
    case 'hasnt_started':
      return 'Día sin empezar';
    case 'day_ended':
      return 'Día terminado';
    case 'recess':
      return 'Receso';
    case 'weekend':
      return 'Fin de semana';
    default:
      throw new Error(
        `Invalid event short name for name expansion: ${eventShortName}`
      );
  }
}
