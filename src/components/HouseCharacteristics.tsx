import { useTranslation } from 'react-i18next';
import type { HouseProfile } from '@/types/searchSchemas';

interface Props {
    profile: HouseProfile | undefined;
}

const HouseCharacteristics = ({ profile }: Props) => {
    const { t } = useTranslation();

    if (!profile) return <span className="text-slate-300 text-xs">—</span>;

    return (
        <div className="flex flex-wrap gap-1">
            {profile.rent != null && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium"
                      title={`${t('rent')}: ${profile.rent}€`}>
                    💶 {profile.rent}€
                </span>
            )}
            {profile.hasHeating && (
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs"
                      title={t('heating')}>
                    🔥
                </span>
            )}
            {profile.hasAirConditioning && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs"
                      title={t('airConditioning')}>
                    ❄️
                </span>
            )}
            {profile.furnished && (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs"
                      title={t('furnished')}>
                    🛋️
                </span>
            )}
        </div>
    );
};

export default HouseCharacteristics;