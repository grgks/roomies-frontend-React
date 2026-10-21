import { useTranslation } from 'react-i18next';
import type { RoommateProfile } from '@/types/searchSchemas';

interface Props {
    profile: RoommateProfile | undefined;
}

// icon helpers

const smokingIcon = (val: string | null, t: (k: string) => string) => {
    if (!val) return null;
    switch (val) {
        case 'NO':            return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs"
                                           title={`${t('smoking')}: ${t('no')}`}>🚭</span>;
        case 'YES':           return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs"
                                           title={`${t('smoking')}: ${t('yes')}`}>🚬</span>;
        case 'OUTDOORS_ONLY': return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs"
                                           title={`${t('smoking')}: ${t('outdoorsOnly')}`}>🚬🏡</span>;
        default: return null;
    }
};

const noiseLevelIcon = (val: string | null, t: (k: string) => string) => {
    if (!val) return null;
    switch (val) {
        case 'QUIET':    return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs"
                                      title={`${t('noiseLevel')}: ${t('quiet')}`}>🤫</span>;
        case 'MODERATE': return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs"
                                      title={`${t('noiseLevel')}: ${t('moderate')}`}>🔊</span>;
        case 'LOUD':     return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs"
                                      title={`${t('noiseLevel')}: ${t('loud')}`}>📢</span>;
        default: return null;
    }
};

const visitorsIcon = (val: string | null, t: (k: string) => string) => {
    if (!val) return null;
    switch (val) {
        case 'NEVER':     return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs"
                                       title={`${t('visitors')}: ${t('never')}`}>👤</span>;
        case 'SOMETIMES': return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs"
                                       title={`${t('visitors')}: ${t('sometimes')}`}>👥</span>;
        case 'OFTEN':     return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs"
                                       title={`${t('visitors')}: ${t('often')}`}>🎉</span>;
        default: return null;
    }
};

const RoommateCharacteristics = ({ profile }: Props) => {
    const { t } = useTranslation();

    if (!profile) return <span className="text-slate-300 text-xs">—</span>;

    return (
        <div className="flex flex-wrap gap-1">
            {smokingIcon(profile.smoking, t)}
            {profile.hasPets && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs"
                      title={t('hasPets')}>
                    🐾
                </span>
            )}
            {noiseLevelIcon(profile.noiseLevel, t)}
            {visitorsIcon(profile.visitors, t)}
            {profile.lgbtqFriendly && (
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs"
                      title={t('lgbtqFriendly')}>
                    🏳️‍🌈
                </span>
            )}
            {profile.age != null && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs"
                      title={t('age')}>
                    🎂 {profile.age}
                </span>
            )}
        </div>
    );
};

export default RoommateCharacteristics;