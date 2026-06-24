import Layout from "@/components/Layout.tsx";
import ContactEl from "@/components/contact/ContactEl.tsx";
import {useTranslation} from "react-i18next";
import ContactEn from "@/components/contact/ContactEn.tsx";
import usePageTitle from "@/hooks/usePageTitle.ts";


const ContactPage = () => {

    const { i18n , t } = useTranslation();

    usePageTitle(t('contact'))

    return (
        <Layout>
            <div key={i18n.language}>
                {i18n.language.startsWith('el') ? <ContactEl /> : <ContactEn />}
            </div>
        </Layout>
    );
};
export default ContactPage;