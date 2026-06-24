const AboutEn = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto flex flex-col gap-10">

                {/* App */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">About Roomies</h1>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Roomies is a full-stack co-living management platform designed to simplify shared living.
                        From splitting expenses and managing tasks to real-time messaging and house invitations.
                        Εverything a shared household needs, in one place.
                    </p>
                </div>

                {/* Features */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-3">What you can do</h2>
                    <ul className="flex flex-col gap-2 text-sm text-slate-600 list-disc list-inside">
                        <li>Create or join a house and manage your roommates</li>
                        <li>Track shared expenses with automatic split calculation</li>
                        <li>Assign and manage household tasks</li>
                        <li>Send group or private messages in real time</li>
                        <li>Rate roommates across multiple categories</li>
                        <li>Send and receive house invitations</li>
                    </ul>
                </div>

                {/* Tech */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-3">Built with</h2>
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
                        Built by Giorgos Kounelis, a full-stack developer based in Athens, Greece.
                        ISC2 CC · AZ-900 · Coding Factory AUEB.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://github.com/grgks" target="_blank" rel="noopener noreferrer"
                           className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium">
                            GitHub →
                        </a>
                        <a href="https://www.linkedin.com/in/giorgos-k-882332360/" target="_blank" rel="noopener noreferrer"
                           className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium">
                            LinkedIn →
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutEn;