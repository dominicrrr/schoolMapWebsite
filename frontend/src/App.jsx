import React from 'react';
import { Routes, Route } from "react-router-dom";
import MapComponent from './components/leaflet-map/map-component';
import NavBar from './components/nav/nav-bar';
import AppLayout from './components/layouts/app-layout/app-layout';
import About from "./pages/about/about"
import MapApp from "./pages/app/map-app"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={ <MapApp />} />
        <Route path="/about" element={ <About /> } />
      </Routes>
    </>
  );
}

export default App;
