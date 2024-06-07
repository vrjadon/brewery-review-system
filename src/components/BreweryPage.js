import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure you import your Firestore instance

function BreweryPage() {
  const [breweryDetails, setBreweryDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  const [description, setDescription] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchBreweryDetails = async () => {
      try {
        const response = await axios.get(`https://api.openbrewerydb.org/breweries/${id}`);
        setBreweryDetails(response.data);
      } catch (error) {
        console.error('Error fetching brewery details:', error);
      }
    };

    const fetchFirestoreDetails = async () => {
      try {
        // Fetch description from Firestore
        const docRef = doc(db, 'breweries', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDescription(data.description || 'No description available.');
        }

        // Fetch reviews from Firestore
        const reviewsRef = collection(db, `breweries/${id}/reviews`);
        const reviewsSnapshot = await getDocs(reviewsRef);
        const reviewsData = reviewsSnapshot.docs.map(doc => doc.data());
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching Firestore details:', error);
      }
    };

    fetchBreweryDetails();
    fetchFirestoreDetails();
  }, [id]);

  return (
    <div>
      <h2>Brewery Details</h2>
      <h3>{breweryDetails.name}</h3>
      <p>Address: {breweryDetails.street}, {breweryDetails.city}, {breweryDetails.state}</p>
      <p>Phone: {breweryDetails.phone}</p>
      <p>Website: <a href={breweryDetails.website_url} target="_blank" rel="noopener noreferrer">{breweryDetails.website_url}</a></p>
      <p>Description: {description}</p>
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

export default BreweryPage;
