import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

function formatDate(createdAt) {
  if (!createdAt) return "Just now";
  return createdAt.toDate().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NoteCard({ note, onToggleFavorite, onEdit, onDelete }) {
  const swipeableRef = useRef(null);

  function runAction(action) {
    swipeableRef.current?.close();
    action(note);
  }

  function renderRightActions() {
    return (
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.favoriteButton]}
          onPress={() => runAction(onToggleFavorite)}
          accessibilityLabel={
            note.favorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Ionicons
            name={note.favorite ? "star" : "star-outline"}
            size={22}
            color="#ffffff"
          />
          <Text style={styles.actionText}>
            {note.favorite ? "Unfavorite" : "Favorite"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => runAction(onEdit)}
          accessibilityLabel="Edit note"
        >
          <Ionicons name="create-outline" size={22} color="#ffffff" />
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => runAction(onDelete)}
          accessibilityLabel="Delete note"
        >
          <Ionicons name="trash-outline" size={22} color="#ffffff" />
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
    >
      <View style={styles.card}>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
            {note.favorite && (
              <Ionicons name="star" size={15} color="#f5b301" />
            )}
          </View>
          {!!note.content && (
            <Text style={styles.preview} numberOfLines={2}>
              {note.content}
            </Text>
          )}
          <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
        </View>
        <Ionicons name="chevron-back" size={16} color="#cccccc" />
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: 12,
    borderRadius: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  body: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#292929",
  },
  preview: {
    fontSize: 13,
    color: "#6b6b6b",
    marginTop: 4,
    lineHeight: 18,
  },
  date: {
    fontSize: 11,
    color: "#aaaaaa",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 72,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  favoriteButton: {
    backgroundColor: "#f5b301",
  },
  editButton: {
    backgroundColor: "#3478f6",
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  },
});
