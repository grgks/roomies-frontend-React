import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Users, Search, Home } from 'lucide-react';
import RoommateProfileForm from '@/components/search/RoommateProfileForm';
import RoommatePreferencesForm from '@/components/search/RoommatePreferencesForm';
import HousePreferencesForm from '@/components/search/HousePreferencesForm';
import usePageTitle from '@/hooks/usePageTitle';

const SearchProfileSetupPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [showRoommateProfile, setShowRoommateProfile] = useState(true); // first open by default
    const [showRoommatePrefs, setShowRoommatePrefs] = useState(false);
    const [showHousePrefs, setShowHousePrefs] = useState(false);
    const [roommateProfileDone, setRoommateProfileDone] = useState(false);
    const [roommatePrefsDone, setRoommatePrefsDone] = useState(false);
    const [housePrefsDone, setHousePrefsDone] = useState(false);

    usePageTitle(t('setupSearchProfile'));

    const allDone = roommateProfileDone && roommatePrefsDone && housePrefsDone;

    return (
        <div
            className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: "url('/room.jpg')" }}
        >
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-10 flex flex-col gap-4 min-w-[380px] max-h-[85vh] overflow-y-auto">
                <h1 className="text-violet-500 text-2xl font-bold text-center">{t('setupSearchProfile')}</h1>
                <p className="text-violet-950 text-sm text-center">{t('setupSearchProfileHint')}</p>

                {/* Roommate Profile */}
                <div className="flex flex-col gap-2 py-2 border-t border-white/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users size={16} className="text-violet-950" />
                            <p className="text-sm font-medium text-violet-950">{t('roommateProfile')}</p>
                            {roommateProfileDone && <span className="text-green-400 text-xs">✓</span>}
                        </div>
                        <button
                            onClick={() => setShowRoommateProfile(p => !p)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-violet-950 transition cursor-pointer flex items-center gap-1">
                            {showRoommateProfile ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                    </div>
                    {showRoommateProfile && (
                        <RoommateProfileForm onSuccess={() => {
                            setRoommateProfileDone(true);
                            setShowRoommateProfile(false);
                            setShowRoommatePrefs(true); // auto-open next
                        }} />
                    )}
                </div>

                {/* Roommate Preferences */}
                <div className="flex flex-col gap-2 py-2 border-t border-white/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Search size={16} className="text-violet-950" />
                            <p className="text-sm font-medium text-violet-950">{t('roommatePreferences')}</p>
                            {roommatePrefsDone && <span className="text-green-400 text-xs">✓</span>}
                        </div>
                        <button
                            onClick={() => setShowRoommatePrefs(p => !p)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-violet-950 transition cursor-pointer flex items-center gap-1">
                            {showRoommatePrefs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                    </div>
                    {showRoommatePrefs && (
                        <RoommatePreferencesForm onSuccess={() => {
                            setRoommatePrefsDone(true);
                            setShowRoommatePrefs(false);
                            setShowHousePrefs(true); // auto-open next
                        }} />
                    )}
                </div>

                {/* House Preferences */}
                <div className="flex flex-col gap-2 py-2 border-t border-white/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Home size={16} className="text-violet-950" />
                            <p className="text-sm font-medium text-violet-950">{t('housePreferences')}</p>
                            {housePrefsDone && <span className="text-green-400 text-xs">✓</span>}
                        </div>
                        <button
                            onClick={() => setShowHousePrefs(p => !p)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-violet-950 transition cursor-pointer flex items-center gap-1">
                            {showHousePrefs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                    </div>
                    {showHousePrefs && (
                        <HousePreferencesForm onSuccess={() => {
                            setHousePrefsDone(true);
                            setShowHousePrefs(false);
                        }} />
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 border border-white/30 text-violet-950 font-semibold py-3 rounded-lg transition hover:bg-white/10"
                    >
                        {t('skip')}
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`flex-1 font-semibold py-3 rounded-lg transition ${
                            allDone
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-indigo-600/50 text-white/70'
                        }`}
                    >
                        {t('continue')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchProfileSetupPage;