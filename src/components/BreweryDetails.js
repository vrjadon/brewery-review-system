import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'; 

function BreweryDetails() {
  const [brewery, setBrewery] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();

  const fetchBreweryDetails = useCallback(async () => {
    try {
      const docRef = doc(db, 'breweries', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBrewery(docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching brewery details:', error);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const reviewsRef = collection(db, `breweries/${id}/reviews`);
      const reviewsSnapshot = await getDocs(reviewsRef);
      const reviewsData = reviewsSnapshot.docs.map((doc) => doc.data());
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchBreweryDetails();
    fetchReviews();
  }, [fetchBreweryDetails, fetchReviews]);

  return (
    <div className="brewery-details-container">
      {brewery ? (
        <div className="brewery-details">
          <h2>{brewery.name}</h2>
          <p>Address: {brewery.street}, {brewery.city}, {brewery.state}</p>
          <p>Phone: {brewery.phone}</p>
          <p>Website: <a href={brewery.website} target="_blank" rel="noopener noreferrer">{brewery.website}</a></p>
          <p>Description: {brewery.description || 'No description available.'}</p>
        </div>
      ) : (
        <p>Loading brewery details...</p>
      )}

      <div className="reviews">
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <p>Rating: {review.rating}</p>
                <p>Description: {review.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
}

export default BreweryDetails;
