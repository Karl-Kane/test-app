import { useCallback, useEffect, useRef, useState } from 'react';
import { MATCHES_URL } from '../config';
import type { Match, MatchesResponse } from '../types';

type State = {
  matches: Match[] | null;
  error: string | null;
  isLoading: boolean;
  // Момент последней успешной загрузки — для подписи «Обновлено N сек назад».
  updatedAt: Date | null;
};

const initialState: State = {
  matches: null,
  error: null,
  isLoading: true,
  updatedAt: null,
};

async function fetchMatches(): Promise<Match[]> {
  const response = await fetch(MATCHES_URL);
  if (!response.ok) {
    throw new Error(`Сервер ответил ${response.status}`);
  }

  const data = (await response.json()) as Partial<MatchesResponse>;
  if (!Array.isArray(data.matches)) {
    throw new Error('Неожиданный формат ответа');
  }
  return data.matches;
}

// Загрузка матчей. reload() используется и для «Повторить», и для обновления:
// уже загруженный список при этом остаётся на экране.
export function useMatches() {
  const [state, setState] = useState<State>(initialState);
  // Номер последнего запроса: ответ устаревшего запроса игнорируем.
  const requestId = useRef(0);

  const reload = useCallback(async () => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const matches = await fetchMatches();
      if (id !== requestId.current) return;
      setState({ matches, error: null, isLoading: false, updatedAt: new Date() });
    } catch (e) {
      if (id !== requestId.current) return;
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    reload();
    // При размонтировании «устаревают» все запросы, setState не вызовется.
    return () => {
      requestId.current++;
    };
  }, [reload]);

  return { ...state, reload };
}
