import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your StateBasics component
import StateBasics from './components/StateBasics';
import MonstersRoledex from './components/MonstersRoledex';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Other routes */}
          <Route path="/state-basics" element={<StateBasics />} />
          <Route path="/monster-rolodex" element={<MonstersRoledex />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
