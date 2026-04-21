import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Pages
// import Dashboard from '../pages/Dashboard';

//  placeholder
const Placeholder = ({ name }: { name: string }) => <div>{name}</div>;

const AppRouter = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={!isAuthenticated ? <Placeholder name="Login" /> : <Navigate to="/dashboard" />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={isAuthenticated ? <Placeholder name="Dashboard" /> : <Navigate to="/login" />} />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;