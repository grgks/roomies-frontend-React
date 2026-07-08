import { useEffect } from 'react';

const usePageTitle = (title: string) => {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = `Roommies - ${title}`;
        return () => {
            document.title = previousTitle;
        };
    }, [title]);
};

export default usePageTitle;