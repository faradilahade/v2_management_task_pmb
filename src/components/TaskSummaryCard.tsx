import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Edit, CheckCircle2, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

const initialTotalTasks: TaskItem[] = [
  { id: 't1', text: 'Mapping Zona Rawan Banjir', completed: false },
  { id: 't2', text: 'Analisis Curah Hujan Mingguan', completed: false },
  { id: 't3', text: 'Request Siaran Pers', completed: false },
  { id: 't4', text: 'Update Dashboard Monitoring', completed: false },
  { id: 't5', text: 'Koordinasi dengan Balai Wilayah', completed: false },
  { id: 't6', text: 'Laporan Inspeksi Bendungan', completed: false },
];

const initialCompletedTasks: TaskItem[] = [];

const initialUrgentTasks: TaskItem[] = [
  { id: 'u1', text: 'Request Siaran Pers', completed: false },
  { id: 'u2', text: 'Update Dashboard Monitoring', completed: false },
];

export function TaskSummaryCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('Tugas Bersama Minggu Ini');
  const [description, setDescription] = useState('Evaluasi keamanan bendungan dan monitoring cuaca');
  
  // Separate lists for each category
  const [totalTasks, setTotalTasks] = useState<TaskItem[]>(initialTotalTasks);
  const [completedTasks, setCompletedTasks] = useState<TaskItem[]>(initialCompletedTasks);
  const [urgentTasks, setUrgentTasks] = useState<TaskItem[]>(initialUrgentTasks);
  
  // Input states for adding new tasks
  const [newTotalTask, setNewTotalTask] = useState('');
  const [newCompletedTask, setNewCompletedTask] = useState('');
  const [newUrgentTask, setNewUrgentTask] = useState('');

  const handleSave = () => {
    toast.success('Informasi tugas berhasil diperbarui');
    setIsEditing(false);
  };

  // Add task functions
  const addTotalTask = () => {
    if (newTotalTask.trim()) {
      setTotalTasks([...totalTasks, { id: `t${Date.now()}`, text: newTotalTask, completed: false }]);
      setNewTotalTask('');
    }
  };

  const addCompletedTask = () => {
    if (newCompletedTask.trim()) {
      setCompletedTasks([...completedTasks, { id: `c${Date.now()}`, text: newCompletedTask, completed: true }]);
      setNewCompletedTask('');
    }
  };

  const addUrgentTask = () => {
    if (newUrgentTask.trim()) {
      setUrgentTasks([...urgentTasks, { id: `u${Date.now()}`, text: newUrgentTask, completed: false }]);
      setNewUrgentTask('');
    }
  };

  // Delete task functions
  const deleteTotalTask = (id: string) => {
    setTotalTasks(totalTasks.filter(task => task.id !== id));
  };

  const deleteCompletedTask = (id: string) => {
    setCompletedTasks(completedTasks.filter(task => task.id !== id));
  };

  const deleteUrgentTask = (id: string) => {
    setUrgentTasks(urgentTasks.filter(task => task.id !== id));
  };

  // Toggle task completion
  const toggleTotalTask = (id: string) => {
    setTotalTasks(totalTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleCompletedTask = (id: string) => {
    setCompletedTasks(completedTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleUrgentTask = (id: string) => {
    setUrgentTasks(urgentTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Render task list
  const renderTaskList = (
    tasks: TaskItem[],
    onToggle: (id: string) => void,
    onDelete: (id: string) => void
  ) => (
    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 italic py-4 text-center">Belum ada tugas</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-0.5"
            />
            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
              {task.text}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      <Card className="relative h-full shadow-lg border-2 border-[#81C784]/30 dark:border-[#81C784]/40 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all overflow-hidden group">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #81C784 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Edit Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="w-4 h-4 text-[#81C784]" />
        </Button>

        <CardContent className="relative p-5 h-full flex flex-col">
          {/* Icon & Title */}
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-[#81C784] to-[#66BB6A] rounded-xl shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1565C0] dark:text-white mb-1">
                {title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {/* Stats Grid with Animation for Urgent */}
          <div className="grid grid-cols-3 gap-3 mt-auto">
            <div className="text-center p-2 bg-white/70 dark:bg-gray-900/30 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-[#81C784]">{totalTasks.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center p-2 bg-white/70 dark:bg-gray-900/30 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-[#1565C0] dark:text-[#FFB74D]">{completedTasks.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Selesai</div>
            </div>
            <motion.div
              animate={{ opacity: urgentTasks.length > 0 ? [1, 0.6, 1] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center p-2 bg-white/70 dark:bg-gray-900/30 rounded-lg backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-red-500">{urgentTasks.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Urgent</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog with Tabs */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Tugas Bersama</DialogTitle>
            <DialogDescription>
              Ubah informasi ringkasan tugas bersama minggu ini
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 mt-4">
            {/* Title and Description */}
            <div className="space-y-4 pb-4 border-b">
              <div>
                <label className="text-sm font-medium mb-2 block">Judul</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul tugas"
                  className="border-[#1565C0]/30 focus:border-[#1565C0]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Deskripsi</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi tugas"
                  rows={2}
                  className="border-[#1565C0]/30 focus:border-[#1565C0] resize-none"
                />
              </div>
            </div>

            {/* Task Lists with Tabs */}
            <Tabs defaultValue="total" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="total">Total ({totalTasks.length})</TabsTrigger>
                <TabsTrigger value="selesai">Selesai ({completedTasks.length})</TabsTrigger>
                <TabsTrigger value="urgent">Urgent ({urgentTasks.length})</TabsTrigger>
              </TabsList>

              {/* Total Tasks Tab */}
              <TabsContent value="total" className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    value={newTotalTask}
                    onChange={(e) => setNewTotalTask(e.target.value)}
                    placeholder="Tambah tugas baru..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addTotalTask()}
                  />
                  <Button onClick={addTotalTask} className="bg-[#81C784] hover:bg-[#66BB6A] text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {renderTaskList(totalTasks, toggleTotalTask, deleteTotalTask)}
              </TabsContent>

              {/* Completed Tasks Tab */}
              <TabsContent value="selesai" className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    value={newCompletedTask}
                    onChange={(e) => setNewCompletedTask(e.target.value)}
                    placeholder="Tambah tugas selesai..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addCompletedTask()}
                  />
                  <Button onClick={addCompletedTask} className="bg-[#1565C0] hover:bg-[#1976D2] text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {renderTaskList(completedTasks, toggleCompletedTask, deleteCompletedTask)}
              </TabsContent>

              {/* Urgent Tasks Tab */}
              <TabsContent value="urgent" className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    value={newUrgentTask}
                    onChange={(e) => setNewUrgentTask(e.target.value)}
                    placeholder="Tambah tugas urgent..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addUrgentTask()}
                  />
                  <Button onClick={addUrgentTask} className="bg-red-500 hover:bg-red-600 text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {renderTaskList(urgentTasks, toggleUrgentTask, deleteUrgentTask)}
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-[#81C784] hover:bg-[#66BB6A] text-white">
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
