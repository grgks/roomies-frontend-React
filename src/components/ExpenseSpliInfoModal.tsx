import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { ExpenseSplit } from '@/types';
import {useTranslation} from "react-i18next";

interface ExpenseSplitInfoModalProps {
    split: ExpenseSplit;
    createdByName: string;
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('el-GR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

const ExpenseSplitInfoModal = ({ split, createdByName }: ExpenseSplitInfoModalProps) => {

    const { t } = useTranslation();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    id={`split-info-btn-${split.id}`}
                    className="text-slate-400 hover:text-indigo-500 transition"
                >
                    <Info size={16} strokeWidth={2.75}/>
                </button>
            </DialogTrigger>
            <DialogContent id={`split-info-modal-${split.id}`}>
                <DialogHeader>
                    <DialogTitle>{t('splitDetails')}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('createdΒy')}</span>
                        <span className="font-medium">{createdByName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('createdAt')}</span>
                        <span className="font-medium">{formatDate(split.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('amount')}</span>
                        <span className="font-medium">€{split.amount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Status</span>
                        <span className={`font-medium ${split.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                            {split.isPaid ? t('paid') : t('unpaid')}
                        </span>
                    </div>
                    {split.isPaid && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">{t('paidAt')}</span>
                            <span className="font-medium text-green-600">{formatDate(split.updatedAt)}</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseSplitInfoModal;