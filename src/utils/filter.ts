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

// Для поиска: без учёта регистра, пробелов по краям и разницы «ё»/«е».
function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/ё/g, 'е');
}

function matchesQuery(match: Match, query: string): boolean {
  return (
    normalize(match.home.name).includes(query) || normalize(match.away.name).includes(query)
  );
}

// Фильтр по вкладке и поиск по названию клуба (хозяева или гости).
export function filterMatches(matches: Match[], filter: MatchFilter, query = ''): Match[] {
  const normalizedQuery = normalize(query);
  return matches.filter(
    (match) =>
      (filter === 'all' || categoryOf(match) === filter) &&
      (normalizedQuery === '' || matchesQuery(match, normalizedQuery)),
  );
}
