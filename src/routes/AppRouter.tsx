import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import ExpensesPage from "@/pages/ExpensesPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import useAuth from "@/hooks/useAuth.ts";
import LoadSpinner from "@/components/LoadSpinner.tsx";
import ProfilePage from "@/pages/ProfilePage.tsx";
import CreateHousePage from "@/pages/CreateHousePage.tsx";
import HouseViewPage from "@/pages/HouseViewPage.tsx";
import SearchHousesPage from "@/pages/SearchHousesPage.tsx";
import InvitationPage from "@/pages/InvitationPage.tsx";
import SearchRoommatesPage from "@/pages/SearchRoommatesPage.tsx";
import RoommateListPage from "@/pages/RoommateListPage.tsx";
import MessageListPage from "@/pages/MessageListPage.tsx";
import MessageViewPage from "@/pages/MessageViewPage.tsx";
import RatingPage from "@/pages/RatingPage.tsx";
import useScrollToTop from "@/hooks/useScrollToTop.ts";
import TaskPage from "@/pages/TaskPage.tsx";
import PrivacyPage from "@/pages/PrivacyPage.tsx";
import AboutPage from "@/pages/AboutPage.tsx";
import ContactPage from "@/pages/ContactPage.tsx";
import AdminUsersPage from "@/pages/AdminUsersPage.tsx";
import AdminDashboardPage from "@/pages/AdminDashboardPage.tsx";
import AdminRoommatesWithoutHousePage from "@/pages/AdminRoommatesWithoutHousePage.tsx";
import NotFoundPage from "@/pages/NotFoundPage.tsx";


// if authenticated -> show component
// if not -> go to /login , /NotFoundPage
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, hasRoommate } = useAuth();
    if (isLoading) return <LoadSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (hasRoommate === false) return <Navigate to="/complete-profile" />;
    return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    if (isLoading) return <LoadSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (!isAdmin) return <Navigate to="/dashboard" />;
    return <>{children}</>;
};

const AppRouter = () => {
    useScrollToTop();
    const { isAuthenticated, isLoading, hasRoommate} = useAuth();


    if (isLoading) return <LoadSpinner />;

    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
            } />
            <Route path="/complete-profile" element={<ProfilePage />} />

            {/* Protected */}
            <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/expenses" element={
                <ProtectedRoute><ExpensesPage /></ProtectedRoute>
            } />
            <Route path="/house/create" element={
            <ProtectedRoute><CreateHousePage /></ProtectedRoute>} />

            <Route path="/house" element={
                <ProtectedRoute><HouseViewPage /></ProtectedRoute>} />

            <Route path="/houses/search" element={
                <ProtectedRoute><SearchHousesPage /></ProtectedRoute>} />

            <Route path="/invitations" element={
            <ProtectedRoute><InvitationPage /></ProtectedRoute>} />

            <Route path="/roommates/search" element={
                <ProtectedRoute><SearchRoommatesPage /></ProtectedRoute>
            } />
            <Route path="/roommates" element={
                <ProtectedRoute><RoommateListPage /></ProtectedRoute>
            } />

            <Route path="/messages" element={
                <ProtectedRoute><MessageListPage /></ProtectedRoute>} />

            <Route path="/messages/house/:houseId" element={
                <ProtectedRoute><MessageViewPage /></ProtectedRoute>} />

            <Route path="/messages/private/:roommateId" element={
                <ProtectedRoute><MessageViewPage /></ProtectedRoute>} />

            <Route path="/ratings" element={
                <ProtectedRoute><RatingPage /></ProtectedRoute>} />

            <Route path="/tasks" element={
                <ProtectedRoute><TaskPage /></ProtectedRoute>} />

            <Route path="/privacy" element={
                <PrivacyPage />} />

            <Route path="/about" element={
                <AboutPage />} />

            <Route path="/contact" element={
                <ContactPage />} />

            <Route path="/admin" element={
                <AdminRoute><AdminDashboardPage /></AdminRoute>
            } />
            <Route path="/admin/users" element={
                <AdminRoute><AdminUsersPage /></AdminRoute>
            } />

            <Route path="/admin/roommates-without-house" element={
                <AdminRoute><AdminRoommatesWithoutHousePage /></AdminRoute>
            } />

            <Route path="*" element={
                isAuthenticated && hasRoommate === false
                    ? <Navigate to="/complete-profile" />
                    : <NotFoundPage />
            } />
        </Routes>
    );
};

export default AppRouter;