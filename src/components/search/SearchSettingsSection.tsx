import { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Search, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RoommateProfileForm from '@/components/search/RoommateProfileForm';
import RoommatePreferencesForm from '@/components/search/RoommatePreferencesForm';
import HousePreferencesForm from '@/components/search/HousePreferencesForm';

const SearchSettingsSection = () => {
    const { t } = useTranslation();
    const [showRoommateProfile, setShowRoommateProfile] = useState(false);
    const [showRoommatePrefs, setShowRoommatePrefs] = useState(false);
    const [showHousePrefs, setShowHousePrefs] = useState(false);
    const [roommateProfileSuccess, setRoommateProfileSuccess] = useState(false);
    const [roommatePrefsSuccess, setRoommatePrefsSuccess] = useState(false);
    const [housePrefsSuccess, setHousePrefsSuccess] = useState(false);

    return (
        <>
            {/* Roommate Profile (Search) */}
            <div className="flex flex-col gap-2 py-2 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users size={16} className="text-slate-500" />
                        <p className="text-sm font-medium text-slate-700">{t('roommateProfile')}</p>
                    </div>
                    <button
                        onClick={() => { setShowRoommateProfile(p => !p); setRoommateProfileSuccess(false); }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1">
                        {showRoommateProfile ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {showRoommateProfile ? t('cancel') : t('change')}
                    </button>
                </div>
                {roommateProfileSuccess && (
                    <p className="text-xs text-green-600 pl-7">{t('savedSuccessfully')}</p>
                )}
                {showRoommateProfile && (
                    <RoommateProfileForm onSuccess={() => { setRoommateProfileSuccess(true); setShowRoommateProfile(false); }} />
                )}
            </div>

            {/* Roommate Preferences (Search) */}
            <div className="flex flex-col gap-2 py-2 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Search size={16} className="text-slate-500" />
                        <p className="text-sm font-medium text-slate-700">{t('roommatePreferences')}</p>
                    </div>
                    <button
                        onClick={() => { setShowRoommatePrefs(p => !p); setRoommatePrefsSuccess(false); }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1">
                        {showRoommatePrefs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {showRoommatePrefs ? t('cancel') : t('change')}
                    </button>
                </div>
                {roommatePrefsSuccess && (
                    <p className="text-xs text-green-600 pl-7">{t('savedSuccessfully')}</p>
                )}
                {showRoommatePrefs && (
                    <RoommatePreferencesForm onSuccess={() => { setRoommatePrefsSuccess(true); setShowRoommatePrefs(false); }} />
                )}
            </div>

            {/* House Preferences (Search) */}
            <div className="flex flex-col gap-2 py-2 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Home size={16} className="text-slate-500" />
                        <p className="text-sm font-medium text-slate-700">{t('housePreferences')}</p>
                    </div>
                    <button
                        onClick={() => { setShowHousePrefs(p => !p); setHousePrefsSuccess(false); }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1">
                        {showHousePrefs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {showHousePrefs ? t('cancel') : t('change')}
                    </button>
                </div>
                {housePrefsSuccess && (
                    <p className="text-xs text-green-600 pl-7">{t('savedSuccessfully')}</p>
                )}
                {showHousePrefs && (
                    <HousePreferencesForm onSuccess={() => { setHousePrefsSuccess(true); setShowHousePrefs(false); }} />
                )}
            </div>
        </>
    );
};

export default SearchSettingsSection;