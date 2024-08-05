import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import ActivitiesView from './views/ActivitiesView';
import ActivityDetailView from './views/ActivityDetailView';
import CreateActivityView from './views/CreateActivityView';
import UserActivitiesView from './views/UserActivitiesView';
import ProfileView from './views/ProfileView';
import NavigationBar from './components/NavigationBar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-claude-bg">
          <NavigationBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ActivitiesView />} />
              <Route path="/activity/:id" element={<ActivityDetailView />} />
              <Route path="/create" element={<CreateActivityView />} />
              <Route path="/my-activities" element={<UserActivitiesView />} />
              <Route path="/profile" element={<ProfileView />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;