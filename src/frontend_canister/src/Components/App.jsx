import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Auth/Login';
import Navbar from './layouts/Navbar';
import Error404 from './utils/Error404';
// import ClaimSeat from './Claim/ClaimSeat';
// import Home from './Claim/ClaimSeat';
// import AddEvent from './EventsComponent/AddEvent';
// import QrCodeComponent from './Client/QrCodeComponent';
// import Events from './EventsComponent/Events';
// import AdminLogin from './Auth/AdminLogin';
// import SingleEvent from './EventsComponent/SingleEvent';

const App = () => {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/*" element={<Error404 />} />
        <Route path="/" element={<Login />} />
        {/* <Route path="/home" element={<Home />} />
        <Route path="/addevent" element={<AddEvent />} />
        <Route path="/claimseat" element={<ClaimSeat />} />
        <Route path="/dashboard" element={<Events />} />
        <Route path="/qrsession" element={<QrCodeComponent />} />
        <Route path="/viewevent" element={<SingleEvent />} /> */}
      </Routes>
    </>
  );
};


export default App;
