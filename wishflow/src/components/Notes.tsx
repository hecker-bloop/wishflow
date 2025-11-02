import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Tag, StickyNote } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "", tags: "" });

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleAdd = () => {
    if (!newNote.title.trim()) {
      toast.error("Please enter a note title");
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      description: newNote.description,
      tags: newNote.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", description: "", tags: "" });
    setIsAdding(false);
    toast.success("Note added!");
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast.success("Note deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notes</h2>
          <p className="text-muted-foreground">Your personal notes board</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gradient-primary hover:opacity-90 transition-smooth"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {isAdding && (
        <Card className="shadow-card animate-in fade-in slide-in-from-top-2 duration-300">
          <CardHeader>
            <CardTitle className="text-lg">New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Note title *"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="font-semibold transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your note here..."
                value={newNote.description}
                onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                rows={4}
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Tags (comma-separated)"
                value={newNote.tags}
                onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                className="transition-smooth"
              />
              <p className="text-xs text-muted-foreground">e.g., important, work, personal</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90">
                Save Note
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="shadow-card hover:shadow-card-hover transition-smooth group"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">{note.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-smooth hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {note.description}
              </p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && !isAdding && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <StickyNote className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No notes yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Note" to create one!</p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card bg-muted/30">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground font-medium">🚀 Coming Soon</p>
          <p className="text-xs text-muted-foreground mt-2">
            Reminders, image attachments, and advanced sorting
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notes;
