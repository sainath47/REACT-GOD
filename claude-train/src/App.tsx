  import React from 'react';
  import {Routes, Route} from 'react-router'
  import AllCoveredWithTypescript from './pages/last'
  import BasicWithJS from './pages/basic-with-js'
  import MoreAdvanced from './pages/moreAdvanced'
  // State - Making Components Interactive
  const CounterBasic: React.FC = () => {

    
    return (
      <div className="">
       <Routes>
      <Route path="/2" element={<AllCoveredWithTypescript/>} />
      <Route path="/3" element={<MoreAdvanced/>} />
      <Route path="/1" element={<BasicWithJS/>} />
    </Routes>
      </div>
    );
  };

  export default CounterBasic