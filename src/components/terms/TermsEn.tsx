import { useTranslation } from 'react-i18next';
import { APPLICATION_EMAIL, PRIVACY_POLICY_LAST_UPDATED } from "@/utils/constants.ts";

const TermsEn = () => {
    useTranslation();
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Terms of Service</h1>
                    <p className="text-sm text-slate-400 mt-1">Last updated: {PRIVACY_POLICY_LAST_UPDATED.en}</p>
                </div>

                <div className="flex flex-col gap-8">

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">1. Acceptance of Terms</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            By using the Roomies application, you accept these Terms of Service. If you do not agree, please do not use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">2. Service Description</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Roomies is a roommate management platform that helps organize expenses, tasks, ratings, messages, and invitations between roommates. The service is provided "as is".
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">3. User Accounts</h2>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>You must provide accurate information during registration</li>
                            <li>You are responsible for all activity carried out through your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">4. Acceptable Use</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">The following is prohibited:</p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Using the service for unlawful purposes</li>
                            <li>Harassing, abusing, or harming other users</li>
                            <li>Posting offensive, misleading, or illegal content</li>
                            <li>Attempting to breach the security of the application</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">5. User Content</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            The data you enter (expenses, tasks, messages, ratings) is your responsibility. You must ensure its accuracy and legality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">6. Limitation of Liability - Roommate Disputes</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Roomies is an <strong>organizational tool</strong> and is not a party to any agreement between roommates. We are not liable for:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Financial disputes or disagreements over expenses and debts</li>
                            <li>Disputes over tasks, ratings, or personal relationships</li>
                            <li>The accuracy of data entered by users</li>
                            <li>Any damage arising from the use or inability to use the service</li>
                        </ul>
                        <p className="text-sm text-slate-600 mt-2">
                            Any disputes between roommates are resolved exclusively between the parties involved.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">7. Termination</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            You may delete your account at any time through the application. We reserve the right to suspend accounts that violate these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">8. Changes to Terms</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            We may modify these terms. Continued use of the service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">9. Governing Law</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            These terms are governed by Greek law and European Union legislation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">10. Contact</h2>
                        <p className="text-sm text-slate-600">
                            For any questions regarding these terms of service: <span className="text-indigo-600">{APPLICATION_EMAIL}</span>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default TermsEn;