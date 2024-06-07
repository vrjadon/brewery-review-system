import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/review.css';
import AuthDetails from './Authdetails';

function AddReviewForm() {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Destructure id from useParams directly
  console.log(id);

  const addReviewToDatabase = async (userId, rating, description, breweryId) => {
    try {
      const reviewRef = collection(db, `breweries/${breweryId}/reviews`);
      await addDoc(reviewRef, {
        userId: userId,
        rating: Number(rating) || 0, // Convert rating to a number
        description: description,
      });
      console.log('Review added successfully');
      navigate('/search');
    } catch (error) {
      console.error('Error adding review: ', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = auth.currentUser.uid;
    console.log(rating, description, userId);

    if (!userId) {
      console.log('User not logged in');
      return;
    }

    // Ensure all necessary data is available (rating, description, brewery ID)
    if (!rating || !description || !id) {
      console.log('Please provide all required details');
      return;
    }

    // Call addReviewToDatabase with the userId, rating, description, and brewery ID
    addReviewToDatabase(userId, rating, description, id);
  };

  return (
    <form onSubmit={handleSubmit} className='brewery-search-container'>
      <h2>Add Review</h2>
      <label>
        Rating:
        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
      </label>
      <br />
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <br />
      <button type="submit">Submit Review</button>
      <AuthDetails />
    </form>
  );
}

export default AddReviewForm;
