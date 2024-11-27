"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MiniConfirmationBox from "./mini_confirmation_box";

type Note = {
  _id: string;
  note: string;
};

const NoteTaker = () => {
  const [note, setNote] = useState("");
  const [addNoteLoading, setAddNoteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [fetchNotesLoading, setFetchNotesLoading] = useState(true);

  async function fetchNotes() {
    setFetchNotesLoading(true);
    try {
      const res = await fetch("/api/get_notes");
      const responseData = await res.json();

      setAllNotes(Array.isArray(responseData.data) ? responseData.data : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setAllNotes([]);
    } finally {
      setFetchNotesLoading(false);
    }
  }

  async function deleteNote(id: string) {
    setFetchNotesLoading(true);
    setTimeout(() => setFetchNotesLoading(false), 3000);
    try {
      const res = await fetch("/api/delete_note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetchNotesLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteNote(id);
    await fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddNoteLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/add_note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      });

      if (!res.ok) {
        throw new Error("Failed to add note");
      }

      const data = await res.json();
      setMessage("Note added successfully!");
      setNote("");
      fetchNotes();
    } catch (error) {
      setMessage("Error adding note");
      console.error(error);
    } finally {
      setAddNoteLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col p-8 bg-zinc-900 rounded-xl space-y-2">
        {fetchNotesLoading ? (
          <p>Loading...</p>
        ) : allNotes.length > 0 ? (
          allNotes.map((note: Note) => (
            <div
              key={note._id}
              className="flex w-full justify-between items-start gap-4"
            >
              <p>{note.note}</p>
              <MiniConfirmationBox
                iconUrl="./delete.svg"
                onClick={() => handleDelete(note._id)}
              />
            </div>
          ))
        ) : (
          <p>No notes available</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note"
          rows={2}
          required
          className="p-4 rounded-lg"
        />
        <Button type="submit" disabled={addNoteLoading}>
          {addNoteLoading ? "Adding Note..." : "Add Note"}
        </Button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default NoteTaker;
