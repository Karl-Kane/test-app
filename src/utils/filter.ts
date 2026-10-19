import type { Match } from '../types';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export const FILTER_LABELS: Record<MatchFilter, string> = {
  all: 'Все',
  upcoming: 'Предстоящие',
  finished: 'Завершённые',
};

// К какой вкладке относится матч (кроме «Все»).
// live и postponed — в «Предстоящих»: матч ещё не сыгран до конца, результат впереди.
// Неизвестный статус никуда не относим — такой матч виден только во «Всех».
function categoryOf(match: Match): Exclude<MatchFilter, 'all'> | null {
  switch (match.status) {
    case 'scheduled':
    case 'live':
    case 'postponed':
      return 'upcoming';
    case 'finished':
      return 'finished';
    default:
      return null;
  }
}

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  if (filter === 'all') return matches;
  return matches.filter((match) => categoryOf(match) === filter);
}
