import {Link} from "react-router";
import {useTranslation} from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    const currentYear: number = new Date().getFullYear();

    return (
        <>
        <footer
            className="bg-gray-700 w-full bg-black/40 backdrop-blur border-t border-white/10 md:fixed md:bottom-0 md:left-0">
                <div
                    className="max-w-6xl mx-auto px-6 py-4 text-white text-sm flex flex-col md:flex-row justify-between items-center gap-3">

                    {/*// <!-- LEFT -->*/}
                    <p className="opacity-70">{t('copyright')} {currentYear}</p>

                    {/*// <!-- CENTER NAV -->*/}
                    <div className="flex gap-5 flex-wrap justify-center">
                        <Link
                            to={"/expenses"}
                            className="hover:text-blue-400">
                            {t('expenses')}
                        </Link>

                        <Link
                            to={"/messages"} className="hover:text-purple-400">
                            {t('messages')}
                        </Link>

                        <Link
                            to={"/invitations"} className="hover:text-yellow-400">
                            {t('invitations')}
                        </Link>

                        <Link
                            to={"/roommates"} className="hover:text-green-600">
                            {t('roommates')}
                        </Link>

                        {/*// <!-- Divider -->*/}
                        <span className="opacity-30">|</span>
                        <Link to={"/about"}  className="hover:text-gray-300">{t('about')}</Link>
                        <Link to={"/privacy"}  className="hover:text-gray-300">{t('privacy')}</Link>
                        <Link to={"/terms"}  className="hover:text-gray-300">{t('terms')}</Link>
                        <Link to={"/contact"}  className="hover:text-gray-300">{t('contact')}</Link>
                    </div>

                    {/* RIGHT SOCIAL */}
                    <div className="flex gap-3">
                        <a href="https://github.com/grgks" target="_blank" rel="noopener noreferrer"
                           className="text-white/60 hover:text-white hover:scale-180 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/giorgos-k-882332360/" target="_blank" rel="noopener noreferrer"
                           className="text-white/60 hover:text-white hover:scale-180 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                <rect x="2" y="9" width="4" height="12"/>
                                <circle cx="4" cy="4" r="2"/>
                            </svg>
                        </a>
                        <a href="mailto:roomies@gmail.com"
                           className="text-white/60 hover:text-white hover:scale-180 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                        </a>
                    </div>
                    </div>
            </footer>
        </>
    )
}

export default Footer;