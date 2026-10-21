import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface HouseFilterValues {
    minBudget: string;
    maxBudget: string;
    requiresHeating: boolean;
    requiresAC: boolean;
    requiresFurnished: boolean;
}

interface Props {
    values: HouseFilterValues;
    onChange: (values: HouseFilterValues) => void;
    onSearch: () => void;
    onClear: () => void;
    loading: boolean;
    filtersApplied: boolean;
}

const HouseFilterPanel = ({ values, onChange, onSearch, onClear, loading, filtersApplied }: Props) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const set = (patch: Partial<HouseFilterValues>) =>
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
                    {/* Budget */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">
                                {t('minBudget')} (€)
                            </label>
                            <input
                                type="number" min="0"
                                className="border rounded-lg px-3 py-2 text-sm w-full"
                                placeholder="0"
                                value={values.minBudget}
                                onChange={e => set({ minBudget: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 mb-1 block">
                                {t('maxBudget')} (€)
                            </label>
                            <input
                                type="number" min="0"
                                className="border rounded-lg px-3 py-2 text-sm w-full"
                                placeholder="9999"
                                value={values.maxBudget}
                                onChange={e => set({ maxBudget: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* checkboxes */}
                    <div className="flex flex-wrap gap-5">
                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input type="checkbox" className="rounded"
                                   checked={values.requiresHeating}
                                   onChange={e => set({ requiresHeating: e.target.checked })} />
                            🔥 {t('heating')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input type="checkbox" className="rounded"
                                   checked={values.requiresAC}
                                   onChange={e => set({ requiresAC: e.target.checked })} />
                            ❄️ {t('airConditioning')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input type="checkbox" className="rounded"
                                   checked={values.requiresFurnished}
                                   onChange={e => set({ requiresFurnished: e.target.checked })} />
                            🛋️ {t('furnished')}
                        </label>
                    </div>

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

export default HouseFilterPanel;