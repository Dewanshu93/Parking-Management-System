import React, { useState, useEffect } from 'react';
import "./ManagerManagement.css";
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManagerManagement() {
  const [managers, setManagers] = useState([]);
  const [cityLocations, setCityLocations] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    city: '',
    parkingStationName: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [availableStations, setAvailableStations] = useState([]);

  // Fetch data from db.json
  useEffect(() => {
    fetch('http://localhost:3000/managers')
      .then((res) => res.json())
      .then((data) => setManagers(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error loading managers"));

    fetch('http://localhost:3000/cityLocations')
      .then((res) => res.json())
      .then((data) => setCityLocations(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error loading city locations"));
  }, []);

  useEffect(() => {
    if (formData.city) {
      const cityObj = cityLocations.find(loc => loc.city === formData.city);
      if (cityObj) {
        setAvailableStations(cityObj.parkingStations.map(ps => ps.name));
      } else {
        setAvailableStations([]);
      }
    } else {
      setAvailableStations([]);
    }
  }, [formData.city, cityLocations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "city" ? { parkingStationName: "" } : {})
    }));
  };

  const isUsernameUnique = (username) => {
    return !managers.some((mgr) => mgr.username === username && mgr.id !== editingId);
  };

  const addManager = () => {
    const { username, password, city, parkingStationName } = formData;

    if (!username || !password || !city || !parkingStationName) {
      toast.error("All fields are required");
      return;
    }

    if (!isUsernameUnique(username)) {
      toast.error("Username already exists!");
      return;
    }

    const newManager = {
      id: Date.now().toString(),
      ...formData,
      isLoggedIn: false,
    };

    fetch('http://localhost:3000/managers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newManager),
    })
      .then(() => {
        setManagers([...managers, newManager]);
        setFormData({ username: '', password: '', city: '', parkingStationName: '' });
        toast.success("Manager added successfully!");
      })
      .catch(() => toast.error("Error adding manager"));
  };

  const editManager = (id) => {
    const managerToEdit = managers.find(manager => manager.id === id);
    if (managerToEdit) {
      setFormData({
        username: managerToEdit.username,
        password: '',
        city: managerToEdit.city,
        parkingStationName: managerToEdit.parkingStationName,
      });
      setEditingId(id);
    }
  };

  const saveEditedManager = () => {
    const { username, password, city, parkingStationName } = formData;

    if (!username || !city || !parkingStationName) {
      toast.error("All fields are required");
      return;
    }

    if (!isUsernameUnique(username)) {
      toast.error("Username already exists!");
      return;
    }

    const updatedManager = {
      id: editingId,
      username,
      password,
      city,
      parkingStationName,
    };

    fetch(`http://localhost:3000/managers/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedManager),
    })
      .then(() => {
        setManagers(managers.map((mgr) => mgr.id === editingId ? updatedManager : mgr));
        setEditingId(null);
        setFormData({ username: '', password: '', city: '', parkingStationName: '' });
        toast.success("Manager updated!");
      })
      .catch(() => toast.error("Error updating manager"));
  };

  const removeManager = (id) => {
    fetch(`http://localhost:3000/managers/${id}`, { method: 'DELETE' })
      .then(() => {
        setManagers(managers.filter(manager => manager.id !== id));
        toast.success("Manager removed");
      })
      .catch(() => toast.error("Error removing manager"));
  };

  const cities = cityLocations.map(loc => loc.city);

  return (
    <div className='managerManagement'>
      <AdminNavbar />
      <ToastContainer />
      <div className='managerManagementContainer'>
        <h1 className='managerManagementHead'>Manager Management</h1>

        <div className='managerManagementInputContainer'>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className='managerManagementInput'
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className='managerManagementInput'
          />
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className='managerManagementInput'
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          <select
            name="parkingStationName"
            value={formData.parkingStationName}
            onChange={handleInputChange}
            className='managerManagementInput'
            disabled={!formData.city}
          >
            <option value="">Select Parking Station</option>
            {availableStations.map((station, index) => (
              <option key={index} value={station}>{station}</option>
            ))}
          </select>

          {editingId ? (
            <button onClick={saveEditedManager}>Save Changes</button>
          ) : (
            <button onClick={addManager}>Add Manager</button>
          )}
        </div>

        <table border="1" className='managerManagementTable'>
          <thead>
            <tr>
              <th className='managerManagementRow'>Username</th>
              <th className='managerManagementRow'>City</th>
              <th className='managerManagementRow'>Parking Station</th>
              <th className='managerManagementRow'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id}>
                <td className='managerManagementRow'>{manager.username}</td>
                <td className='managerManagementRow'>{manager.city}</td>
                <td className='managerManagementRow'>{manager.parkingStationName}</td>
                <td className='managerManagementRowButtonContainer'>
                  <button onClick={() => editManager(manager.id)}>Edit</button>
                  <button onClick={() => removeManager(manager.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerManagement;
