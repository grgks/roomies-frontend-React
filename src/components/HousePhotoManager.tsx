import { useState, useEffect, useRef , useCallback} from 'react';
import { getHousePhotos, uploadHousePhoto, deleteHousePhoto } from '@/api/housePhotoApi';
import type { HousePhoto } from '@/types';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface Props {
    houseId: number;
}

const HousePhotoManager = ({ houseId }: Props) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photos, setPhotos] = useState<HousePhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const data = await getHousePhotos(houseId);
                setPhotos(data);
            } catch {
                // φωτογραφίες δεν φόρτωσαν
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, [houseId]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (lightboxIndex === null) return;
        if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev! + 1) % photos.length);
        else if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev! - 1 + photos.length) % photos.length);
        else if (e.key === 'Escape') setLightboxIndex(null);
    }, [lightboxIndex, photos.length]);

    useEffect(() => {
        if (lightboxIndex !== null) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, handleKeyDown]);

    useEffect(() => {
        if (!errorMsg) return;
        const timer = setTimeout(() => setErrorMsg(null), 3000);
        return () => clearTimeout(timer);
    }, [errorMsg]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const newPhoto = await uploadHousePhoto(houseId, file);
            setPhotos(prev => [...prev, newPhoto]);
        } catch (error: unknown) {
            if ((error as { response?: { status: number } })?.response?.status === 400) {
                setErrorMsg(t('maxPhotosReached'));
            } else {
                setErrorMsg(t('uploadFailed'));
            }
        } finally {
            setUploading(false);
            // reset input that can upload same file
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (photoId: number) => {
        setDeletingId(photoId);
        try {
            await deleteHousePhoto(houseId, photoId);
            setPhotos(prev => prev.filter(p => p.id !== photoId));
        } catch {
            // delete failed
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <p className="text-sm text-slate-400">{t('loading')}...</p>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{t('housePhotos')}</h2>
                <div className="flex items-center gap-2">
                    {photos.length > 0 && (
                        <button
                            className="text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-lg"
                            title={t('viewPhotos')}
                            onClick={() => setLightboxIndex(0)}
                        >
                            ▶
                        </button>
                    )}
                    <Button
                        size="sm"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? t('uploading') : t('addPhoto')}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </div>
            </div>

            {photos.length === 0 ? (
                <p className="text-sm text-slate-400">{t('noPhotos')}</p>
            ) : (
                <div className="flex gap-3 flex-wrap">
                    {photos.map(photo => (
                        <div key={photo.id} className="relative group">
                            <img
                                src={photo.blobUrl}
                                alt={t('photo')}
                                className="w-28 h-28 object-cover rounded-lg"
                            />
                            <button
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full
                                           w-6 h-6 flex items-center justify-center text-xs
                                           opacity-0 group-hover:opacity-100 transition-opacity
                                           cursor-pointer hover:bg-red-600"
                                disabled={deletingId === photo.id}
                                onClick={() => handleDelete(photo.id)}
                                title={t('deletePhoto')}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {errorMsg && (
                <p className="text-sm text-red-500 mt-3">{errorMsg}</p>
            )}

            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-3xl hover:text-slate-300 cursor-pointer"
                        onClick={() => setLightboxIndex(null)}
                    >
                        ✕
                    </button>
                    {photos.length > 1 && (
                        <button
                            className="absolute left-4 text-white text-4xl hover:text-slate-300 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length); }}
                        >
                            ‹
                        </button>
                    )}
                    <img
                        src={photos[lightboxIndex].blobUrl}
                        alt={`${t('photo')} ${lightboxIndex + 1}`}
                        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {photos.length > 1 && (
                        <button
                            className="absolute right-4 text-white text-4xl hover:text-slate-300 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % photos.length); }}
                        >
                            ›
                        </button>
                    )}
                    <span className="absolute bottom-4 text-white text-sm">
                        {lightboxIndex + 1} / {photos.length}
                    </span>
                </div>
            )}
        </div>
    );
};

export default HousePhotoManager;