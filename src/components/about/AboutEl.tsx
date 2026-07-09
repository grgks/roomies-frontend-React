const AboutEl = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto flex flex-col gap-10">

                {/* App */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Σχετικά με το Roommies</h1>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Το Roomies είναι μια full-stack πλατφόρμα διαχείρισης συγκατοίκησης, σχεδιασμένη για να απλοποιεί τη ζωή σε κοινόχρηστο χώρο.
                        Από τη διαχείριση εξόδων και εργασιών μέχρι την επικοινωνία σε πραγματικό χρόνο και τις προσκλήσεις σπιτιού.
                        Όλα όσα χρειάζεται ένα κοινόχρηστο νοικοκυριό, σε ένα μέρος.
                    </p>
                </div>

                {/* Features */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-3">Τι μπορείς να κάνεις</h2>
                    <ul className="flex flex-col gap-2 text-sm text-slate-600 list-disc list-inside">
                        <li>Δημιούργησε ή εντάξου σε σπίτι και διαχειρίσου τους συγκατοίκους σου</li>
                        <li>Παρακολούθηση κοινών εξόδων με αυτόματο υπολογισμό μερίδιου</li>
                        <li>Ανάθεση και διαχείριση οικιακών εργασιών</li>
                        <li>Αποστολή ομαδικών ή ιδιωτικών μηνυμάτων σε πραγματικό χρόνο</li>
                        <li>Αξιολόγηση συγκατοίκων σε πολλαπλές κατηγορίες</li>
                        <li>Αποστολή και λήψη προσκλήσεων σπιτιού</li>
                    </ul>
                </div>

                {/* Tech */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-3">Τεχνολογίες</h2>
                    <div className="flex flex-wrap gap-2">
                        {['Spring Boot 4', 'Java 21', 'React 19', 'TypeScript', 'Keycloak',
                            'MySQL', 'WebSocket/STOMP', 'Tailwind CSS', 'Docker', 'Railway', 'Azure'].map(tech => (
                            <span key={tech} className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Developer */}
                <div className="border-t pt-8">
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Developer</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        Αναπτύχθηκε από τον Γιώργο Κουνέλη, full-stack developer με έδρα την Αθήνα.
                        ISC2 CC · AZ-900 · Coding Factory AUEB.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://github.com/grgks" target="_blank" rel="noopener noreferrer"
                           className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium" aria-label="GitHub">
                            GitHub →
                        </a>
                        <a href="https://www.linkedin.com/in/giorgos-k-882332360/" target="_blank" rel="noopener noreferrer"
                           className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium" aria-label="LinkedIn">
                            LinkedIn →
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutEl;