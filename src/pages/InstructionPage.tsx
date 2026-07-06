import Layout from '@/components/Layout';
import { useTranslation } from 'react-i18next';
import usePageTitle from "@/hooks/usePageTitle.ts";
import InstructionEl from "@/components/instructions/InstructionEl.tsx";
import InstructionEn from "@/components/instructions/InstructionEn.tsx";

const PrivacyPage = () => {
    const { i18n, t } = useTranslation();

    usePageTitle(t('instructions'))

    return (
        <Layout>
            <div key={i18n.language}>
                {i18n.language.startsWith('el') ? <InstructionEl /> : <InstructionEn />}
            </div>
        </Layout>
    );
};

export default PrivacyPage;