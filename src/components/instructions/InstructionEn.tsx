import { useTranslation } from 'react-i18next';
import { PRIVACY_POLICY_LAST_UPDATED } from "@/utils/constants.ts";

const InstructionEn = () => {
    useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Instructions</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Last updated: {PRIVACY_POLICY_LAST_UPDATED.el}
                    </p>
                </div>

                <div className="flex flex-col gap-8">

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">1. Expenses</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            In this section you can:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Add expenses that you have paid.</li>
                            <li>A share will automatically be created for the other roommates (if you have any).</li>
                            <li>View detailed information about expenses and shares.</li>
                            <li>Edit your expenses.</li>
                            <li>Mark the share assigned to you as paid.</li>
                            <li>See which shares of your expenses have been paid or remain unpaid by your roommates.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">2. Roommates</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            In this section you can:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>View your roommates.</li>
                            <li>View their profile information.</li>
                            <li>Send them private messages.</li>
                            <li>Rate them.</li>
                            <li>View their ratings.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">3. Messages</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            In this section you can:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Send a group message to the house.</li>
                            <li>Send a private message to a roommate.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">4. Tasks</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            In this section you can:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Add tasks that you have completed or scheduled.</li>
                            <li>Edit tasks that you have completed or scheduled.</li>
                            <li>View tasks completed or scheduled by your roommates.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">5. Ratings</h2>
                        <p className="text-sm text-slate-600 mb-2">
                            In this section you can:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>
                                <strong>IMPORTANT:</strong> You can rate each roommate only once. Ratings cannot be edited or deleted.
                            </li>
                            <li>View ratings you have received.</li>
                            <li>View ratings you have given.</li>
                            <li>
                                <strong>Note:</strong> Ratings are calculated using an algorithm that gives less weight to older ratings, preventing roommates from being permanently affected by outdated reviews.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">6. Invitations</h2>
                        <p className="text-sm text-slate-600 mb-2">
                            In this section you can:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>If you are the house owner and have an available room, you can invite roommates.</li>
                            <li>View your incoming invitations.</li>
                            <li>View your outgoing invitations.</li>
                            <li>Check the status of all invitations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">7. Houses</h2>
                        <p className="text-sm text-slate-600 mb-2">
                            In this section you can:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>View house information (address, number of rooms, area, and city).</li>
                            <li>View information about your roommates if you are living in a house.</li>
                            <li>If you are not currently living in a house, you can send requests to houses with available rooms.</li>
                            <li>If you are not currently living in a house, you can also view the current average rating of Roommates being that time to each house.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">8. Settings</h2>
                        <p className="text-sm text-slate-600 mb-2">
                            In this section you can:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Edit your personal information.</li>
                            <li>Change your password.</li>
                            <li>Select or change your avatar.</li>
                            <li>Choose whether you want to appear in house owners' roommate searches.</li>
                            <li>Deactivate your account.</li>
                            <li>Change language (English/Greek).</li>
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default InstructionEn;