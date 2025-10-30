import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import {
  Plus,
  CheckSquare,
  Users,
  Link2,
  Calendar,
  Tag,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  addedBy: string;
  addedAt: string;
}

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignees: string[];
  status: 'todo' | 'in-progress' | 'done';
  urgency?: 'urgent' | 'not-urgent';
  labels?: string[];
  dueDate?: string;
  checklists?: Checklist[];
  activities?: Activity[];
  links?: Link[];
  createdBy: string;
  updatedBy?: string;
  updatedAt?: string;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ProjectTask;
  onUpdate: (task: ProjectTask) => void;
  onDelete: () => void;
}

const AVAILABLE_LABELS = [
  { id: 'label-1', name: 'Musim', color: 'bg-red-500' },
  { id: 'label-2', name: 'Lama Hujan', color: 'bg-orange-500' },
  { id: 'label-3', name: 'Bendungan', color: 'bg-yellow-500' },
  { id: 'label-4', name: 'Survey', color: 'bg-green-500' },
  { id: 'label-5', name: 'Laporan', color: 'bg-blue-500' },
  { id: 'label-6', name: 'Meeting', color: 'bg-purple-500' },
];

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
}: TaskDetailModalProps) {
  const { currentUser, users } = useApp();
  const [localTask, setLocalTask] = useState<ProjectTask>(task);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState<{ [key: string]: string }>({});
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [comment, setComment] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(task.description);

  // Initialize activities if not exist
  if (!localTask.activities) {
    localTask.activities = [
      {
        id: 'a1',
        user: task.createdBy,
        action: 'created this card',
        timestamp: new Date().toISOString(),
      },
    ];
  }

  // Initialize checklists if not exist
  if (!localTask.checklists) {
    localTask.checklists = [];
  }

  // Initialize links if not exist
  if (!localTask.links) {
    localTask.links = [];
  }

  const activeUsers = users.filter((u) => u.role === 'user' && u.isActive);
  const availableUsers = activeUsers.filter((u) => !localTask.assignees.includes(u.id));

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const allChecklists = localTask.checklists || [];
    if (allChecklists.length === 0) return 0;
    
    const totalItems = allChecklists.reduce((sum, cl) => sum + cl.items.length, 0);
    if (totalItems === 0) return 0;
    
    const completedItems = allChecklists.reduce(
      (sum, cl) => sum + cl.items.filter(item => item.completed).length,
      0
    );
    
    return Math.round((completedItems / totalItems) * 100);
  }, [localTask.checklists]);

  const handleAddLabel = (labelId: string) => {
    const label = AVAILABLE_LABELS.find((l) => l.id === labelId);
    if (!label) return;

    const updatedTask = {
      ...localTask,
      labels: [...(localTask.labels || []), label.name],
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('added label', label.name);
    toast.success('Label ditambahkan');
    setShowAddLabel(false);
  };

  const handleRemoveLabel = (labelName: string) => {
    const updatedTask = {
      ...localTask,
      labels: localTask.labels?.filter((l) => l !== labelName),
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('removed label', labelName);
  };

  const handleAddChecklist = () => {
    if (!newChecklistTitle.trim()) {
      toast.error('Judul checklist harus diisi');
      return;
    }

    const newChecklist: Checklist = {
      id: `cl-${Date.now()}`,
      title: newChecklistTitle,
      items: [],
    };

    const updatedTask = {
      ...localTask,
      checklists: [...(localTask.checklists || []), newChecklist],
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('added checklist', newChecklistTitle);
    setNewChecklistTitle('');
    setShowAddChecklist(false);
    toast.success('Checklist ditambahkan');
  };

  const handleAddChecklistItem = (checklistId: string) => {
    const itemText = newChecklistItem[checklistId]?.trim();
    if (!itemText) return;

    const updatedChecklists = localTask.checklists?.map((cl) => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: [
            ...cl.items,
            {
              id: `cli-${Date.now()}`,
              text: itemText,
              completed: false,
            },
          ],
        };
      }
      return cl;
    });

    const updatedTask = {
      ...localTask,
      checklists: updatedChecklists,
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    setNewChecklistItem({ ...newChecklistItem, [checklistId]: '' });
  };

  const handleToggleChecklistItem = (checklistId: string, itemId: string) => {
    const updatedChecklists = localTask.checklists?.map((cl) => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return cl;
    });

    const updatedTask = {
      ...localTask,
      checklists: updatedChecklists,
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
  };

  const handleDeleteChecklist = (checklistId: string) => {
    const updatedTask = {
      ...localTask,
      checklists: localTask.checklists?.filter((cl) => cl.id !== checklistId),
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    toast.success('Checklist dihapus');
  };

  const handleSetDueDate = (date: string) => {
    const updatedTask = {
      ...localTask,
      dueDate: date,
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('set due date', new Date(date).toLocaleDateString('id-ID'));
    toast.success('Due date diatur');
  };

  const handleAddMember = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedTask = {
      ...localTask,
      assignees: [...localTask.assignees, userId],
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('added member', user.name);
    toast.success(`${user.name} ditambahkan`);
    setShowAddMember(false);
  };

  const handleRemoveMember = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    const updatedTask = {
      ...localTask,
      assignees: localTask.assignees.filter((id) => id !== userId),
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('removed member', user?.name);
  };

  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error('Judul dan URL harus diisi');
      return;
    }

    const link: Link = {
      id: `link-${Date.now()}`,
      title: newLink.title,
      url: newLink.url,
      addedBy: currentUser?.name || 'Unknown',
      addedAt: new Date().toISOString(),
    };

    const updatedTask = {
      ...localTask,
      links: [...(localTask.links || []), link],
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('added link', newLink.title);
    setNewLink({ title: '', url: '' });
    setShowAddLink(false);
    toast.success('Link ditambahkan');
  };

  const handleRemoveLink = (linkId: string) => {
    const updatedTask = {
      ...localTask,
      links: localTask.links?.filter((l) => l.id !== linkId),
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('removed link');
  };

  const addActivity = (action: string, details?: string) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      user: currentUser?.name || 'Unknown',
      action,
      timestamp: new Date().toISOString(),
      details,
    };

    const updatedTask = {
      ...localTask,
      activities: [newActivity, ...(localTask.activities || [])],
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    addActivity('commented', comment);
    setComment('');
    toast.success('Komentar ditambahkan');
  };

  const handleSaveTitle = () => {
    if (!editTitle.trim()) {
      toast.error('Judul tidak boleh kosong');
      return;
    }
    const updatedTask = {
      ...localTask,
      title: editTitle,
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('changed title', editTitle);
    setIsEditingTitle(false);
    toast.success('Judul diupdate');
  };

  const handleSaveDescription = () => {
    const updatedTask = {
      ...localTask,
      description: editDesc,
    };
    setLocalTask(updatedTask);
    onUpdate(updatedTask);
    addActivity('changed description');
    setIsEditingDesc(false);
    toast.success('Deskripsi diupdate');
  };

  const getChecklistProgress = (checklist: Checklist) => {
    if (checklist.items.length === 0) return 0;
    const completed = checklist.items.filter((item) => item.completed).length;
    return Math.round((completed / checklist.items.length) * 100);
  };

  const isOverdue = localTask.dueDate && new Date(localTask.dueDate) < new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1400px] w-[90vw] max-h-[92vh] overflow-hidden p-0 gap-0">
        {/* Accessibility: Hidden title and description for screen readers */}
        <DialogTitle className="sr-only">{localTask.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Task details for {localTask.title}. Status: {localTask.status}. {localTask.description}
        </DialogDescription>
        
        <div className="flex flex-col h-full max-h-[92vh]">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
            <div className="px-5 pt-4 pb-3">
              {/* Title Row */}
              <div className="flex items-start justify-between gap-4 mb-2">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 h-9"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveTitle} className="h-9">
                      Simpan
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditTitle(localTask.title);
                        setIsEditingTitle(false);
                      }}
                      className="h-9"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <h2
                    className="text-lg font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded -ml-2 flex-1"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {localTask.title}
                  </h2>
                )}
              </div>

              {/* Description Preview & Badges */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-xs text-gray-600 line-clamp-2 flex-1">
                  {localTask.description}
                </p>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {localTask.urgency && (
                    <Badge
                      className={
                        localTask.urgency === 'urgent'
                          ? 'bg-red-500 text-white text-xs px-2 h-5'
                          : 'bg-green-500 text-white text-xs px-2 h-5'
                      }
                    >
                      {localTask.urgency === 'urgent' ? 'Urgent' : 'Not Urgent'}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs px-2 h-5">
                    {localTask.status === 'todo' && 'To Do'}
                    {localTask.status === 'in-progress' && 'In Progress'}
                    {localTask.status === 'done' && 'Done'}
                  </Badge>
                  {isOverdue && (
                    <Badge className="bg-red-500 text-white text-xs px-2 h-5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>

              {/* Overall Progress Bar */}
              {localTask.checklists && localTask.checklists.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                      Overall Progress
                    </span>
                    <span className="font-medium">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-1.5" />
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-[2fr_1fr] gap-5 p-5">
              {/* Left Column - Main Content */}
              <div className="space-y-3">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddLabel(!showAddLabel)}
                    className="h-7 text-xs"
                  >
                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                    Labels
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddChecklist(!showAddChecklist)}
                    className="h-7 text-xs"
                  >
                    <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
                    Checklist
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="h-7 text-xs"
                  >
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Members
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAddLink(!showAddLink)}
                    className="h-7 text-xs"
                  >
                    <Link2 className="w-3.5 h-3.5 mr-1.5" />
                    Link
                  </Button>
                </div>

                {/* Add Label Section */}
                {showAddLabel && (
                  <div className="border rounded-lg p-2.5 bg-gray-50/80">
                    <h4 className="font-medium mb-1.5 text-xs">Pilih Label</h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {AVAILABLE_LABELS.map((label) => (
                        <button
                          key={label.id}
                          onClick={() => handleAddLabel(label.id)}
                          className={`${label.color} text-white px-2 py-1 rounded hover:opacity-80 transition-opacity text-xs`}
                          disabled={localTask.labels?.includes(label.name)}
                        >
                          {label.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Checklist Section */}
                {showAddChecklist && (
                  <div className="border rounded-lg p-2.5 bg-gray-50/80">
                    <h4 className="font-medium mb-1.5 text-xs">Tambah Checklist</h4>
                    <div className="flex gap-1.5">
                      <Input
                        value={newChecklistTitle}
                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                        placeholder="Judul checklist"
                        className="text-xs h-8"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddChecklist()}
                      />
                      <Button onClick={handleAddChecklist} size="sm" className="h-8">
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Add Member Section */}
                {showAddMember && (
                  <div className="border rounded-lg p-2.5 bg-gray-50/80">
                    <h4 className="font-medium mb-1.5 text-xs">Tambah Member</h4>
                    <Select onValueChange={handleAddMember}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Pilih member" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id} className="text-xs">
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Add Link Section */}
                {showAddLink && (
                  <div className="border rounded-lg p-2.5 bg-gray-50/80">
                    <h4 className="font-medium mb-1.5 text-xs">Tambah Link</h4>
                    <div className="space-y-1.5">
                      <Input
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        placeholder="Judul link"
                        className="text-xs h-8"
                      />
                      <Input
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        placeholder="URL (https://...)"
                        className="text-xs h-8"
                      />
                      <div className="flex gap-1.5">
                        <Button onClick={handleAddLink} size="sm" className="h-7 text-xs">
                          <Plus className="w-3 h-3 mr-1" />
                          Tambah
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setShowAddLink(false);
                            setNewLink({ title: '', url: '' });
                          }}
                          className="h-7 text-xs"
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Labels Display */}
                {localTask.labels && localTask.labels.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-1.5 text-xs text-gray-700">Labels</h3>
                    <div className="flex flex-wrap gap-1">
                      {localTask.labels.map((labelName, index) => {
                        const labelConfig = AVAILABLE_LABELS.find((l) => l.name === labelName);
                        return (
                          <div
                            key={index}
                            className={`${
                              labelConfig?.color || 'bg-gray-500'
                            } text-white px-2 py-0.5 rounded flex items-center gap-1 group`}
                          >
                            <span className="text-xs">{labelName}</span>
                            <button
                              onClick={() => handleRemoveLabel(labelName)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Members Display */}
                {localTask.assignees && localTask.assignees.length > 0 && (
                  <div>
                    <h3 className="font-medium flex items-center gap-1.5 mb-1.5 text-xs text-gray-700">
                      <Users className="w-3.5 h-3.5" />
                      Members ({localTask.assignees.length})
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {localTask.assignees.map((userId) => {
                        const user = users.find((u) => u.id === userId);
                        if (!user) return null;
                        return (
                          <div
                            key={userId}
                            className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-lg group hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-gradient-to-br from-[#1565C0] to-[#0d47a1] text-white" style={{ fontSize: '9px' }}>
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{user.name}</span>
                            <button
                              onClick={() => handleRemoveMember(userId)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div>
                  <h3 className="font-medium mb-1.5 flex items-center gap-1.5 text-xs text-gray-700">
                    <Calendar className="w-3.5 h-3.5" />
                    Due Date
                  </h3>
                  <div className="flex items-center gap-2">
                    <Input
                      type="datetime-local"
                      value={localTask.dueDate || ''}
                      onChange={(e) => handleSetDueDate(e.target.value)}
                      className="w-auto text-xs h-8"
                    />
                  </div>
                  {localTask.dueDate && (
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(localTask.dueDate).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>

                {/* Full Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-medium text-xs text-gray-700">Description</h3>
                    {!isEditingDesc && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingDesc(true)}
                        className="h-6 px-2"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  {isEditingDesc ? (
                    <div className="space-y-1.5">
                      <Textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={3}
                        className="w-full text-xs"
                      />
                      <div className="flex gap-1.5">
                        <Button size="sm" onClick={handleSaveDescription} className="h-7 text-xs">
                          Simpan
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditDesc(localTask.description);
                            setIsEditingDesc(false);
                          }}
                          className="h-7 text-xs"
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-2.5 rounded border text-xs text-gray-700 leading-relaxed">
                      {localTask.description.split('\\n').map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-1' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links */}
                {localTask.links && localTask.links.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-1.5 flex items-center gap-1.5 text-xs text-gray-700">
                      <Link2 className="w-3.5 h-3.5" />
                      Links & Resources ({localTask.links.length})
                    </h3>
                    <div className="space-y-1">
                      {localTask.links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-2 bg-gray-50 border rounded group hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[#1565C0] hover:underline"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium text-xs truncate">{link.title}</span>
                            </a>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {link.addedBy} • {new Date(link.addedAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                              })}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveLink(link.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklists */}
                {localTask.checklists && localTask.checklists.length > 0 && (
                  <div className="space-y-2">
                    {localTask.checklists.map((checklist) => (
                      <div key={checklist.id} className="border rounded-lg p-2.5 bg-white">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-gray-600" />
                            <h3 className="font-medium text-xs">{checklist.title}</h3>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteChecklist(checklist.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>

                        {/* Progress */}
                        <div className="mb-1.5">
                          <div className="flex items-center justify-between text-[10px] mb-0.5">
                            <span className="font-medium">{getChecklistProgress(checklist)}%</span>
                            <span className="text-gray-500">
                              {checklist.items.filter((i) => i.completed).length}/{checklist.items.length}
                            </span>
                          </div>
                          <Progress value={getChecklistProgress(checklist)} className="h-1.5" />
                        </div>

                        {/* Items */}
                        <div className="space-y-1">
                          {checklist.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-1.5">
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={() =>
                                  handleToggleChecklistItem(checklist.id, item.id)
                                }
                                className="h-3.5 w-3.5"
                              />
                              <span
                                className={`flex-1 text-xs ${
                                  item.completed ? 'line-through text-gray-400' : 'text-gray-700'
                                }`}
                              >
                                {item.text}
                              </span>
                            </div>
                          ))}

                          {/* Add Item */}
                          <div className="flex gap-1.5 mt-1.5 pt-1.5 border-t">
                            <Input
                              value={newChecklistItem[checklist.id] || ''}
                              onChange={(e) =>
                                setNewChecklistItem({
                                  ...newChecklistItem,
                                  [checklist.id]: e.target.value,
                                })
                              }
                              placeholder="Add item..."
                              className="text-xs h-7"
                              onKeyPress={(e) =>
                                e.key === 'Enter' && handleAddChecklistItem(checklist.id)
                              }
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddChecklistItem(checklist.id)}
                              className="h-7 px-2"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Delete Task Button */}
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    onClick={onDelete}
                    className="border-red-300 text-red-600 hover:bg-red-50 h-8 text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1.5" />
                    Hapus Task
                  </Button>
                </div>
              </div>

              {/* Right Column - Activity & Comments */}
              <div className="space-y-2.5">
                <h3 className="font-medium text-xs text-gray-700 sticky top-0 bg-white py-1">
                  Activity & Comments
                </h3>

                {/* Add Comment */}
                <div className="space-y-1.5">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    className="text-xs resize-none"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAddComment} 
                    disabled={!comment.trim()}
                    className="h-7 text-xs w-full"
                  >
                    Post Comment
                  </Button>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-2">
                  {localTask.activities?.map((activity) => (
                    <div key={activity.id} className="flex gap-2">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback className="bg-[#1565C0] text-white" style={{ fontSize: '8px' }}>
                          {activity.user
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-snug">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-gray-600">{activity.action}</span>
                          {activity.details && activity.action === 'commented' ? (
                            <div className="mt-1 p-1.5 bg-gray-50 rounded border text-gray-700 text-xs">
                              {activity.details}
                            </div>
                          ) : activity.details ? (
                            <span className="text-gray-600"> {activity.details}</span>
                          ) : null}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(activity.timestamp).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
