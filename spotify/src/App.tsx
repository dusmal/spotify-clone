import React, { useEffect } from 'react';
import Login from './components/Login/Login';
import AuthRedirect from './components/Auth/AuthRedirect';
import Dashboard from './components/Dashboard/Dashboard';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  function checkLogin() {
    const loggedinUser = localStorage.getItem('access_token');
    if (loggedinUser) {
      navigate('/dashboard/browseCategories');
    }
    else{
      navigate('/')
    }
  }
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth" element={<AuthRedirect />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
