import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { matches, error, isLoading, reload } = useMatches();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>

      {matches === null ? (
        // Первая загрузка: списка ещё нет — либо крутилка, либо ошибка.
        error ? (
          <ErrorView message={error} onRetry={reload} />
        ) : (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        )
      ) : (
        <>
          {/* Повторная загрузка не удалась — показываем старый список и ошибку над ним. */}
          {error && !isLoading && <ErrorView message={error} onRetry={reload} compact />}
          <FlatList
            data={matches}
            keyExtractor={(match) => match.id}
            renderItem={({ item }) => <MatchCard match={item} />}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>Матчей пока нет</Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
}

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
  compact?: boolean;
};

function ErrorView({ message, onRetry, compact }: ErrorViewProps) {
  return (
    <View style={compact ? styles.errorBanner : styles.center}>
      <Text style={styles.errorText}>Не удалось загрузить матчи: {message}</Text>
      <Pressable onPress={onRetry} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>Повторить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  list: {
    gap: 8,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorBanner: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    gap: 8,
    alignItems: 'flex-start',
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
