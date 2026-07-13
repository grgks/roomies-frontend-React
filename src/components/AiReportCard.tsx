import { useState, useEffect, useRef } from 'react';
import { Lightbulb, RefreshCw, X } from 'lucide-react';
import { getHouseReport } from '@/api/aiReportApi';
import { useTranslation } from 'react-i18next';

interface AiReportCardProps {
    houseId: number;
}

const AiReportCard = ({ houseId }: AiReportCardProps) => {
    const { t, i18n } = useTranslation();
    const [report, setReport] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const loadReport = async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await getHouseReport(houseId, i18n.language, false);
            setReport(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const refreshReport = async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await getHouseReport(houseId, i18n.language, true);
            setReport(data);
        } catch {
            // Keep old report, don't show error if we already have one
            if (!report) setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Load cached report when opening
    const handleOpen = () => {
        setOpen(true);
        loadReport();
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    if (!open) {
        return (
            <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translateX(-50%)' }}>
                <button
                    onClick={handleOpen}
                    className="flex items-center gap-2 bg-yellow-400/90 hover:bg-yellow-500/90 text-slate-800 font-semibold text-sm px-4 py-2 rounded-full shadow-lg transition"
                >
                    <Lightbulb size={16} />
                    {t('generateReport')}
                </button>
            </div>
        );
    }


    return (
        <div className="absolute" style={{ top: '25%', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            {!open ? (
                <button
                    onClick={handleOpen}
                    className="flex items-center gap-2 bg-yellow-400/90 hover:bg-yellow-500/90 text-slate-800 font-semibold text-sm px-4 py-2 rounded-full shadow-lg transition"
                >
                    <Lightbulb size={16} />
                    {t('generateReport')}
                </button>
            ) : (
                <div ref={cardRef} className="bg-white/90 backdrop-blur-md rounded-2xl p-5 min-w-[300px] max-w-[400px] max-h-[50vh] overflow-y-auto shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={18} className="text-yellow-500" />
                            <h3 className="text-sm font-bold text-slate-800">{t('aiHouseReport')}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={refreshReport}
                                disabled={loading}
                                className="text-slate-400 hover:text-slate-600 transition disabled:opacity-30"
                                aria-label={t('refresh')}
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition"
                                aria-label={t('close')}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-4">
                            <RefreshCw size={20} className="animate-spin text-yellow-500" />
                            <span className="text-slate-500 text-xs ml-2">{t('generatingReport')}</span>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center py-3">
                            <p className="text-red-600 text-xs mb-2">{t('couldNotGenerateReport')}</p>
                            <button
                                onClick={refreshReport}
                                className="text-slate-500 hover:text-slate-700 text-xs underline"
                            >
                                {t('tryAgain')}
                            </button>
                        </div>
                    )}

                    {report && !loading && (
                        <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                            {report}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiReportCard;