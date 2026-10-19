import { useCallback, useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Раньше было Boolean(indexOf(id)): для отсутствующего id это Boolean(-1) === true,
  // а для id на позиции 0 — Boolean(0) === false, то есть ровно наоборот.
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  // Новый массив вместо push/splice: React сравнивает state по ссылке и не
  // перерисовывает экран, если передать тот же мутированный массив.
  // Функциональная форма — чтобы быстрые нажатия подряд не затирали друг друга.
  const toggle = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favoriteId) => favoriteId !== id) : [...prev, id],
    );
  }, []);

  return { favorites, isFavorite, toggle };
}
