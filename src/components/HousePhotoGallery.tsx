import { useState, useEffect, useCallback } from 'react';
import { getHousePhotos } from '@/api/housePhotoApi';
import type { HousePhoto } from '@/types';
import { useTranslation } from 'react-i18next';

interface Props {
    houseId: number;
}

const HousePhotoGallery = ({ houseId }: Props) => {
    const { t } = useTranslation();
    const [photos, setPhotos] = useState<HousePhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null); // null = closed

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const data = await getHousePhotos(houseId);
                setPhotos(data);
            } catch {
                // if fails we show empty - do not break the page
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, [houseId]);

    // Keyboard navigation στο lightbox (arrows + Escape)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (lightboxIndex === null) return;
        if (e.key === 'ArrowRight') {
            setLightboxIndex(prev => (prev! + 1) % photos.length);
        } else if (e.key === 'ArrowLeft') {
            setLightboxIndex(prev => (prev! - 1 + photos.length) % photos.length);
        } else if (e.key === 'Escape') {
            setLightboxIndex(null);
        }
    }, [lightboxIndex, photos.length]);

    useEffect(() => {
        if (lightboxIndex !== null) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // locks scroll back
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, handleKeyDown]);

    if (loading) {
        return <p className="text-sm text-slate-400 py-3 px-5">{t('loading')}...</p>;
    }

    if (photos.length === 0) {
        return <p className="text-sm text-slate-400 py-3 px-5">{t('noPhotos')}</p>;
    }

    return (
        <div className="bg-blue-100 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('housePhotos')}</h2>
            {/* Thumbnail grid */}
            <div className="flex gap-2 flex-wrap py-3 px-5">
                {photos.map((photo, index) => (
                    <img
                        key={photo.id}
                        src={photo.blobUrl}
                        alt={`${t('photo')} ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer
                                   border-2 border-transparent hover:border-indigo-400
                                   transition-colors"
                        onClick={() => setLightboxIndex(index)}
                    />
                ))}
            </div>

            {/* Lightbox overlay */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                    onClick={() => setLightboxIndex(null)} // Click to background closed
                >
                    {/* X button */}
                    <button
                        className="absolute top-4 right-4 text-white text-3xl
                                   hover:text-slate-300 cursor-pointer"
                        onClick={() => setLightboxIndex(null)}
                    >
                        ✕
                    </button>

                    {/* Left arrow */}
                    {photos.length > 1 && (
                        <button
                            className="absolute left-4 text-white text-4xl
                                       hover:text-slate-300 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); // to do not close lightbox
                                setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
                            }}
                        >
                            ‹
                        </button>
                    )}

                    {/* Main image */}
                    <img
                        src={photos[lightboxIndex].blobUrl}
                        alt={`${t('photo')} ${lightboxIndex + 1}`}
                        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()} //click to foto not closing
                    />

                    {/* Right arrow */}
                    {photos.length > 1 && (
                        <button
                            className="absolute right-4 text-white text-4xl
                                       hover:text-slate-300 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((lightboxIndex + 1) % photos.length);
                            }}
                        >
                            ›
                        </button>
                    )}

                    {/* Counter (e.g. 2/5) */}
                    <span className="absolute bottom-4 text-white text-sm">
                        {lightboxIndex + 1} / {photos.length}
                    </span>
                </div>
            )}
        </div>
    );
};

export default HousePhotoGallery;