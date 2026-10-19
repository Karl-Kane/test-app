// Типы ответа сервера — см. пример в data/matches.json.

// Статусы, которые встречаются в данных. Сервер может прислать и новый статус,
// поэтому в Match.status допускаем любую строку и обрабатываем неизвестные отдельно.
export type KnownMatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  // ISO-строка в UTC; null, если дата неизвестна (например, матч перенесён).
  startsAt: string | null;
  status: KnownMatchStatus | (string & {});
  // Минута матча — есть только у идущих матчей.
  minute?: number;
  home: Team;
  away: Team;
  // null, пока матч не начался.
  score: Score | null;
};

export type MatchesResponse = {
  round: number;
  matches: Match[];
};
