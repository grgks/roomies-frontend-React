import useAuth from "@/hooks/useAuth";
import keycloak from "@/services/keycloakService";
import { useTranslation } from 'react-i18next';
import usePageTitle from "@/hooks/usePageTitle.ts";


const LoginPage = () => {
    const { login } = useAuth();
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'el' ? 'en' : 'el');
    };

    const register = () => keycloak.register({
        redirectUri: window.location.origin,
    });

    usePageTitle(t('login'))

    return (
        <div
            className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
            style={{ backgroundImage: "url('/room.jpg')" }}
        >

            <button
                onClick={toggleLanguage}
                className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition cursor-pointer">
                {i18n.language === 'el' ? 'EN' : 'EL'}
            </button>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 min-w-[320px]">
                <img
                    src="/roomies.png"
                    alt="Roomies Logo"
                    className="h-30 w-60 rounded-lg"
                />
                <p className="text-white text-lg font-medium tracking-wide">
                    {t('welcomeToRoomies')}
                </p>
                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={login}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition w-full"
                    >
                        {t('login')}
                    </button>
                    <button
                        onClick={register}
                        className="bg-white/30 hover:bg-white/40 text-purple-700 font-semibold px-8 py-3 rounded-lg transition w-full border border-white/50"
                    >
                        {t('createAccount')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;