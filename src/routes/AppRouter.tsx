import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from "@/hooks/useAuth.ts";
import LoadSpinner from "@/components/LoadSpinner.tsx";
import useScrollToTop from "@/hooks/useScrollToTop.ts";

// Eager: login is the entry point for unauthenticated users
import LoginPage from "@/pages/LoginPage.tsx";

// Lazy: everything else loads on demand
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ExpensesPage = lazy(() => import('@/pages/ExpensesPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const CreateHousePage = lazy(() => import('@/pages/CreateHousePage'));
const HouseViewPage = lazy(() => import('@/pages/HouseViewPage'));
const SearchHousesPage = lazy(() => import('@/pages/SearchHousesPage'));
const InvitationPage = lazy(() => import('@/pages/InvitationPage'));
const SearchRoommatesPage = lazy(() => import('@/pages/SearchRoommatesPage'));
const RoommateListPage = lazy(() => import('@/pages/RoommateListPage'));
const MessageListPage = lazy(() => import('@/pages/MessageListPage'));
const MessageViewPage = lazy(() => import('@/pages/MessageViewPage'));
const RatingPage = lazy(() => import('@/pages/RatingPage'));
const TaskPage = lazy(() => import('@/pages/TaskPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const InstructionPage = lazy(() => import('@/pages/InstructionPage'));
const AdminUsersPage = lazy(() => import('@/pages/AdminUsersPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const AdminRoommatesWithoutHousePage = lazy(() => import('@/pages/AdminRoommatesWithoutHousePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));


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
        <Suspense fallback={<LoadSpinner />}>
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

            <Route path="/instructions" element={
                <InstructionPage />} />

            <Route path="/terms" element={
                <TermsPage />} />

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


            {/* Root redirect */}
            <Route path="*" element={
                !isAuthenticated ? <Navigate to="/login" /> :
                    hasRoommate === false ? <Navigate to="/complete-profile" /> :
                        <Navigate to="/dashboard" />
            } />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
    );
};

export default AppRouter;