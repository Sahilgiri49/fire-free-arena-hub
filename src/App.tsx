import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";
import Schedule from "./pages/Schedule";
import Streams from "./pages/Streams";
import News from "./pages/News";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTournaments from "./pages/admin/AdminTournaments";
import AdminLeaderboard from "./pages/admin/AdminLeaderboard";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminNews from "./pages/admin/AdminNews";
import AdminStreams from "./pages/admin/AdminStreams";

// Create a new QueryClient instance outside the component
const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDetails />} />
            <Route path="/teams/create" element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            } />
            <Route path="/teams/join" element={
              <ProtectedRoute>
                <JoinTeam />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/streams" element={<Streams />} />
            <Route path="/news" element={<News />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/tournaments" element={
              <ProtectedRoute adminOnly={true}>
                <AdminTournaments />
              </ProtectedRoute>
            } />
            <Route path="/admin/teams" element={
              <ProtectedRoute adminOnly={true}>
                <AdminTeams />
              </ProtectedRoute>
            } />
            <Route path="/admin/schedule" element={
              <ProtectedRoute adminOnly={true}>
                <AdminSchedule />
              </ProtectedRoute>
            } />
            <Route path="/admin/leaderboard" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLeaderboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedRoute adminOnly={true}>
                <AdminNews />
              </ProtectedRoute>
            } />
            <Route path="/admin/streams" element={
              <ProtectedRoute adminOnly={true}>
                <AdminStreams />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
