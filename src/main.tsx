import { initSentry } from './sentry.config';

// Initialize error tracking BEFORE any other code runs
// so we can capture errors from React initialization itself
initSentry();

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "@/context/AuthProvider.tsx";
import ErrorBoundary from "@/components/ErrorBoundary.tsx";
import '@/services/i18n.ts';
import { NotificationProvider } from "@/context/NotificationContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <NotificationProvider>
                        <App />
                    </NotificationProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>
)
