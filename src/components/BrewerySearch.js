import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import "../Styles/search.css";
import AuthDetails from './Authdetails';

function BrewerySearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('city');
  const navigate = useNavigate();

  const searchBreweries = useCallback(async () => {
    try {
      let endpoint = '';

      if (searchType === 'city') {
        endpoint = `https://api.openbrewerydb.org/v1/breweries?by_city=${searchQuery}&per_page=10`;
      } else if (searchType === 'name') {
        endpoint = `https://api.openbrewerydb.org/v1/breweries?by_name=${searchQuery}&per_page=10`;
      } else if (searchType === 'type') {
        endpoint = `https://api.openbrewerydb.org/v1/breweries?by_type=${searchQuery}&per_page=10`;
      }

      const response = await axios.get(endpoint);
      const breweriesWithReviews = await addReviewInformation(response.data); // Fetch review information
      setSearchResults(breweriesWithReviews);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [searchQuery, searchType]);

  const addReviewInformation = async (breweries) => {
    try {
      const breweriesWithReviews = await Promise.all(
        breweries.map(async (brewery) => {
          const reviewsCollectionRef = collection(db, `breweries/${brewery.id}/reviews`);
          const reviewsSnapshot = await getDocs(reviewsCollectionRef);
          let totalRating = 0;
          let reviewCount = 0;

          reviewsSnapshot.forEach((doc) => {
            const reviewData = doc.data();
            totalRating += reviewData.rating;
            reviewCount++;
          });

          const avgRating = reviewCount > 0 ? totalRating / reviewCount : 0;

          return {
            ...brewery,
            averageRating: avgRating,
            numReviews: reviewCount,
          };
        })
      );

      return breweriesWithReviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return breweries; // Return original breweries array if an error occurs
    }
  };

  const handleAddReview = (breweryId) => {
    navigate(`/brewery/${breweryId}/review`);
  };

  useEffect(() => {
    searchBreweries();
  }, [searchBreweries]); // Add searchBreweries to the dependency array

  return (
    <div className="brewery-search-container">
      <h2>Brewery Search</h2>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="city">Search by City</option>
        <option value="name">Search by Name</option>
        <option value="type">Search by Type</option>
      </select>
      <button onClick={searchBreweries}>Search</button>
      <AuthDetails />

      <ul>
        {searchResults.map((brewery) => (
          <li key={brewery.id}>
            <div className="brewery-card">
              <h3>
                <Link to={`/brewery/${brewery.id}`}>{brewery.name}</Link>
              </h3>
              <p>Address: {brewery.street}, {brewery.city}, {brewery.state}</p>
              <p>Phone: {brewery.phone}</p>
              <p>Website: {brewery.website_url && <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a>}</p>
              <p>Average Rating: {brewery.averageRating ? brewery.averageRating.toFixed(1) : 'N/A'}</p>
              <p>Number of Reviews: {brewery.numReviews}</p>
              <button onClick={() => handleAddReview(brewery.id)}>Add Review</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BrewerySearch;
