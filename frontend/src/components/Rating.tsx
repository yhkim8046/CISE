import React, { useState } from 'react';
import styles from '../styles/rating.module.scss'; // Ensure the path is correct

interface RatingProps {
    articleId: string;
    currentRating?: number;
    onRatingChange: (articleId: string, newRating: number) => void;
    ratingCounter: number; // Change this to ratingCounter
    averageRating: number; // Average rating
}

const Rating: React.FC<RatingProps> = ({ articleId, currentRating = 0, onRatingChange, ratingCounter, averageRating }) => {
    const [userRating, setUserRating] = useState<number | null>(currentRating);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null); // State for hovered star

    const handleRatingSubmit = async (rating: number) => {
        setUserRating(rating);
        onRatingChange(articleId, rating); // Call parent function to update rating
    };

    return (
        <div className={styles.ratingContainer}>
            {/* Render star buttons for ratings */}
            <div className={styles.stars}>
                {Array.from({ length: 5 }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handleRatingSubmit(index + 1)} // Submit rating on click
                        onMouseEnter={() => setHoveredRating(index + 1)} // Set hovered rating on mouse enter
                        onMouseLeave={() => setHoveredRating(null)} // Clear hovered rating on mouse leave
                        className={`${styles.star} 
                            ${userRating && userRating >= index + 1 ? styles.filled : ''} 
                            ${hoveredRating && hoveredRating >= index + 1 ? styles.filled : ''}`} // Apply filled class for hovered stars
                        aria-label={`Rate ${index + 1} stars`}
                    >
                        ★
                    </button>
                ))}
            </div>
            {/* Display rating counter and average rating on new lines */}
            <div style={{ marginTop: '8px' }}> {/* This will help maintain spacing */}
                <p style={{ margin: 0 }}>Rating Count: {ratingCounter}</p> {/* Display rating counter */}
                <p style={{ margin: 0 }}>Average Rating: {averageRating.toFixed(1)}</p> {/* Display average rating */}
            </div>
        </div>
    );
};

export default Rating;
