import { useTranslation } from 'react-i18next';
import {APPLICATION_EMAIL, PRIVACY_POLICY_LAST_UPDATED} from "@/utils/constants.ts";


const PrivacyEl = () => {
    useTranslation();
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Πολιτική Απορρήτου</h1>
                    <p className="text-sm text-slate-400 mt-1">Τελευταία ενημέρωση: {PRIVACY_POLICY_LAST_UPDATED.el}</p>
                    <p className="text-sm text-slate-500 mt-1">Υπεύθυνος Επεξεργασίας: Γ.Κ., Αθήνα, Ελλάδα</p>
                </div>

                <div className="flex flex-col gap-8">

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">1. Δεδομένα που Συλλέγουμε</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Κατά τη χρήση του Roomies, συλλέγουμε τα ακόλουθα προσωπικά δεδομένα:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Διεύθυνση email και όνομα χρήστη (μέσω εγγραφής Keycloak)</li>
                            <li>Όνομα, επώνυμο, φύλο (προφίλ συγκατοίκου)</li>
                            <li>Αριθμός τηλεφώνου (προφίλ χρήστη)</li>
                            <li>Δεδομένα χρήσης: έξοδα, εργασίες, μηνύματα, αξιολογήσεις, προσκλήσεις</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">2. Νομική Βάση (ΓΚΠΔ Άρθρο 6)</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Επεξεργαζόμαστε τα δεδομένα σας βάσει:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li><strong>Εκτέλεση σύμβασης</strong> - για την παροχή της υπηρεσίας Roomies</li>
                            <li><strong>Έννομο συμφέρον</strong> - για τη διατήρηση ασφάλειας και πρόληψη κατάχρησης</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">3. Πώς Χρησιμοποιούμε τα Δεδομένα σας</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Τα δεδομένα σας χρησιμοποιούνται αποκλειστικά για την παροχή της υπηρεσίας Roomies. Δεν πωλούμε, μοιραζόμαστε ή χρησιμοποιούμε τα δεδομένα σας για διαφημιστικούς ή σκοπούς κατάρτισης προφίλ.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">4. Διατήρηση Δεδομένων</h2>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Ενεργοί λογαριασμοί: τα δεδομένα διατηρούνται για όσο διάστημα χρησιμοποιείτε την εφαρμογή</li>
                            <li>Ανενεργοί λογαριασμοί: προσωρινή διαγραφή μετά την απενεργοποίηση, οριστική διαγραφή μετά από 5 χρόνια (αυτοματοποιημένη)</li>
                            <li>Μπορείτε να ζητήσετε διαγραφή ανά πάσα στιγμή μέσω της εφαρμογής</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">5. Τα Δικαιώματά σας (ΓΚΠΔ)</h2>
                        <p className="text-sm text-slate-600 mb-2">Έχετε δικαίωμα:</p>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Πρόσβασης στα προσωπικά σας δεδομένα</li>
                            <li>Διόρθωσης ανακριβών δεδομένων</li>
                            <li>Διαγραφής ("δικαίωμα στη λήθη")</li>
                            <li>Φορητότητας δεδομένων</li>
                        </ul>
                        <p className="text-sm text-slate-600 mt-2">
                            Για άσκηση των δικαιωμάτων σας, επικοινωνήστε: <span className="text-indigo-600">{APPLICATION_EMAIL}</span>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">6. Ασφάλεια</h2>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Αυθεντικοποίηση μέσω Keycloak. Οι κωδικοί δεν αποθηκεύονται ποτέ από την εφαρμογή</li>
                            <li>Τα tokens αποθηκεύονται ως httpOnly, SameSite=Strict cookies</li>
                            <li>Το περιεχόμενο μηνυμάτων κρυπτογραφείται κατά την αποθήκευση (AES/GCM)</li>
                            <li>Περιορισμός ρυθμού αιτημάτων (50 αιτήματα/λεπτό ανά IP)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">7. Τρίτα Μέρη (Εκτελούντες την Επεξεργασία)</h2>
                        <ul className="flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li><strong>Keycloak</strong> - διαχείριση ταυτότητας και πρόσβασης</li>
                            <li><strong>Railway</strong> - φιλοξενία backend και βάσης δεδομένων (περιοχή EU West, Άμστερνταμ)</li>
                            <li><strong>Azure Static Web Apps</strong> - φιλοξενία frontend</li>
                            <li><strong>Azure Application Insights</strong> - τηλεμετρία απόδοσης και σφαλμάτων (ανώνυμη, χωρίς cookies)</li>
                            <li><strong>Sentry (Functional Software Inc.)</strong> - παρακολούθηση σφαλμάτων εφαρμογής (χωρίς προσωπικά δεδομένα, χωρίς cookies). Τα δεδομένα φιλοξενούνται στην ΕΕ (Φρανκφούρτη). Νομική βάση: έννομο συμφέρον (ΓΚΠΔ Άρθρο 6(1)(στ)) για βελτίωση αξιοπιστίας υπηρεσίας.</li>
                        </ul>
                        <p className="text-sm text-slate-600 mt-2">
                            Όλα τα δεδομένα σας αποθηκεύονται και επεξεργάζονται εντός της Ευρωπαϊκής Ένωσης.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">8. Cookies</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Χρησιμοποιούμε αποκλειστικά απαραίτητα cookies:
                        </p>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-600 list-disc list-inside">
                            <li>Cookies Αυθεντικοποίησης (httpOnly) για τη διατήρηση της σύνδεσής σας</li>
                        </ul>
                        <p className="text-sm text-slate-600 mt-2">
                            Δεν χρησιμοποιούμε cookies analytics, διαφήμισης ή παρακολούθησης. Η τηλεμετρία απόδοσης λειτουργεί χωρίς cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-700 mb-2">9. Επικοινωνία</h2>
                        <p className="text-sm text-slate-600">
                            Για οποιαδήποτε ερώτηση σχετική με το απόρρητο ή αίτημα δεδομένων: <span className="text-indigo-600">{APPLICATION_EMAIL}</span>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyEl;