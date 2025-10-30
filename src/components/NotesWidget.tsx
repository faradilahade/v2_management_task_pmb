import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { StickyNote, Plus, Trash2, Edit2, Check, X, Pin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../contexts/AppContext';

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isPinned: boolean;
  color: string;
}

export function NotesWidget() {
  const { currentUser } = useApp();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Review laporan bendungan Cirata - deadline besok!',
      createdBy: 'Admin PMB',
      createdAt: new Date().toISOString(),
      isPinned: true,
      color: 'yellow',
    },
    {
      id: '2',
      content: 'Follow up dengan tim survey untuk data terbaru',
      createdBy: 'Andi Pratama',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isPinned: false,
      color: 'blue',
    },
  ]);

  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const colors = ['yellow', 'blue', 'green', 'pink', 'purple'];
  const [selectedColor, setSelectedColor] = useState('yellow');

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error('Catatan tidak boleh kosong');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdBy: currentUser?.name || 'User',
      createdAt: new Date().toISOString(),
      isPinned: false,
      color: selectedColor,
    };

    setNotes([note, ...notes]);
    setNewNote('');
    toast.success('Catatan ditambahkan');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast.success('Catatan dihapus');
  };

  const handleEditNote = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, content: editContent } : n
      )
    );
    setEditingId(null);
    toast.success('Catatan diperbarui');
  };

  const handleTogglePin = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, isPinned: !n.isPinned } : n
      )
    );
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      yellow: 'bg-yellow-100 border-yellow-300',
      blue: 'bg-blue-100 border-blue-300',
      green: 'bg-green-100 border-green-300',
      pink: 'bg-pink-100 border-pink-300',
      purple: 'bg-purple-100 border-purple-300',
    };
    return colorMap[color] || colorMap.yellow;
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Card className="shadow-lg border-2 bg-white">
      <CardHeader className="pb-3 px-5 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-[#2E4B7C]" />
            <h3 className="font-bold text-[#2E4B7C]">Notes</h3>
          </div>
          <Badge className="bg-[#FFC72C] text-[#2E4B7C]">
            {notes.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 space-y-4">
        {/* Add New Note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Tulis catatan baru..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="resize-none text-sm"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${getColorClass(color)} ${
                    selectedColor === color ? 'ring-2 ring-[#2E4B7C]' : ''
                  }`}
                />
              ))}
            </div>
            <Button
              size="sm"
              onClick={handleAddNote}
              className="bg-[#2E4B7C] hover:bg-[#1e3555]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-100" />

        {/* Notes List */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-3">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-lg border-2 ${getColorClass(note.color)} relative group`}
              >
                {note.isPinned && (
                  <Pin className="absolute top-2 right-2 w-4 h-4 text-gray-600" />
                )}

                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="text-sm"
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(note.id)}
                        className="h-7 flex-1"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Simpan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="h-7 flex-1"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm mb-2 pr-6">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {note.createdBy}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTogglePin(note.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Pin
                            className={`w-3 h-3 ${
                              note.isPinned ? 'text-gray-800' : 'text-gray-400'
                            }`}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditNote(note)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {notes.length === 0 && (
              <div className="text-center py-12 text-gray-300">
                <StickyNote className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-sm text-gray-400">Belum ada catatan</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
