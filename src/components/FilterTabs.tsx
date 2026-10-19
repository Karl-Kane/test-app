import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FILTER_LABELS, type MatchFilter } from '../utils/filter';

type Props = {
  value: MatchFilter;
  onChange: (filter: MatchFilter) => void;
};

const FILTERS = Object.keys(FILTER_LABELS) as MatchFilter[];

// Переключатель «Все / Предстоящие / Завершённые».
export function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {FILTERS.map((filter) => {
        const selected = filter === value;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={[styles.tab, selected && styles.tabSelected]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>
              {FILTER_LABELS[filter]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  tabSelected: {
    backgroundColor: '#111827',
  },
  text: {
    fontSize: 14,
    color: '#374151',
  },
  textSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
