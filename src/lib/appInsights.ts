import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;

let appInsights: ApplicationInsights | undefined;

if (connectionString) {
    appInsights = new ApplicationInsights({
        config: {
            connectionString,
            enableAutoRouteTracking: true,   // tracking React Router navigation
            disableFetchTracking: false,     // records API calls το backend
            enableAjaxErrorStatusText: true, // logs HTTP error status
            disablePageUnloadEvents: ["unload"], // avoid deprecated unload listener, use pagehide/visibilitychange instead
        },
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView();
}

export { appInsights };