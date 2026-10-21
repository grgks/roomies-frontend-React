import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTranslation } from "react-i18next";
import {getHouseProfile, getRoommateProfile} from '@/api/searchApi';
import type {HouseProfile, RoommateProfile} from '@/types/searchSchemas';
import HouseCharacteristics from '@/components/HouseCharacteristics';
import RoommateCharacteristics from '@/components/RoommateCharacteristics';
import HousePhotoGallery from "@/components/HousePhotoGallery.tsx";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    firstname?: string;
    lastname?: string;
    categoryScores: Record<string, number>;
    houseRating?: number | null;
    houseId?: number | null; // for house characteristics + photos
    roommateId?: number | null;
}

const RatingInfoModal = ({ open, onOpenChange, firstname,
                             lastname, categoryScores, houseRating, houseId, roommateId }: Props) => {
    const { t } = useTranslation();

    const [houseProfile, setHouseProfile] = useState<HouseProfile | null>(null);
    const [roommateProfile, setRoommateProfile] = useState<RoommateProfile | null>(null);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setHouseProfile(null);
            setRoommateProfile(null);
        }
        onOpenChange(isOpen);
    };

    useEffect(() => {
        if (!open) return;

        if (houseId) {
            getHouseProfile(houseId).then(setHouseProfile).catch(() => {});
        }
        if (roommateId) {
            getRoommateProfile(roommateId).then(setRoommateProfile).catch(() => {});
        }
    }, [open, houseId, roommateId]);


    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <span className="hidden" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {firstname} {lastname} - {t('rating')}
                    </DialogTitle>
                    <DialogDescription className="sr-only">{t('rating')}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 text-sm">
                    {/* Ratings/category */}
                    {Object.entries(categoryScores).length === 0 ? (
                        <p className="text-slate-400">{t('noRatingsYet')}</p>
                    ) : (
                        Object.entries(categoryScores).map(([category, score]) => (
                            <div key={category} className="flex justify-between">
                                <span className="text-slate-600">{t(category)}</span>
                                <span className="font-medium">⭐ {score.toFixed(1)}</span>
                            </div>
                        ))
                    )}

                    {/* House Rating */}
                    <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-slate-600 font-medium">{t('houseRating')}</span>
                        {houseRating != null && houseRating !== 0
                            ? <span className="font-medium">⭐ {houseRating.toFixed(1)}</span>
                            : <span className="text-slate-400">{t('noRatingsYet')}</span>
                        }
                    </div>

                    {/* Roommate Characteristics */}
                    {roommateId && (
                        <div className="border-t pt-3 mt-2">
                            <span className="text-slate-600 font-medium">{t('characteristics')}</span>
                            <div className="mt-1">
                                <RoommateCharacteristics profile={roommateProfile} />
                            </div>
                        </div>
                    )}

                    {/* House Characteristics */}
                    {houseId && (
                        <div className="border-t pt-3 mt-2">
                            <span className="text-slate-600 font-medium">{t('characteristics')}</span>
                            <div className="mt-1">
                                <HouseCharacteristics profile={houseProfile} />
                            </div>
                        </div>
                    )}

                    {/* House Photos */}
                    {houseId && (
                        <div className="border-t pt-3 mt-2">
                            <HousePhotoGallery houseId={houseId} />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RatingInfoModal;