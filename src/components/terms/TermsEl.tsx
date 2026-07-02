import { useTranslation } from 'react-i18next';
import { APPLICATION_EMAIL, PRIVACY_POLICY_LAST_UPDATED } from "@/utils/constants.ts";

const TermsEl = () => {
    useTranslation();
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Όροι Χρήσης</h1>
                    <p className="text-sm text-slate-400 mt-1">Τελευταία ενημέρωση: {PRIVACY_POLICY_LAST_UPDATED.el}</p>
                </div>

                <div className="flex flex-col gap-8">

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">1. Αποδοχή των Όρων</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Με τη χρήση της εφαρμογής Roomies, αποδέχεστε τους παρόντες Όρους Χρήσης. Εάν δεν συμφωνείτε, παρακαλούμε μην χρησιμοποιείτε την υπηρεσία.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">2. Περιγραφή Υπηρεσίας</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Το Roomies είναι μια πλατφόρμα διαχείρισης συγκατοίκησης που επιτρέπει την οργάνωση εξόδων, εργασιών, αξιολογήσεων, μηνυμάτων και προσκλήσεων μεταξύ συγκατοίκων. Η υπηρεσία παρέχεται «ως έχει».
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">3. Λογαριασμοί Χρηστών</h2>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Είστε υπεύθυνοι για τη διατήρηση της ασφάλειας του λογαριασμού σας</li>
                            <li>Οφείλετε να παρέχετε ακριβείς πληροφορίες κατά την εγγραφή</li>
                            <li>Είστε υπεύθυνοι για κάθε δραστηριότητα που πραγματοποιείται μέσω του λογαριασμού σας</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">4. Αποδεκτή Χρήση</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">Απαγορεύεται:</p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Η χρήση της υπηρεσίας για παράνομους σκοπούς</li>
                            <li>Η παρενόχληση, κατάχρηση ή βλάβη άλλων χρηστών</li>
                            <li>Η ανάρτηση προσβλητικού, παραπλανητικού ή παράνομου περιεχομένου</li>
                            <li>Η απόπειρα παραβίασης της ασφάλειας της εφαρμογής</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">5. Περιεχόμενο Χρήστη</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Τα δεδομένα που εισάγετε (έξοδα, εργασίες, μηνύματα, αξιολογήσεις) αποτελούν δική σας ευθύνη. Οφείλετε να διασφαλίζετε την ακρίβεια και τη νομιμότητά τους.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">6. Περιορισμός Ευθύνης - Διαφορές Συγκατοίκων</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Το Roomies αποτελεί <strong>εργαλείο οργάνωσης</strong> και δεν αποτελεί μέρος οποιασδήποτε συμφωνίας μεταξύ συγκατοίκων. Δεν φέρουμε ευθύνη για:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Οικονομικές διαφορές ή διαφωνίες σχετικά με έξοδα και οφειλές</li>
                            <li>Διαφορές σχετικά με εργασίες, αξιολογήσεις ή προσωπικές σχέσεις</li>
                            <li>Την ακρίβεια των δεδομένων που καταχωρούν οι χρήστες</li>
                            <li>Οποιαδήποτε ζημία προκύψει από τη χρήση ή αδυναμία χρήσης της υπηρεσίας</li>
                        </ul>
                        <p className="text-sm text-slate-600 mt-2">
                            Οι όποιες διαφορές μεταξύ συγκατοίκων επιλύονται αποκλειστικά μεταξύ των εμπλεκομένων.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">7. Τερματισμός</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Μπορείτε να διαγράψετε τον λογαριασμό σας ανά πάσα στιγμή μέσω της εφαρμογής. Διατηρούμε το δικαίωμα αναστολής λογαριασμών που παραβιάζουν τους παρόντες όρους.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">8. Αλλαγές στους Όρους</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Ενδέχεται να τροποποιήσουμε τους παρόντες όρους. Η συνέχιση χρήσης της υπηρεσίας μετά από αλλαγές συνιστά αποδοχή των νέων όρων.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">9. Εφαρμοστέο Δίκαιο</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Οι παρόντες όροι διέπονται από το Ελληνικό δίκαιο και τη νομοθεσία της Ευρωπαϊκής Ένωσης.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">10. Επικοινωνία</h2>
                        <p className="text-sm text-slate-600">
                            Για οποιαδήποτε ερώτηση σχετικά με τους όρους χρήσης: <span className="text-indigo-600">{APPLICATION_EMAIL}</span>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default TermsEl;