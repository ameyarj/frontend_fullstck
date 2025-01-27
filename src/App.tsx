import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Influencers from './pages/Influencers';
import Claims from './pages/Claims';
import Analytics from './pages/Analytics';
import InfluencerDetail from './pages/InfluencerDetail';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/influencers" element={<Influencers />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/influencers/:influencerId" element={<InfluencerDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}
