import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import DriverMap from './components/DriverMap'
import UnassignedJourneys from './components/UnassignedJourneys';
import VehiclesPage from './components/VehiclesPage';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<DriverMap />} />
      <Route path="/driver-map" element={<DriverMap />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/unassigned-journeys" element={<UnassignedJourneys />} />
    </Routes>
  </Router>
  )
}

export default App
