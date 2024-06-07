import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import BrewerySearch from './components/BrewerySearch';
import BreweryPage from './components/BreweryPage';
import AddReviewForm from './components/AddReviewForm';
import BreweryDetails from './components/BreweryDetails'; // Import the BreweryDetails component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<BrewerySearch />} />
        <Route path="/brewery/:id" element={<BreweryPage />} />
        <Route path="/brewery/:id/review" element={<AddReviewForm />} />
        <Route path="/brewery/:id/details" element={<BreweryDetails />} /> {/* Include the route for BreweryDetails */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;


