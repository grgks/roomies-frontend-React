import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const OfflineOverlay = () => {
    const { t } = useTranslation();
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const goOffline = () => setIsOffline(true);
        const goOnline = () => setIsOffline(false);
        window.addEventListener('offline', goOffline);
        window.addEventListener('online', goOnline);
        return () => {
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('online', goOnline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-[#1e1b2e]/95 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                <img src="/roomies.png" alt="Roomies" className="h-20 w-40 mx-auto mb-6 rounded-lg" />
                <h1 className="text-2xl font-bold text-purple-300 mb-3">{t('offlineTitle')}</h1>
                <p className="text-slate-400 text-sm leading-relaxed">{t('offlineMessage')}</p>
                <div className="mt-8 relative h-12 w-full overflow-hidden">
                    <div className="absolute text-3xl" style={{ animation: 'run 3s linear infinite', transform: 'scaleX(-1)' }}>
                        🦖
                    </div>
                    <div className="absolute text-sm" style={{ animation: 'bits 3s linear infinite' }}>
                         📶 📡 📶 📡
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes run {
                    0% { left: -10%; }
                    100% { left: 85%; }
                }
                @keyframes bits {
                    0% { left: 30%; opacity: 1; }
                    100% { left: 95%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default OfflineOverlay;