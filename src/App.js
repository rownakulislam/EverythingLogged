import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import UploadFileComponent from './uploadFile';
import ViewComponent from './View';
import ViewLogComponent from './view_log';
import GrantAccessComponent from './grant_access';
import RevokeAccessComponent from './revoke_access';
import ViewReqComponent from './accept_req';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
      <header className="App-header">
      <h1>EverythingLogged</h1>
      </header>
        <Routes>
          <Route path="/" element={<UploadFileComponent />} />
          <Route path="/view" element={<ViewComponent />} />
          <Route path="/view_log" element={<ViewLogComponent />} />
          <Route path="/grant_access" element={<GrantAccessComponent />} />
          <Route path="/revoke_access" element={<RevokeAccessComponent />} />
          <Route path="/view_reqs" element={<ViewReqComponent />} />
        </Routes>
        <Appfooter/>
      </div>
    </Router>
  );
}

function Appfooter() {
  const location = useLocation();
  const [home, setHome] = useState(false);

  useEffect(() => {
    setHome(location.pathname === '/');
  }, [location]);

  return home && (
    <div className='link_to_view'>
      <div className='b_page'>{<Link to="/view">Permitted files</Link>}</div>
      <div className='b_page'>{<Link to="/view_log">Go to View Logs</Link>}</div>
      <div className='b_page'>{<Link to="/grant_access">Grant Access</Link>}</div>
      <div className='b_page'>{<Link to="/revoke_access">Revoke Access</Link>}</div>
      <div className='b_page'>{<Link to="/view_reqs">View Requests</Link>}</div>
    </div>
  );
}

export default App;