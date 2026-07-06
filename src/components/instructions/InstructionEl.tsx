import { useTranslation } from 'react-i18next';
import {PRIVACY_POLICY_LAST_UPDATED} from "@/utils/constants.ts";


const InstructionEl = () => {
    useTranslation();
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Οδηγίες</h1>
                    <p className="text-sm text-slate-400 mt-1">Τελευταία ενημέρωση: {PRIVACY_POLICY_LAST_UPDATED.el}</p>
                </div>

                <div className="flex flex-col gap-8">

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">1. Έξοδα</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Σε αυτή τη κατηγορία μπορείτε να:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Προσθέσετε Έξοδα που έχετε πληρώσει.</li>
                            <li>Αυτόματα θα δημιουργηθεί το Μερίδιο για τους υπόλοιπους συγκάτοικους (αν έχετε).</li>
                            <li>Δείτε πληροφορίες αναλυτικά για τα Έξοδα και Μερίδια.</li>
                            <li>Μπορείτε επίσης να επεξεργαστείτε τα Έξοδα.</li>
                            <li>Να σημειώσετε ως εξοφλημένο το Μερίδιο που σας αναλογεί.</li>
                            <li>Να δείτε ποιο Μερίδιο απο Έξοδο που έχετε εσείς πληρώσει είναι πληρωμένο ή απλήρωτο απο τους συγκατοίκους σας.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">2. Συγκάτοικοι</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Σε αυτή τη κατηγορία μπορείτε να:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Δείτε τους Συγκατοίκους σας.</li>
                            <li>Δείτε πληροφορίες για αυτούς.</li>
                            <li>Στείλετε προσωπικό μήνυμα σε αυτούς.</li>
                            <li>Τους Βαθμολογήσετε.</li>
                            <li>Δείτε τις Αξιολογήσεις τους.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">3. Μηνύματα</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Σε αυτή τη κατηγορία μπορείτε να:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Στείλετε ομαδικό μήνυμα στο Σπίτι</li>
                            <li>Στείλετε προσωπικό μήνυμα σε Συγκάτοικο.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">4. Εργασίες</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Σε αυτή τη κατηγορία μπορείτε να:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Προσθέσετε Εργασίες όπου έχετε κάνει ή προγραμματίσει να κάνετε.</li>
                            <li>Επεξεργαστείτε Εργασίες όπου έχετε κάνει ή προγραμματίσει να κάνετε.</li>
                            <li>Δείτε Εργασίες όπου έχουν γίνει ή είναι προγραμματισμένες να γίνουν από τους Συγκατοίκους σας. </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">5. Αξιολογήσεις</h2>
                        <p className="text-sm text-slate-600 mb-2">
                            Σε αυτή τη κατηγορία μπορείτε να:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li><strong>ΠΡΟΣΟΧΗ:</strong> Μπορείτε να αξιολογήστε Συγκάτοικους μόνο μια φορά. Δεν υπάρχει διόρθωση ή διαγραφή αξιολόγησης.</li>
                            <li>Να δείτε αξιολογήσεις σας.</li>
                            <li>Να δείτε αξιολογήσεις όπου έχετε εσείς δώσει.</li>
                            <li><strong>Σημείωση : </strong>Οι Αξιολογήσεις βασίζονται σε έναν αλγόριθμο όπου δίνει λιγότερη βαρύτητα σε παλαιότερες Αξιολογήσεις ώστε να μην στιγματίζονται Συγκάτοικοι από λάθος επιλογές.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">6. Προσκλήσεις</h2>
                        <p className="text-sm text-slate-600 mb-2">
                            Σε αυτή τη κατηγορία μπορείτε να:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Αν είστε Ιδιοκτήτης και έχετε ελεύθερο χώρο στο Σπίτι να προσκαλέσετε Συγκατοίκους.</li>
                            <li>Να δείτε τις εισερχόμενες προσκλήσεις σας.</li>
                            <li>Να δείτε τις εξερχόμενες προσκλήσεις σας.</li>
                            <li>Να δείτε το Status όλων των προσκλήσεων.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">7. Σπίτια</h2>
                        <p className="text-sm text-slate-600 mb-2">
                            Σε αυτή τη κατηγορία μπορείτε να:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Δείτε πληροφορίες όσον αφορά το Σπίτι( Διεύθυνση/ Αρ.Δωματίων/ Περιοχή/ Πόλη).</li>
                            <li>Δείτε πληροφορίες για τους Συγκάτοικους σας αν είστε σε Σπίτι.</li>
                            <li>Αν δεν είστε σε Σπίτι : Μπορείτε να στείλετε αιτήματα σε Σπίτια όπου έχουν ελεύθερα δωμάτια.</li>
                            <li>Αν δεν είστε σε Σπίτι μπορείτε να δείτε τον Μ.Ο απο τις αξιολογήσεις που βρίσκονται εκείνη τη στιγμή στο Σπίτι.</li>

                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">8. Ρυθμίσεις</h2>
                        <p className="text-sm text-slate-600 mb-2">
                            Σε αυτή τη κατηγορία μπορείτε να:
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Επεξεργαστείτε τα προσωπικά σας στοιχεία.</li>
                            <li>Αλλάξετε τον κωδικό πρόσβασης σας.</li>
                            <li>Επιλέξετε ή αλλάξετε το avatar σας.</li>
                            <li>Επιλέξετε αν θέλετε να εμφανίζεστε στις αναζητήσεις Ιδιοκτητών.</li>
                            <li>Απενεργοποιήσετε τον λογαριασμό σας.</li>
                            <li>Αλλάξετε γλώσσα (English/Greek).</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default InstructionEl;