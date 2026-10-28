import { Pressable, StyleSheet, Text } from "react-native";
export default function FilterButton({ title, onPress, active }) {
  return (
    <Pressable style={[styles.filterButton, active && styles.filterButtonActive]} onPress={onPress}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e7e7e7",
  },
  filterButtonActive: {
    backgroundColor: "#3478f6",
    borderColor: "#3478f6",
  },
  filterText: {
    fontSize: 13,
    color: "#555",
  },
  filterTextActive: {
    fontSize: 13,
    color: "#fff",
  },
});

