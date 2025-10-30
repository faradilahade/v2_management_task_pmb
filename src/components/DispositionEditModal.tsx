import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X, Plus } from 'lucide-react';
import { DispositionTask } from '../types';

interface DispositionEditModalProps {
  disposition: DispositionTask;
  isOpen: boolean;
  onClose: () => void;
}

export function DispositionEditModal({
  disposition,
  isOpen,
  onClose,
}: DispositionEditModalProps) {
  const { currentUser, updateDispositionTask } = useApp();
  const [content, setContent] = useState('');
  const [fillers, setFillers] = useState(disposition.filledBy || []);

  const handleAddFiller = () => {
    if (!currentUser || !content.trim()) return;

    const newFiller = {
      userId: currentUser.id,
      userName: currentUser.name,
      filledAt: new Date().toISOString(),
      content: content.trim(),
    };

    const updatedFillers = [...fillers, newFiller];
    setFillers(updatedFillers);
    updateDispositionTask(disposition.id, { filledBy: updatedFillers });
    setContent('');
  };

  const handleRemoveFiller = (index: number) => {
    const updatedFillers = fillers.filter((_, i) => i !== index);
    setFillers(updatedFillers);
    updateDispositionTask(disposition.id, { filledBy: updatedFillers });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Disposisi</DialogTitle>
          <DialogDescription>{disposition.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Disposition Info */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">{disposition.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {disposition.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge>{disposition.period}</Badge>
              <Badge variant="outline">
                Dari: {disposition.giverNames.join(', ')}
              </Badge>
              <Badge variant="outline">
                Kepada: {disposition.receiverNames.join(', ')}
              </Badge>
            </div>
          </div>

          {/* Filled By List */}
          <div>
            <h4 className="font-medium mb-2">Riwayat Pengisian</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {fillers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada yang mengisi
                </p>
              ) : (
                fillers.map((filler, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{filler.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(filler.filledAt).toLocaleString('id-ID', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      {filler.content && (
                        <p className="text-sm text-muted-foreground">{filler.content}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFiller(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Filler */}
          <div>
            <h4 className="font-medium mb-2">Tambah Isian Baru</h4>
            <div className="flex gap-2">
              <Textarea
                placeholder="Masukkan isian disposisi..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1"
                rows={3}
              />
            </div>
            <Button onClick={handleAddFiller} className="mt-2" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Isian
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
