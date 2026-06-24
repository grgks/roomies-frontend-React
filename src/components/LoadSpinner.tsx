const LoadingSpinner = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-900">
            <div className="w-12 h-12 border-4 border-white/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );
};

export default LoadingSpinner;