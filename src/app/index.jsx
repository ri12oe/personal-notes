import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterButton from "../components/FilterButton";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import { auth } from "../firebase/firebaseConfig";
import {
  createNote,
  removeNote,
  subscribeToNotes,
  updateNote,
} from "../services/noteService";

function authErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/missing-password":
      return "Please enter a password.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled in Firebase.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function confirmDelete(note, onConfirm) {
  const message = `Delete "${note.title}"? This can't be undone.`;
  if (Platform.OS === "web") {
    if (window.confirm(message)) onConfirm();
    return;
  }
  Alert.alert("Delete note", message, [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: onConfirm },
  ]);
}

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    return subscribeToNotes(user.uid, setNotes, (error) => {
      console.log(error);
      Alert.alert("Error", "Could not load your notes.");
    });
  }, [user]);

  function openAddModal() {
    setEditingNote(null);
    setModalVisible(true);
  }

  function openEditModal(note) {
    setEditingNote(note);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingNote(null);
  }

  async function saveNote(noteData) {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData);
      } else if (user) {
        await createNote(noteData, user.uid);
      }
      closeModal();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not save the note.");
    }
  }

  function toggleFavorite(note) {
    updateNote(note.id, { favorite: !note.favorite }).catch(console.log);
  }

  function deleteNote(note) {
    confirmDelete(note, () => removeNote(note.id).catch(console.log));
  }

  async function handleAuth(action) {
    setAuthError("");
    try {
      await action(auth, email.trim(), password);
      setEmail("");
      setPassword("");
    } catch (error) {
      setAuthError(authErrorMessage(error));
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      setNotes([]);
      setFilter("All");
    } catch (error) {
      console.log(error);
    }
  }

  if (!authReady) {
    return <SafeAreaView style={styles.container} />;
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>My Notes</Text>
          <Text style={styles.loginSubtitle}>Sign in to continue</Text>
          <TextInput
            style={styles.loginInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.loginInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {!!authError && <Text style={styles.errorText}>{authError}</Text>}
          <Pressable
            style={styles.loginButton}
            onPress={() => handleAuth(signInWithEmailAndPassword)}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </Pressable>
          <Pressable
            style={styles.createAccountButton}
            onPress={() => handleAuth(createUserWithEmailAndPassword)}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const favoriteCount = notes.filter((note) => note.favorite).length;
  const visibleNotes =
    filter === "Favorites" ? notes.filter((note) => note.favorite) : notes;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Notes</Text>
            <Text style={styles.subtitle}>
              {notes.length} {notes.length === 1 ? "note" : "notes"} ·{" "}
              {favoriteCount} {favoriteCount === 1 ? "favorite" : "favorites"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
            <Pressable style={styles.addButton} onPress={openAddModal}>
              <Ionicons name="add" size={28} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        <View style={styles.filters}>
          <FilterButton
            title="All"
            active={filter === "All"}
            onPress={() => setFilter("All")}
          />
          <FilterButton
            title="Favorites"
            active={filter === "Favorites"}
            onPress={() => setFilter("Favorites")}
          />
        </View>

        <FlatList
          data={visibleNotes}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onToggleFavorite={toggleFavorite}
              onEdit={openEditModal}
              onDelete={deleteNote}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {filter === "Favorites"
                ? "No favorite notes yet. Tap the star on a note."
                : "No notes yet. Tap + to write your first note."}
            </Text>
          }
        />

        {modalVisible && (
          <NoteModal
            visible={modalVisible}
            note={editingNote}
            onClose={closeModal}
            onSave={saveNote}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f8",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#171717",
  },
  subtitle: {
    fontSize: 13,
    color: "#8a8a8a",
    marginTop: 3,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  logoutButtonText: {
    color: "#3478f6",
    fontSize: 15,
    fontWeight: "600",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3478f6",
    justifyContent: "center",
    alignItems: "center",
  },
  filters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#999999",
    fontSize: 14,
    marginTop: 48,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#171717",
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: "#8a8a8a",
    marginBottom: 24,
  },
  loginInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 13,
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: "#3478f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  createAccountButton: {
    borderWidth: 1,
    borderColor: "#3478f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "#3478f6",
    fontWeight: "bold",
    fontSize: 16,
  },
});
