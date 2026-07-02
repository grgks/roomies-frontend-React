import Layout from '@/components/Layout';
import { useTranslation } from 'react-i18next';
import TermsEl from '@/components/terms/TermsEl';
import TermsEn from '@/components/terms/TermsEn';
import usePageTitle from "@/hooks/usePageTitle.ts";

const TermsPage = () => {
    const { i18n, t } = useTranslation();

    usePageTitle(t('terms'))

    return (
        <Layout>
            <div key={i18n.language}>
                {i18n.language.startsWith('el') ? <TermsEl /> : <TermsEn />}
            </div>
        </Layout>
    );
};

export default TermsPage;