import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActivitiesView from './components/ActivitiesView';
import ActivityDetailView from './components/ActivityDetailView';
import CreateActivityView from './components/CreateActivityView';
import NavigationBar from './components/NavigationBar';
import Toast from './components/Toast';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-claude-bg">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<ActivitiesView />} />
          <Route path="/activity/:id" element={<ActivityDetailView />} />
          <Route path="/create" element={<CreateActivityView />} />
        </Routes>
        {/* Toast component can be added here if needed */}
      </div>
    </Router>
  );
};

export default App;