import {APPLICATION_EMAIL, CREATOR_GITHUB_URL} from "@/utils/constants.ts";

const ContactEl = () => {
    return (
        <div className="min-h-screen bg-slate-300 py-12 px-4">
            <div className="max-w-2xl mx-auto flex flex-col gap-10">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Επικοινωνία</h1>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Έχεις ερώτηση, πρόταση ή απλώς θέλεις να πεις γεια; Μη διστάσεις να επικοινωνήσεις.
                    </p>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-4">

                    <a href="mailto:roomies@gmail.com"
                       className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition group" aria-label="Email">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-lg">
                            ✉️
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 group-hover:text-purple-600 transition">Email</p>
                            <p className="text-xs text-slate-400">{APPLICATION_EMAIL}</p>
                        </div>
                    </a>

                    <a href="https://github.com/grgks" target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition group" aria-label="GitHub">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-lg">
                            🐙
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition">GitHub</p>
                            <p className="text-xs text-slate-400">{CREATOR_GITHUB_URL}</p>
                        </div>
                    </a>

                    <a href="https://www.linkedin.com/in/giorgos-k-882332360/" target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition group" aria-label="LinkedIn">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
                            💼
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition">LinkedIn</p>
                        </div>
                    </a>

                </div>

                <div className="border-t pt-6">
                    <p className="text-xs text-slate-400">
                        Για αιτήματα σχετικά με το απόρρητο, ανατρέξτε στην{' '}
                        <a href="/privacy" className="text-indigo-500 hover:underline">Πολιτική Απορρήτου</a>.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ContactEl;