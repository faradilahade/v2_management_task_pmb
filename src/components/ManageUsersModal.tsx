import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Department, WorkStatus } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserPlus, Trash2, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extended department list dengan pilihan baru
const departments: Department[] = [
  'GIS',
  'Weather',
  'Hydrology',
  'Hydraulic',
  'Dam Safety',
  'Instrumentasi',
  'IT',
  'Data',
  'Public Relation',
  'OP Bendung',
  'Katim PMB',
  'Lainnya'
];

// Position suggestions based on department
const positionsByDepartment: Record<string, string[]> = {
  'GIS': ['PIC GIS', 'Staff GIS'],
  'Weather': ['PIC Weather', 'Staff Weather'],
  'Hydrology': ['PIC Hydrology', 'Staff Hydrology'],
  'Hydraulic': ['PIC Hydraulic', 'Staff Hydraulic'],
  'Dam Safety': ['PIC Dam Safety', 'Staff Dam Safety'],
  'Instrumentasi': ['PIC Instrumentasi', 'Staff Instrumentasi'],
  'IT': ['PIC IT', 'Staff IT'],
  'Data': ['PIC Data', 'Staff Data'],
  'Public Relation': ['PIC PR', 'Staff PR'],
  'OP Bendung': ['Operator Bendung', 'Staff OP Bendung'],
  'Katim PMB': ['Ketua Tim PMB', 'Wakil Ketua Tim PMB'],
  'Lainnya': ['Staff', 'PIC']
};

export function ManageUsersModal({ isOpen, onClose }: ManageUsersModalProps) {
  const { users, addUser, updateUser, removeUser } = useApp();
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    password: '',
    department: 'GIS' as Department,
    position: '',
  });
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const activeUsers = users.filter(u => u.role === 'user');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.username || !newUser.password || !newUser.position) {
      toast.error('Harap lengkapi semua field');
      return;
    }

    // Check if username already exists
    const usernameExists = users.some(u => u.username === newUser.username);
    if (usernameExists) {
      toast.error('Username sudah digunakan');
      return;
    }

    addUser({
      ...newUser,
      role: 'user',
      workStatus: 'relaxed',
      isActive: true,
    });

    toast.success(`User ${newUser.name} berhasil ditambahkan`);
    setNewUser({
      name: '',
      username: '',
      password: '',
      department: 'GIS',
      position: '',
    });
  };

  const toggleUserStatus = (userId: string, currentStatus: boolean) => {
    updateUser(userId, { isActive: !currentStatus });
    toast.success(currentStatus ? 'User dinonaktifkan' : 'User diaktifkan');
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteUserId(userId);
  };

  const confirmDeleteUser = () => {
    if (deleteUserId && removeUser) {
      const user = users.find(u => u.id === deleteUserId);
      removeUser(deleteUserId);
      toast.success(`User ${user?.name} berhasil dihapus`);
      setDeleteUserId(null);
    }
  };

  const getSuggestedPositions = (dept: string) => {
    return positionsByDepartment[dept] || ['Staff', 'PIC'];
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1E3A8A]">Manajemen User</DialogTitle>
            <DialogDescription>
              Kelola akun user dan hak akses
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="list" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Daftar User
              </TabsTrigger>
              <TabsTrigger value="add" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Tambah User
              </TabsTrigger>
            </TabsList>

            {/* Daftar User Tab */}
            <TabsContent value="list" className="space-y-4">
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Username</TableHead>
                      <TableHead className="font-semibold">Bidang</TableHead>
                      <TableHead className="font-semibold">Jabatan</TableHead>
                      <TableHead className="font-semibold text-center">Status</TableHead>
                      <TableHead className="font-semibold text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-500 text-blue-700">
                            {user.department}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{user.position}</TableCell>
                        <TableCell className="text-center">
                          {user.isActive ? (
                            <Badge className="bg-blue-600 hover:bg-blue-700">Aktif</Badge>
                          ) : (
                            <Badge variant="outline" className="border-gray-400 text-gray-600">
                              Nonaktif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant={user.isActive ? "outline" : "default"}
                              onClick={() => toggleUserStatus(user.id, user.isActive)}
                              className={user.isActive 
                                ? "border-amber-500 text-amber-700 hover:bg-amber-50" 
                                : "bg-blue-600 hover:bg-blue-700"
                              }
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="w-4 h-4 mr-1" />
                                  Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Aktifkan
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {activeUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserX className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Belum ada user yang terdaftar</p>
                </div>
              )}
            </TabsContent>

            {/* Tambah User Tab */}
            <TabsContent value="add" className="space-y-4">
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Lengkap */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Contoh: Ahmad Fauzi"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="border-gray-300 focus:border-[#1565C0]"
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Contoh: ahmad"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="border-gray-300 focus:border-[#1565C0]"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="border-gray-300 focus:border-[#1565C0]"
                      minLength={6}
                      required
                    />
                  </div>

                  {/* Bidang */}
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">
                      Bidang <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newUser.department}
                      onValueChange={(value) => setNewUser({ 
                        ...newUser, 
                        department: value as Department,
                        position: '' // Reset position when department changes
                      })}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#1565C0]">
                        <SelectValue placeholder="Pilih bidang" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Jabatan */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="position" className="text-sm font-medium">
                      Jabatan <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={newUser.position}
                        onValueChange={(value) => setNewUser({ ...newUser, position: value })}
                      >
                        <SelectTrigger className="flex-1 border-gray-300 focus:border-[#1565C0]">
                          <SelectValue placeholder="Pilih jabatan atau ketik manual" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSuggestedPositions(newUser.department).map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="text"
                        placeholder="Atau ketik manual: Contoh: PIC GIS, Staff Hydrology, dll"
                        value={newUser.position}
                        onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                        className="flex-1 border-gray-300 focus:border-[#1565C0]"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Pilih dari dropdown atau ketik manual sesuai kebutuhan
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-[#1E3A8A] to-[#1565C0] hover:from-[#1565C0] hover:to-[#1E3A8A]"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tambah User
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewUser({
                      name: '',
                      username: '',
                      password: '',
                      department: 'GIS',
                      position: '',
                    })}
                    className="border-gray-300"
                  >
                    Reset Form
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. User akan dihapus secara permanen dari sistem.
              {deleteUserId && (
                <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                  <p className="text-sm font-medium text-red-900">
                    User: {users.find(u => u.id === deleteUserId)?.name}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
