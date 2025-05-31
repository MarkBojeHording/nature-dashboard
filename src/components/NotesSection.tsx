
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { PlusCircle, Save, Bold, Italic, List, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    bullets?: boolean;
  };
}

const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formatting, setFormatting] = useState({ bold: false, italic: false, bullets: false });

  useEffect(() => {
    const savedNotes = localStorage.getItem('dashboard-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('dashboard-notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content for the note.",
        variant: "destructive"
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date(),
      formatting: { ...formatting }
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);
    setNewNote({ title: '', content: '' });
    setIsEditing(false);
    setFormatting({ bold: false, italic: false, bullets: false });
    
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully."
    });
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted."
    });
  };

  const formatContent = (content: string, noteFormatting?: Note['formatting']) => {
    let formatted = content;
    
    if (noteFormatting?.bullets) {
      formatted = content.split('\n').map(line => 
        line.trim() ? `• ${line}` : line
      ).join('\n');
    }
    
    return formatted;
  };

  const getContentStyle = (noteFormatting?: Note['formatting']) => {
    return {
      fontWeight: noteFormatting?.bold ? 'bold' : 'normal',
      fontStyle: noteFormatting?.italic ? 'italic' : 'normal'
    };
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Notes & Scratchpad</span>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing && (
          <div className="space-y-3 p-3 bg-black/20 rounded-lg">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-300"
            />
            
            <div className="flex space-x-2 mb-2">
              <Button
                variant={formatting.bold ? "default" : "ghost"}
                size="sm"
                onClick={() => setFormatting({ ...formatting, bold: !formatting.bold })}
                className="text-white"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={formatting.italic ? "default" : "ghost"}
                size="sm"
                onClick={() => setFormatting({ ...formatting, italic: !formatting.italic })}
                className="text-white"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={formatting.bullets ? "default" : "ghost"}
                size="sm"
                onClick={() => setFormatting({ ...formatting, bullets: !formatting.bullets })}
                className="text-white"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-300 min-h-[100px]"
              style={getContentStyle(formatting)}
            />
            
            <div className="flex space-x-2">
              <Button onClick={addNote} size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-1" />
                Save Note
              </Button>
              <Button 
                onClick={() => setIsEditing(false)} 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {notes.length === 0 ? (
            <div className="text-center text-gray-300 py-8">
              <div className="text-lg mb-2">No notes yet</div>
              <div className="text-sm">Click the + button to add your first note</div>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-black/20 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{note.title}</h4>
                  <Button
                    onClick={() => deleteNote(note.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-500/20 h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div 
                  className="text-sm text-gray-200 whitespace-pre-wrap"
                  style={getContentStyle(note.formatting)}
                >
                  {formatContent(note.content, note.formatting)}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {note.createdAt.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-xs text-gray-300 mt-4 p-2 bg-black/20 rounded">
          <strong>Tip:</strong> For Google Keep sync, you can manually copy-paste notes between this dashboard and Google Keep.
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
