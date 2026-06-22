import { useState } from "react";
import { Link } from "react-router";
import {LogOut, Menu, X, Bell, ShieldCheck} from "lucide-react";
import RoomiesLogo from "./RoomiesLogo";
import useAuth from "@/hooks/useAuth.ts";
import {AVATARS, NAV_LINKS} from "@/utils/constants.ts";
import SettingsModal from "@/components/SettingsModal.tsx";
import { useNotifications } from "@/context/NotificationContext.tsx";
import NotificationPanel from '@/components/NotificationPanel';
import {useTranslation} from "react-i18next";

const Header = () => {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout, userEmail, avatarId, isAdmin} = useAuth();
    const { unreadCount } = useNotifications();
    const [notifOpen, setNotifOpen] = useState(false);

    const BellButton = (
        <div className="relative">
            <button
                onClick={() => setNotifOpen(p => !p)}
                className="relative text-white/70 hover:text-white transition"
                title="Notifications">
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
                )}
            </button>
            <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
    );

    return (
        <header className="bg-purple-800/55 fixed w-full z-50">
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to={"/dashboard"}>
                    <RoomiesLogo/>
                </Link>

                {/* Mobile */}
                <div className="flex items-center gap-3 md:hidden">
                    {/*<span className="text-xs text-white/70">{userEmail}</span>*/}
                    <SettingsModal />
                    {BellButton}
                    <button onClick={logout} className="text-white/70 hover:text-white transition" title="Logout">
                        <LogOut size={18} />
                    </button>
                    <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={36} /> : <Menu size={36} />}
                    </button>
                </div>

                {/* Nav */}
                <nav className={`${menuOpen ? "block" : "hidden"} md:flex md:items-center gap-4 text-white absolute top-24 left-0 w-full md:w-auto
                     md:static p-4 md:p-0 z-50 bg-purple-900/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none`}>
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="block md:inline text-white font-bold hover:underline hover:underline-offset-4"
                            onClick={() => setMenuOpen(false)}
                        >
                            {t(label.toLowerCase())}
                        </Link>
                    ))}

                    {/* isAdmin */}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-1 text-yellow-300 font-bold hover:underline hover:underline-offset-4"
                            onClick={() => setMenuOpen(false)}
                        >
                            <ShieldCheck size={16} />
                            {t('admin')}
                        </Link>
                    )}

                    {/* Desktop */}
                    <div className="hidden md:block text-right ml-10">
                        <p className="text-sm font-medium text-white">
                            {new Date().toLocaleDateString('el-GR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                        <p className="text-xs text-white/70">
                            {new Date().toLocaleTimeString('el-GR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })}
                        </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-3 px-3 py-2 rounded-xl ml-10 shrink-0"
                         style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        {avatarId ? (
                            <img
                                src={AVATARS.find(a => a.id === avatarId)?.url}
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"/>
                        )}                        <span className="text-xs text-white/70">{userEmail}</span>
                        <SettingsModal />
                        {BellButton}
                        <button onClick={logout} className="text-white/70 hover:text-white transition" title="Logout">
                            <LogOut size={18}/>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;