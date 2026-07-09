import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Settings,
    Key,
    Globe,
    LogOut,
    ChevronDown,
    ChevronUp,
    EyeOff,
    Eye,
    Pencil,
    User as UserIcon,
    CircleHelp
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuth from '@/hooks/useAuth';
import { getCurrentRoommate, updateRoommateMe } from '@/api/roommateApi';
import {getMe} from '@/api/userApi';
import { changeUserPassword, updateUserAvatar } from '@/services/userService';
import { useTranslation } from 'react-i18next';
import { AVATARS } from '@/utils/constants';
import { Gender } from '@/types/enums';
import { RoommateUpdateSchema } from '@/types';
import type { Roommate, RoommateUpdate } from '@/types';
import {Link} from "react-router";
// import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.tsx";


type ChangePasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };

const SettingsModal = () => {
    const [open, setOpen] = useState(false);
    const [roommate, setRoommate] = useState<Roommate | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [currentAvatarId, setCurrentAvatarId] = useState<string>('avatar_1');
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);



    const { logout, userEmail } = useAuth();

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { t, i18n } = useTranslation();

    const ChangePasswordSchema = z.object({
        currentPassword: z.string().min(1, t('required')),
        newPassword: z.string().min(8, t('passwordMinChars8')),
        confirmPassword: z.string().min(1, t('required')),
    }).refine(d => d.newPassword === d.confirmPassword, {
        message: t('passwordsDoNotMatch'),
        path: ['confirmPassword'],
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordForm>({ resolver: zodResolver(ChangePasswordSchema) });

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        reset: resetProfile,
        formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    } = useForm<RoommateUpdate>({
        resolver: zodResolver(RoommateUpdateSchema(t)) as never,
    });

    useEffect(() => {
        if (roommate) {
            resetProfile({
                firstname: roommate.firstname,
                lastname: roommate.lastname,
                gender: roommate.gender,
                activeAtSearch: roommate.activeAtSearch ?? true,
            });
        }
    }, [roommate, resetProfile]);

    useEffect(() => {
        if (open) {
            Promise.all([
                getCurrentRoommate(),
                getMe()
            ]).then(([roommateData, userData]) => {
                setRoommate(roommateData);
                setCurrentAvatarId(userData.avatarId);
            }).catch(() => {});
        } else {
            setShowPasswordForm(false);
            setPasswordSuccess(false);
            setPasswordError(null);
            setShowAvatarPicker(false);
            setShowProfileForm(false);
            setProfileSuccess(false);
            setProfileError(null);
            reset();
        }
    }, [open, reset]);

    const currentAvatar = AVATARS.find(a => a.id === currentAvatarId);

    const initials = roommate
        ? `${roommate.firstname[0]}${roommate.lastname[0]}`.toUpperCase()
        : userEmail?.[0]?.toUpperCase() ?? '?';

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'el' ? 'en' : 'el');
    };

    const handleAvatarSelect = async (avatarId: string) => {
        setAvatarLoading(true);
        try {
            await updateUserAvatar(avatarId);
            setCurrentAvatarId(avatarId);
            setShowAvatarPicker(false);
        } catch {
            // silent fail. avatar stays the same
        } finally {
            setAvatarLoading(false);
        }
    };

    const onChangePassword = async (data: ChangePasswordForm) => {
        setPasswordError(null);
        try {
            await changeUserPassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
            setPasswordSuccess(true);
            reset();
            setShowPasswordForm(false);
        } catch {
            setPasswordError(t('currentPasswordIsIncorrect'));
        }
    };

    const onUpdateProfile = async (data: RoommateUpdate) => {
        setProfileError(null);
        try {
            const updated = await updateRoommateMe(data);
            setRoommate(updated);
            setProfileSuccess(true);
            setShowProfileForm(false);
        } catch {
            setProfileError(t('couldNotUpdateProfile'));
        }
    };

    // const handleDeactivateAccount = async () => {
    //     try {
    //         await deleteMe();
    //         setTimeout(() => logout(), 500);
    //     } catch (err) {
    //         console.error('Deactivate failed:', err);
    //     }
    // };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('userSettings')}</DialogDescription>
            <DialogTrigger asChild>
                <button className="text-white/70 hover:text-white transition" title="Settings" aria-label="Settings">
                    <Settings size={18} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('settings')}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-2">

                    {/* Profile */}
                    <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="relative group">
                            {currentAvatar ? (
                                <img
                                    src={currentAvatar.url}
                                    alt="avatar"
                                    className="w-11 h-11 rounded-full object-cover cursor-pointer"
                                    onClick={() => setShowAvatarPicker(p => !p)}
                                />
                            ) : (
                                <div
                                    className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-base cursor-pointer"
                                    onClick={() => setShowAvatarPicker(p => !p)}>
                                    {initials}
                                </div>
                            )}
                            <div
                                onClick={() => setShowAvatarPicker(p => !p)}
                                className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                <Pencil size={13} className="text-white" />
                            </div>
                        </div>
                        <div>
                            {roommate ? (
                                <p className="font-semibold text-sm text-slate-800">
                                    {roommate.firstname} {roommate.lastname}
                                </p>
                            ) : (
                                <p className="text-slate-400 text-sm">Loading...</p>
                            )}
                            <p className="text-xs text-slate-500">{userEmail}</p>
                        </div>
                    </div>

                    {/* Avatar Picker */}
                    {showAvatarPicker && (
                        <div className="flex flex-wrap gap-2 pb-3 border-b">
                            {AVATARS.map(avatar => (
                                <button
                                    key={avatar.id}
                                    disabled={avatarLoading}
                                    onClick={() => handleAvatarSelect(avatar.id)}
                                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition cursor-pointer
                                        ${currentAvatarId === avatar.id
                                        ? 'border-purple-500 scale-110'
                                        : 'border-transparent hover:border-purple-300'
                                    } disabled:opacity-50`}>
                                    <img src={avatar.url} alt={avatar.id} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Update Profile */}
                    <div className="flex flex-col gap-2 py-2 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserIcon size={16} className="text-slate-500" />
                                <p className="text-sm font-medium text-slate-700">{t('updateProfile')}</p>
                            </div>
                            <button
                                onClick={() => { setShowProfileForm(p => !p); setProfileError(null); }}
                                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1">
                                {showProfileForm ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                {showProfileForm ? t('cancel') : t('change')}
                            </button>
                        </div>

                        {profileSuccess && (
                            <p className="text-xs text-green-600 pl-7">{t('profileUpdatedSuccessfully')}</p>
                        )}

                        {showProfileForm && (
                            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="flex flex-col gap-2 pl-7 mt-1">
                                <div>
                                    <input
                                        placeholder={t('firstname')}
                                        {...registerProfile('firstname')}
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    {profileErrors.firstname && (
                                        <p className="text-xs text-red-500 mt-0.5">{profileErrors.firstname.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        placeholder={t('lastname')}
                                        {...registerProfile('lastname')}
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    {profileErrors.lastname && (
                                        <p className="text-xs text-red-500 mt-0.5">{profileErrors.lastname.message}</p>
                                    )}
                                </div>
                                <div>
                                    <select
                                        {...registerProfile('gender')}
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                                    >
                                        {Object.values(Gender).map(g => (
                                            <option key={g} value={g}>{t(g)}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Active at search toggle */}
                                <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-700">{t('visibleInSearch')}</span>
                                        <span className="text-xs text-slate-400">{t('visibleInSearchHint')}</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        {...registerProfile('activeAtSearch')}
                                        className="w-4 h-4 accent-purple-600 cursor-pointer"
                                    />
                                </label>

                                {profileError && (
                                    <p className="text-xs text-red-500">{profileError}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={profileSubmitting}
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50 cursor-pointer">
                                    {profileSubmitting ? t('saving') : t('saveChanges')}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Change Password */}
                    <div className="flex flex-col gap-2 py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Key size={16} className="text-slate-500" />
                                <p className="text-sm font-medium text-slate-700">{t('changePassword')}</p>
                            </div>
                            <button
                                onClick={() => { setShowPasswordForm(p => !p); setPasswordError(null); }}
                                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1">
                                {showPasswordForm ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                {showPasswordForm ? t('cancel') : t('change')}
                            </button>
                        </div>

                        {passwordSuccess && (
                            <p className="text-xs text-green-600 pl-7">{t('passwordChangedSuccessfully')}</p>
                        )}

                        {showPasswordForm && (
                            <form onSubmit={handleSubmit(onChangePassword)} className="flex flex-col gap-2 pl-7 mt-1">
                                <div className="relative">
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        placeholder={t('currentPassword')}
                                        {...register('currentPassword')}
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    {errors.currentPassword && (
                                        <p className="text-xs text-red-500 mt-0.5">{errors.currentPassword.message}</p>
                                    )}
                                    <button type="button" onClick={() => setShowCurrent(p => !p)} aria-label={showCurrent ? "Hide password" : "Show password"}
                                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                                        {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        placeholder={t('newPassword')}
                                        {...register('newPassword')}
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    {errors.newPassword && (
                                        <p className="text-xs text-red-500 mt-0.5">{errors.newPassword.message}</p>
                                    )}
                                    <button type="button" onClick={() => setShowNew(p => !p)} aria-label={showNew ? "Hide password" : "Show password"}
                                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder={t('confirmNewPassword')}
                                        {...register('confirmPassword')}
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-xs text-red-500 mt-0.5">{errors.confirmPassword.message}</p>
                                    )}
                                    <button type="button" onClick={() => setShowConfirm(p => !p)} aria-label={showConfirm ? "Hide password" : "Show password"}
                                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="text-xs text-red-500">{passwordError}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50 cursor-pointer">
                                    {isSubmitting ? t('saving') : t('savePassword')}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <Globe size={16} className="text-slate-500" />
                            <div>
                                <p className="text-sm font-medium text-slate-700">{t('language')}</p>
                                <p className="text-xs text-slate-400">
                                    {i18n.language === 'el' ? 'Ελληνικά' : 'English'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleLanguage}
                            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer">
                            {i18n.language === 'el' ? 'EN' : 'EL'}
                        </button>
                    </div>

                    {/* Help */}
                    <div className="flex items-center justify-between py-2 border-t">
                        <div className="flex items-center gap-3">
                            <CircleHelp size={16} className="text-blue-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-700">{t("help")}</p>
                                <p className="text-xs text-slate-400">{t("helpDescription")}</p>
                            </div>
                        </div>

                        <Link
                            to="/instructions"
                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition cursor-pointer"
                        >
                            {t("open")}
                        </Link>
                    </div>

                    {/* Deactivate Account */}
                    <div className="flex items-center justify-between py-2 border-t">
                        <div className="flex items-center gap-3">
                            <UserIcon size={16} className="text-orange-400" />
                            <p className="text-sm font-medium text-slate-700">{t('deactivateAccount')}</p>
                        </div>
                        {/*<ConfirmDeleteModal*/}
                        {/*    onConfirm={handleDeactivateAccount}*/}
                        {/*    title={t('deactivateAccount')}*/}
                        {/*    message={t('deactivateAccountWarning') || 'Are you sure? This will deactivate your account.'}*/}
                        {/*    triggerIcon={<span className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-500 transition cursor-pointer">{t('deactivate')}</span>}*/}
                        {/*/>*/}
                    </div>

                    {/* Logout */}
                    <div className="flex items-center justify-between py-2 pt-3 border-t">
                        <div className="flex items-center gap-3">
                            <LogOut size={16} className="text-red-400" />
                            <p className="text-sm font-medium text-slate-700">{t('logout')}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition cursor-pointer">
                            {t('logout')}
                        </button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;