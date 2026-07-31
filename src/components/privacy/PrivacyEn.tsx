import {APPLICATION_EMAIL, PRIVACY_POLICY_LAST_UPDATED} from "@/utils/constants.ts";

const PrivacyEn = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Privacy Policy</h1>
                    <p className="text-sm text-slate-400 mt-1">Last updated: {PRIVACY_POLICY_LAST_UPDATED.en}</p>
                    <p className="text-sm text-slate-500 mt-1">Data Controller: G.K., Athens, Greece</p>
                </div>

                <div className="flex flex-col gap-8">

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">1. Data We Collect</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            When you use Roomies, we collect the following personal data:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Email address and username (via Keycloak registration)</li>
                            <li>First name, last name, gender (roommate profile)</li>
                            <li>Phone number (user profile)</li>
                            <li>Usage data: expenses, tasks, messages, ratings, invitations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">2. Legal Basis (GDPR Art. 6)</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            We process your data based on:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li><strong>Contract performance</strong> - to provide the Roomies service</li>
                            <li><strong>Legitimate interest</strong> - to maintain security and prevent abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">3. How We Use Your Data</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Your data is used exclusively to provide the Roomies service. We do not sell, share or use your data for advertising or profiling purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">4. Data Retention</h2>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Active accounts: data is retained for the duration of your use</li>
                            <li>Inactive accounts: soft deleted after account deactivation, permanently deleted after 5 years (automated)</li>
                            <li>You may request deletion at any time via the application</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">5. Your Rights (GDPR)</h2>
                        <p className="text-sm text-slate-600 mb-2">You have the right to:</p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Access your personal data</li>
                            <li>Rectify inaccurate data</li>
                            <li>Request erasure ("right to be forgotten")</li>
                            <li>Data portability</li>
                        </ul>
                        <p className="text-sm text-slate-600 mt-2">
                            To exercise your rights, contact us at: <span className="text-indigo-600">{APPLICATION_EMAIL}</span>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">6. Security</h2>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Authentication via Keycloak. Passwords never stored by the application</li>
                            <li>Tokens stored as httpOnly, SameSite=Strict cookies</li>
                            <li>Message content encrypted at rest (AES/GCM)</li>
                            <li>Rate limiting (50 requests/minute per IP)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">7. Third Parties (Data Processors)</h2>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li><strong>Keycloak</strong> - identity and access management</li>
                            <li><strong>Railway</strong> - backend and database hosting (EU West region, Amsterdam)</li>
                            <li><strong>Azure Static Web Apps</strong> - frontend hosting</li>
                            <li><strong>Azure Application Insights</strong> - performance and error telemetry (anonymous, cookieless)</li>
                            <li><strong>Sentry (Functional Software Inc.)</strong> - application error tracking (no PII, cookieless). Data hosted in the EU (Frankfurt). Legal basis: legitimate interest (GDPR Art. 6(1)(f)) for service reliability improvements.</li>
                        </ul>
                        <p className="text-sm text-slate-600 mt-2">
                            All your data is stored and processed within the European Union.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">8. Cookies</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            We use strictly necessary cookies only:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Authentication cookies (httpOnly) to keep you signed in</li>
                        </ul>
                        <p className="text-sm text-slate-600 mt-2">
                            We do not use analytics, advertising, or tracking cookies. Performance telemetry operates without cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">9. Contact</h2>
                        <p className="text-sm text-slate-600">
                            For any privacy-related questions or data requests: <span className="text-indigo-600">{APPLICATION_EMAIL}</span>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyEn;