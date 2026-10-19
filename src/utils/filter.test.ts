/// <reference types="node" />
// Тесты на встроенном раннере Node (node:test) — без Jest и прочих зависимостей.
// Запуск: npm test (нужен Node 22.18+, который умеет запускать .ts напрямую).
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { Match } from '../types.ts';
import { filterMatches } from './filter.ts';

function makeMatch(id: string, status: string, home: string, away: string): Match {
  return {
    id,
    startsAt: null,
    status,
    home: { id: `${id}-home`, name: home, city: '' },
    away: { id: `${id}-away`, name: away, city: '' },
    score: null,
  };
}

const matches: Match[] = [
  makeMatch('finished', 'finished', 'Зенит', 'Спартак'),
  makeMatch('live', 'live', 'Динамо', 'Рубин'),
  makeMatch('scheduled', 'scheduled', 'Крылья Советов', 'Ахмат'),
  makeMatch('postponed', 'postponed', 'Балтика', 'Факел'),
  makeMatch('unknown', 'cancelled', 'Оренбург', 'Динамо Махачкала'),
];

const ids = (list: Match[]) => list.map((match) => match.id);

describe('filterMatches: вкладки', () => {
  test('«Все» показывает все матчи, включая неизвестные статусы', () => {
    assert.deepEqual(ids(filterMatches(matches, 'all')), ids(matches));
  });

  test('«Предстоящие» — scheduled, live и postponed', () => {
    assert.deepEqual(ids(filterMatches(matches, 'upcoming')), ['live', 'scheduled', 'postponed']);
  });

  test('«Завершённые» — только finished', () => {
    assert.deepEqual(ids(filterMatches(matches, 'finished')), ['finished']);
  });

  test('пустой список остаётся пустым', () => {
    assert.deepEqual(filterMatches([], 'upcoming'), []);
  });
});

describe('filterMatches: поиск по клубу', () => {
  test('ищет и по хозяевам, и по гостям, без учёта регистра', () => {
    assert.deepEqual(ids(filterMatches(matches, 'all', 'динамо')), ['live', 'unknown']);
    assert.deepEqual(ids(filterMatches(matches, 'all', 'СПАРТАК')), ['finished']);
  });

  test('не различает «ё» и «е» и обрезает пробелы', () => {
    const withYo = [makeMatch('yo', 'scheduled', 'Сокол', 'Химки-Ёлка')];
    assert.deepEqual(ids(filterMatches(withYo, 'all', '  елка ')), ['yo']);
  });

  test('поиск сочетается с вкладкой', () => {
    assert.deepEqual(ids(filterMatches(matches, 'finished', 'динамо')), []);
    assert.deepEqual(ids(filterMatches(matches, 'upcoming', 'динамо')), ['live']);
  });

  test('пустой запрос ничего не отфильтровывает', () => {
    assert.deepEqual(ids(filterMatches(matches, 'all', '   ')), ids(matches));
  });
});
