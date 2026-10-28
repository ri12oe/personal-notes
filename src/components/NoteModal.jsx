import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NoteModal({ visible, note, onClose, onSave }) {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const editing = note != null;

  function handleSave() {
    if (!title.trim()) {
      return;
    }
    onSave({ title: title.trim(), content: content.trim() });
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.background} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editing ? "Edit Note" : "New Note"}
            </Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={18} color="#555555" />
            </Pressable>
          </View>

          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={styles.input}
            placeholder="Note title..."
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>CONTENT</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Write your note..."
            placeholderTextColor="#aaa"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          <Pressable
            style={[styles.saveButton, !title.trim() && styles.saveDisabled]}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={styles.saveButtonText}>
              {editing ? "Save Changes" : "Add Note"}
            </Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modal: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 7,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#222222",
    marginBottom: 18,
  },

  contentInput: {
    height: 140,
    paddingTop: 12,
  },

  saveButton: {
    height: 48,
    backgroundColor: "#3478f6",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  saveDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },

  cancelButton: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  cancelButtonText: {
    color: "#777777",
    fontSize: 13,
  },
});
