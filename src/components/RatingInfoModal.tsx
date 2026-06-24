import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {useTranslation} from "react-i18next";

interface RatingInfoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    firstname?: string;
    lastname?: string;
    categoryScores: Record<string, number>;
    houseRating?: number | null
}


const RatingInfoModal = ({ open, onOpenChange, firstname, lastname, categoryScores, houseRating}: RatingInfoModalProps) => {

const { t } = useTranslation();

return(

    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            <span className="hidden" />
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {firstname} {lastname} - {t('rating')}
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 text-sm">
                {Object.entries(categoryScores).length === 0 ? (
                    <p className="text-slate-400">No ratings yet.</p>
                ) : (
                    Object.entries(categoryScores).map(([category, score]) => (
                        <div key={category} className="flex justify-between">
                            <span className="text-slate-600">{t(category)}</span>
                            <span className="font-medium">⭐ {score.toFixed(1)}</span>
                        </div>
                    ))
                )}
                <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-slate-600 font-medium">{t('houseRating')}</span>
                    {houseRating != null && houseRating !== 0
                        ? <span className="font-medium">⭐ {houseRating.toFixed(1)}</span>
                        : <span className="text-slate-400">{t('noRatingsYet')}</span>
                    }
                </div>
            </div>
        </DialogContent>
    </Dialog>
);
};
export default RatingInfoModal;