import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface RoommateFilterValues {
    firstname: string;
    lastname: string;
    smoking: string;
    hasPets: string;       // '' | 'true' | 'false'
    noiseLevel: string;
    visitors: string;
    lgbtqFriendly: boolean;
    minAge: string;
    maxAge: string;
}

interface Props {
    values: RoommateFilterValues;
    onChange: (values: RoommateFilterValues) => void;
    onSearch: () => void;
    onClear: () => void;
    loading: boolean;
    filtersApplied: boolean;
}

const RoommateFilterPanel = ({ values, onChange, onSearch, onClear,
                                 loading, filtersApplied }: Props) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const set = (patch: Partial<RoommateFilterValues>) =>
        onChange({ ...values, ...patch });

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <button
                className="w-full px-6 py-4 flex items-center justify-between text-left
                           font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(prev => !prev)}
            >
                <span>
                    🔍 {t('searchFilters')}
                    {filtersApplied && (
                        <span className="ml-2 text-xs text-indigo-600 font-normal">
                            ({t('active')})
                        </span>
                    )}
                </span>
                <span className="text-slate-400 text-sm transition-transform duration-200"
                      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                </span>
            </button>

            {open && (
                <div className="px-6 pb-5 border-t border-slate-100 pt-4 flex flex-col gap-4">
                    {/* Name row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            className="border rounded-lg px-3 py-2 text-sm flex-1"
                            placeholder={t('firstname')}
                            value={values.firstname}
                            onChange={e => set({ firstname: e.target.value })}
                        />
                        <input
                            className="border rounded-lg px-3 py-2 text-sm flex-1"
                            placeholder={t('lastname')}
                            value={values.lastname}
                            onChange={e => set({ lastname: e.target.value })}
                        />
                    </div>

                    {/* Selects: smoking, noise, visitors */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">
                                🚬 {t('smoking')}
                            </label>
                            <select className="border rounded-lg px-3 py-2 text-sm w-full"
                                    value={values.smoking}
                                    onChange={e => set({ smoking: e.target.value })}>
                                <option value="">{t('all')}</option>
                                <option value="NO">{t('no')}</option>
                                <option value="YES">{t('yes')}</option>
                                <option value="OUTDOORS_ONLY">{t('outdoorsOnly')}</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">
                                🔊 {t('noiseLevel')}
                            </label>
                            <select className="border rounded-lg px-3 py-2 text-sm w-full"
                                    value={values.noiseLevel}
                                    onChange={e => set({ noiseLevel: e.target.value })}>
                                <option value="">{t('all')}</option>
                                <option value="QUIET">{t('quiet')}</option>
                                <option value="MODERATE">{t('moderate')}</option>
                                <option value="LOUD">{t('loud')}</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">
                                👥 {t('visitors')}
                            </label>
                            <select className="border rounded-lg px-3 py-2 text-sm w-full"
                                    value={values.visitors}
                                    onChange={e => set({ visitors: e.target.value })}>
                                <option value="">{t('all')}</option>
                                <option value="NEVER">{t('never')}</option>
                                <option value="SOMETIMES">{t('sometimes')}</option>
                                <option value="OFTEN">{t('often')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Pets + age */}
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">
                                🐾 {t('pets')}
                            </label>
                            <select className="border rounded-lg px-3 py-2 text-sm w-full"
                                    value={values.hasPets}
                                    onChange={e => set({ hasPets: e.target.value })}>
                                <option value="">{t('all')}</option>
                                <option value="false">{t('no')}</option>
                                <option value="true">{t('yes')}</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">
                                {t('minAge')}
                            </label>
                            <input type="number" min="18" max="99"
                                   className="border rounded-lg px-3 py-2 text-sm w-full"
                                   placeholder="18"
                                   value={values.minAge}
                                   onChange={e => set({ minAge: e.target.value })} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">
                                {t('maxAge')}
                            </label>
                            <input type="number" min="18" max="99"
                                   className="border rounded-lg px-3 py-2 text-sm w-full"
                                   placeholder="99"
                                   value={values.maxAge}
                                   onChange={e => set({ maxAge: e.target.value })} />
                        </div>
                    </div>

                    {/* LGBTQ+ checkbox */}
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" className="rounded"
                               checked={values.lgbtqFriendly}
                               onChange={e => set({ lgbtqFriendly: e.target.checked })} />
                        🏳️‍🌈 {t('lgbtqFriendly')}
                    </label>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-1">
                        <Button size="sm" onClick={onSearch} disabled={loading}>
                            {loading ? t('searching') : t('search')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={onClear}>
                            {t('clearFilters')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoommateFilterPanel;