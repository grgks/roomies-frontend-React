import {useTranslation} from "react-i18next";
import Layout from "@/components/Layout.tsx";
import AboutEl from "@/components/about/AboutEl.tsx";
import AboutEn from "@/components/about/AboutEn.tsx";
import usePageTitle from "@/hooks/usePageTitle.ts";


const AboutPage = () => {

    const { i18n, t } = useTranslation();

    usePageTitle(t('about'))

    return (
        <Layout>
            <div key={i18n.language}>
                {i18n.language.startsWith('el') ? <AboutEl /> : <AboutEn />}
            </div>
        </Layout>
    );
};
export default AboutPage;