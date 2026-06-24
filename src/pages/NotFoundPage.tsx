import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {Flame} from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle.ts";

const NotFoundPage = () => {
    const { t } = useTranslation();

        usePageTitle(`${t('pageNotFound')}`);

        return (
        <div className="min-h-screen bg-slate-300 flex items-center justify-center">
            <div className="text-center py-16 space-y-6">
                <h1 className="text-9xl font-bold text-red-500">404</h1>
                <p className="text-4xl text-slate-700">{t('pageNotFound')}</p>
                <p className="text-lg text-slate-500">{t('thePageYouAreLookingForDoesNotExist')}</p>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                >
                    <Flame size={18} />
                    {t('backToDashboard')}
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;