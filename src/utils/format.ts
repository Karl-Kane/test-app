import type { Match } from '../types';

// Дата и время начала в часовом поясе устройства: toLocaleString без timeZone
// берёт пояс системы, а строка из API — в UTC (суффикс Z).
export function formatStartsAt(startsAt: string | null): string {
  if (!startsAt) return 'Дата уточняется';

  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return 'Дата уточняется';

  return date.toLocaleString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatStatus(match: Match): string {
  switch (match.status) {
    case 'scheduled':
      return 'Не начался';
    case 'live':
      return match.minute != null ? `Идёт, ${match.minute}′` : 'Идёт';
    case 'finished':
      return 'Завершён';
    case 'postponed':
      return 'Перенесён';
    default:
      return 'Статус неизвестен';
  }
}
