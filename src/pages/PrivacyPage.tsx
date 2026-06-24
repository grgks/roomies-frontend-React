import Layout from '@/components/Layout';
import { useTranslation } from 'react-i18next';
import PrivacyEl from '@/components/privacy/PrivacyEl';
import PrivacyEn from '@/components/privacy/PrivacyEn';
import usePageTitle from "@/hooks/usePageTitle.ts";

const PrivacyPage = () => {
    const { i18n, t } = useTranslation();

    usePageTitle(t('privacy'))

    return (
        <Layout>
            <div key={i18n.language}>
                {i18n.language.startsWith('el') ? <PrivacyEl /> : <PrivacyEn />}
            </div>
        </Layout>
    );
};

export default PrivacyPage;