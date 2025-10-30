import { toast } from 'sonner@2.0.3';
import { Bell, LogOut, User, Settings, Languages, Maximize, Minimize } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ProfileModal } from './ProfileModal';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const { currentUser, notifications, logout } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        toast.error('Tidak dapat masuk mode fullscreen');
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    logout();
    toast.success(language === 'id' ? 'Berhasil keluar' : 'Logged out successfully');
  };

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
    toast.success(
      newLang === 'id' ? 'Bahasa diubah ke Indonesia' : 'Language changed to English'
    );
  };

  const t = (id: string, en: string) => (language === 'id' ? id : en);

  if (!currentUser) return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-[#2E4B7C] to-[#1e3555] text-white shadow-lg">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-[#FFC72C] rounded-lg shadow-md">
              <span className="font-bold text-[#2E4B7C] text-xl">PMB</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">
                {t('Sistem Manajemen PMB', 'PMB Management System')}
              </h1>
              <p className="text-xs text-white/80">
                {t('Pekerjaan Umum & Banjir', 'Public Works & Flood Management')}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/10"
              title={isFullscreen ? 'Keluar fullscreen' : 'Masuk fullscreen'}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:bg-white/10 gap-2"
            >
              <Languages className="w-4 h-4" />
              <span className="text-xs font-medium">
                {language === 'id' ? 'ID' : 'EN'}
              </span>
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-white hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FFC72C] text-[#2E4B7C] border-2 border-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 hover:bg-white/10 px-3"
                >
                  <Avatar className="h-8 w-8 border-2 border-[#FFC72C]">
                    <AvatarFallback className="bg-gradient-to-br from-[#FFC72C] to-[#FFB700] text-[#2E4B7C] font-semibold text-sm">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-white/70">{currentUser.position}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <User className="w-4 h-4 mr-2" />
                  {t('Profil Saya', 'My Profile')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  {t('Pengaturan', 'Settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('Keluar', 'Logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {showProfile && currentUser && (
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userId={currentUser.id}
        />
      )}
    </>
  );
}