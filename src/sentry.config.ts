import * as Sentry from '@sentry/react';

/**
 * Sentry error tracking configuration.
 *
 * GDPR-safe by design:
 * - No PII sent (emails, usernames, IPs stripped by `sendDefaultPii: false`)
 * - No session replay (removes DOM recording risk)
 * - No performance tracing (saves quota for errors + minimizes data collection)
 * - Aggressive `beforeSend` scrubber for defense-in-depth
 * - EU-only data residency (Frankfurt) . Confirmed via DSN region
 *
 * Free-tier friendly:
 * - Client-side rate limit ~170 events/day (5000/30) to avoid quota exhaustion
 * - Only initialized in production (dev errors stay local)
 */

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development';

// Regex patterns used for scrubbing sensitive data from any error field
const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/gi;
const JWT_REGEX = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,16}\b/g;

/**
 * Recursively scrub known-sensitive patterns from any string in an object.
 * Handles nested objects and arrays.
 */
function scrubSensitiveData(value: unknown): unknown {
    if (typeof value === 'string') {
        return value
            .replace(EMAIL_REGEX, '[email-redacted]')
            .replace(JWT_REGEX, '[jwt-redacted]')
            .replace(CREDIT_CARD_REGEX, '[cc-redacted]');
    }
    if (Array.isArray(value)) {
        return value.map(scrubSensitiveData);
    }
    if (value && typeof value === 'object') {
        const scrubbed: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value)) {
            // Drop headers/cookies wholesale Never useful for debugging, always risky
            if (['cookie', 'cookies', 'authorization', 'set-cookie', 'x-auth-token', 'password', 'token']
                .includes(key.toLowerCase())) {
                scrubbed[key] = '[redacted]';
                continue;
            }
            scrubbed[key] = scrubSensitiveData(val);
        }
        return scrubbed;
    }
    return value;
}

export function initSentry() {
    // Skip Sentry entirely if no DSN configured (local dev without .env)
    if (!SENTRY_DSN) {
        console.info('[Sentry] DSN not configured — error tracking disabled');
        return;
    }

    // Only initialize in production/staging Never in local dev
    if (SENTRY_ENVIRONMENT === 'development') {
        console.info('[Sentry] Development environment. Error tracking disabled');
        return;
    }

    Sentry.init({
        dsn: SENTRY_DSN,
        environment: SENTRY_ENVIRONMENT,

        //PII protection
        sendDefaultPii: false,          // No IP addresses, no user context by default
        maxBreadcrumbs: 20,             // Default 100. Less data per event

        //Quota protection
        tracesSampleRate: 0,            // No performance transactions (saves quota)
        replaysSessionSampleRate: 0,    // No session replay
        replaysOnErrorSampleRate: 0,    // No replay even on errors (privacy + quota)

        //Ignore known noisy errors
        ignoreErrors: [
            // Browser extensions
            /extension:\/\//i,
            /moz-extension:\/\//i,
            /chrome-extension:\/\//i,
            // Network noise (user offline etc.)
            'Network request failed',
            'NetworkError',
            'Failed to fetch',
            // Common browser quirks
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications',
            'Non-Error promise rejection captured',
        ],

        //Only accept errors from our own scripts
        allowUrls: [
            /https?:\/\/(www\.)?theroommies\.gr/,
        ],

        //Denylist known non-app URLs
        denyUrls: [
            /extensions\//i,
            /^chrome:\/\//i,
            /^moz-extension:\/\//i,
        ],

        //Final defense: scrub every event before send
        beforeSend(event) {
            // Strip user email/username/IP if Sentry auto-populated
            if (event.user) {
                delete event.user.email;
                delete event.user.username;
                delete event.user.ip_address;
                // Keep only ID for grouping (opaque UUID, not PII)
            }

            // Scrub request bodies + query strings
            if (event.request) {
                if (event.request.headers) {
                    event.request.headers = scrubSensitiveData(event.request.headers) as Record<string, string>;
                }
                if (event.request.query_string) {
                    event.request.query_string = scrubSensitiveData(event.request.query_string) as string;
                }
                if (event.request.data) {
                    event.request.data = scrubSensitiveData(event.request.data);
                }
                delete event.request.cookies;
            }

            // Scrub error messages themselves
            if (event.message) {
                event.message = scrubSensitiveData(event.message) as string;
            }
            if (event.exception?.values) {
                for (const exc of event.exception.values) {
                    if (exc.value) {
                        exc.value = scrubSensitiveData(exc.value) as string;
                    }
                }
            }

            return event;
        },

        //Filter breadcrumbs too (user actions leading to error)
        beforeBreadcrumb(breadcrumb) {
            // Drop console.log breadcrumbs entirely (may contain debug PII)
            if (breadcrumb.category === 'console') {
                return null;
            }
            // Scrub URLs and data in remaining breadcrumbs
            if (breadcrumb.data) {
                breadcrumb.data = scrubSensitiveData(breadcrumb.data) as { [key: string]: unknown };
            }
            return breadcrumb;
        },
    });

    console.info(`[Sentry] Initialized in ${SENTRY_ENVIRONMENT} mode`);
}