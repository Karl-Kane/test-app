import { StyleSheet, Text, View } from 'react-native';
import type { Match } from '../types';
import { formatStartsAt, formatStatus } from '../utils/format';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

// Карточка матча: команды, счёт (если есть), дата начала, статус и звёздочка.
export function MatchCard({ match, isFavorite, onToggleFavorite }: Props) {
  const { home, away, score, status } = match;
  const isLive = status === 'live';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatStartsAt(match.startsAt)}</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.status, isLive && styles.statusLive]}>{formatStatus(match)}</Text>
          <FavoriteButton active={isFavorite} onPress={() => onToggleFavorite(match.id)} />
        </View>
      </View>

      <View style={styles.teams}>
        <Text style={styles.team} numberOfLines={2}>
          {home.name}
        </Text>
        <Text style={styles.score}>{score ? `${score.home} : ${score.away}` : '– : –'}</Text>
        <Text style={[styles.team, styles.teamAway]} numberOfLines={2}>
          {away.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 13,
    color: '#6b7280',
  },
  status: {
    fontSize: 13,
    color: '#6b7280',
  },
  statusLive: {
    color: '#ef3124',
    fontWeight: '600',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  team: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  teamAway: {
    textAlign: 'right',
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 64,
    textAlign: 'center',
  },
});
