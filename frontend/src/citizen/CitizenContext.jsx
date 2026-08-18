import React, { createContext, useContext, useState, useEffect } from 'react';

const CitizenContext = createContext();
export const useCitizen = () => useContext(CitizenContext);

export const CitizenProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [cityGrievances, setCityGrievances] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8000';

  const fetchGrievances = async () => {
    try {
      const res = await fetch(`${API_URL}/grievances/`);
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (err) {
      console.error("Failed to fetch grievances", err);
    }
  };

  const fetchCityGrievances = async (city) => {
    try {
      const res = await fetch(`${API_URL}/grievances/city/${city}`);
      if (res.ok) {
        const data = await res.json();
        setCityGrievances(data);
      }
    } catch (err) {
      console.error("Failed to fetch city grievances", err);
    }
  };

  useEffect(() => {
    fetchGrievances();
    
    // Check local storage for existing session
    const storedUser = localStorage.getItem('civicpulse_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      fetchCityGrievances(user.city);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        localStorage.setItem('civicpulse_user', JSON.stringify(data));
        fetchCityGrievances(data.city);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, city) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, city })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        localStorage.setItem('civicpulse_user', JSON.stringify(data));
        fetchCityGrievances(data.city);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return false;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/update/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        localStorage.setItem('civicpulse_user', JSON.stringify(data));
        if (updates.city) fetchCityGrievances(data.city);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCityGrievances([]);
    localStorage.removeItem('civicpulse_user');
  };

  const addGrievance = async (newGrievance) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/grievances/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGrievance)
      });
      if (res.ok) {
        fetchGrievances();
        fetchCityGrievances(currentUser.city);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const verifyGrievance = async (id, isFixed) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/grievances/${id}/verify?is_fixed=${isFixed}&author_id=${currentUser.id}`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchGrievances();
        fetchCityGrievances(currentUser.city);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CitizenContext.Provider value={{ 
      currentUser, grievances, cityGrievances, loading, 
      login, register, logout, updateProfile, 
      addGrievance, verifyGrievance 
    }}>
      {children}
    </CitizenContext.Provider>
  );
};
