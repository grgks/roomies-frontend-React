import { Component, type ReactNode } from 'react';
import {withTranslation, type WithTranslation} from "react-i18next";

interface Props extends WithTranslation{
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render() {

        const {t} = this.props;

        if (this.state.hasError) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-100">
                    <h1 className="text-4xl font-bold text-slate-700">Oops!</h1>
                    <p className="text-slate-500">{t('somethingWentWrong')}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        {t('reload')}
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default withTranslation()(ErrorBoundary);