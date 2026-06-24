import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createRating } from '@/api/ratingApi';
import { RatingCategory } from '@/types/enums';
import type { Roommate } from '@/types';
import { useTranslation } from 'react-i18next';

interface RateRoommateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roommate: Roommate;
    onRated?: () => void;
}

const CATEGORIES = Object.values(RatingCategory);

const RateRoommateModal = ({ open, onOpenChange, roommate, onRated }: RateRoommateModalProps) => {
    const { t } = useTranslation();
    const [scores, setScores] = useState<Record<string, number>>(
        Object.fromEntries(CATEGORIES.map(c => [c, 3]))
    );
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await Promise.all(
                CATEGORIES.map(category =>
                    createRating({
                        toRoommateId: roommate.id,
                        category,
                        score: scores[category],
                    })
                )
            );
            onRated?.();
        } catch {
            //console.error('Could not submit ratings');
        } finally {
            setSubmitting(false);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <span className="hidden" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('rate')} {roommate.firstname} {roommate.lastname}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-2">
                    {CATEGORIES.map(category => (
                        <div key={category} className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">{t(category)}</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setScores(prev => ({ ...prev, [category]: n }))}
                                        className={`w-8 h-8 rounded-full text-sm font-medium border transition ${
                                            scores[category] === n
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <Button
                        disabled={submitting}
                        onClick={handleSubmit}
                        className="mt-2"
                    >
                        {submitting ? t('submitting') : t('submitRatings')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RateRoommateModal;