import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { AlertTriangle, Clock, Edit, Plus, Trash2, Check, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface Issue {
  id: string;
  type: 'dam' | 'flood';
  damName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  assignedTo: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export function CurrentIssuesCardEditable() {
  const { currentUser } = useApp();
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      type: 'dam',
      damName: 'Bendungan Saguling',
      severity: 'medium',
      issue: 'Sensor piezometer menunjukkan anomali pada reading point B-7',
      assignedTo: 'Rina Kartika',
      lastUpdatedBy: 'Rina Kartika',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'flood',
      damName: 'Bendungan Cirata',
      severity: 'high',
      issue: 'TMA: 215.5m (Normal: 210.0m) - Tinggi muka air mendekati batas',
      assignedTo: 'Budi Santoso',
      lastUpdatedBy: 'Budi Santoso',
      lastUpdatedAt: new Date().toISOString(),
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Issue>>({});
  const [isAdding, setIsAdding] = useState(false);

  const criticalIssues = issues.filter(
    (issue) => issue.severity === 'high' || issue.severity === 'critical'
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const handleEdit = (issue: Issue) => {
    setEditingId(issue.id);
    setEditForm(issue);
  };

  const handleSave = () => {
    if (editingId) {
      setIssues(
        issues.map((issue) =>
          issue.id === editingId
            ? {
                ...issue,
                ...editForm,
                lastUpdatedBy: currentUser?.name || 'Unknown',
                lastUpdatedAt: new Date().toISOString(),
              }
            : issue
        )
      );
      setEditingId(null);
      setEditForm({});
      toast.success('Issue berhasil diupdate');
    }
  };

  const handleAdd = () => {
    if (!editForm.damName || !editForm.issue || !editForm.severity) {
      toast.error('Harap lengkapi semua field');
      return;
    }

    const newIssue: Issue = {
      id: Date.now().toString(),
      type: editForm.type || 'dam',
      damName: editForm.damName || '',
      severity: editForm.severity || 'medium',
      issue: editForm.issue || '',
      assignedTo: editForm.assignedTo || currentUser?.name || '',
      lastUpdatedBy: currentUser?.name || 'Unknown',
      lastUpdatedAt: new Date().toISOString(),
    };

    setIssues([...issues, newIssue]);
    setIsAdding(false);
    setEditForm({});
    toast.success('Issue berhasil ditambahkan');
  };

  const handleDelete = (id: string) => {
    setIssues(issues.filter((issue) => issue.id !== id));
    toast.success('Issue berhasil dihapus');
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-lg text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                Masalah Saat Ini
              </h3>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                {criticalIssues.length} masalah kritis
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="h-7 w-7 p-0"
          >
            <Plus className="w-4 h-4 text-orange-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 dark:scrollbar-thumb-orange-700">
        {/* Add New Issue Form */}
        {isAdding && (
          <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border-2 border-orange-400 space-y-2">
            <Select
              value={editForm.type}
              onValueChange={(value: any) => setEditForm({ ...editForm, type: value })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Tipe Issue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dam">Dam Safety</SelectItem>
                <SelectItem value="flood">Flood Alert</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={editForm.damName || ''}
              onChange={(e) => setEditForm({ ...editForm, damName: e.target.value })}
              placeholder="Nama Bendungan"
              className="text-xs"
            />

            <Select
              value={editForm.severity}
              onValueChange={(value: any) => setEditForm({ ...editForm, severity: value })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Tingkat Keparahan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={editForm.issue || ''}
              onChange={(e) => setEditForm({ ...editForm, issue: e.target.value })}
              placeholder="Deskripsi masalah..."
              className="text-xs"
              rows={2}
            />

            <Input
              value={editForm.assignedTo || ''}
              onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
              placeholder="PIC"
              className="text-xs"
            />

            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} className="flex-1 text-xs">
                <Check className="w-3 h-3 mr-1" />
                Tambah
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Batal
              </Button>
            </div>
          </div>
        )}

        {/* Issue List */}
        {issues.length === 0 ? (
          <p className="text-sm text-orange-700 dark:text-orange-300 text-center py-4">
            ✅ Tidak ada masalah kritis
          </p>
        ) : (
          issues.map((issue) => (
            <div key={issue.id}>
              {editingId === issue.id ? (
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border-2 border-orange-400 space-y-2">
                  <Input
                    value={editForm.damName || ''}
                    onChange={(e) => setEditForm({ ...editForm, damName: e.target.value })}
                    placeholder="Nama Bendungan"
                    className="text-xs"
                  />

                  <Select
                    value={editForm.severity}
                    onValueChange={(value: any) =>
                      setEditForm({ ...editForm, severity: value })
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    value={editForm.issue || ''}
                    onChange={(e) => setEditForm({ ...editForm, issue: e.target.value })}
                    className="text-xs"
                    rows={2}
                  />

                  <Input
                    value={editForm.assignedTo || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, assignedTo: e.target.value })
                    }
                    placeholder="PIC"
                    className="text-xs"
                  />

                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} className="flex-1 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Simpan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-700">
                  <div className="flex items-start gap-2 mb-1.5">
                    <Badge className={`${getSeverityColor(issue.severity)} text-xs`}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-medium text-orange-900 dark:text-orange-100 flex-1">
                      {issue.damName}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(issue)}
                        className="h-5 w-5 p-0"
                      >
                        <Edit className="w-3 h-3 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(issue.id)}
                        className="h-5 w-5 p-0"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-orange-800 dark:text-orange-200 line-clamp-2">
                    {issue.issue}
                  </p>
                  {issue.assignedTo && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-orange-600 dark:text-orange-400">
                      <Clock className="w-3 h-3" />
                      <span>PIC: {issue.assignedTo}</span>
                    </div>
                  )}
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 pt-1 border-t border-orange-200 dark:border-orange-700">
                    Update: {issue.lastUpdatedBy} •{' '}
                    {new Date(issue.lastUpdatedAt).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
