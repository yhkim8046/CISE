import React, { useState } from 'react';

interface RatingProps {
    rating: number;
    articleId: string;
    currentRating?: number; // Make currentRating optional
    onRatingChange: (articleId: string, newRating: number) => void;
    totalRatings: number;
}

const Rating: React.FC<RatingProps> = ({ articleId, currentRating = 0, onRatingChange, totalRatings }) => {
    const [userRating, setUserRating] = useState<number | null>(null);

    const handleRatingSubmit = (rating: number) => {
        setUserRating(rating);
        onRatingChange(articleId, rating); 
    };

    return (
        <div>
            {Array.from({ length: 5 }, (_, index) => (
                <button
                    key={index}
                    onClick={() => handleRatingSubmit(index + 1)}
                    style={{
                        color: userRating && userRating >= index + 1 ? 'gold' : 'gray',
                    }}
                >
                    ★
                </button>
            ))}
            <p>Current Rating: {currentRating.toFixed(1)}</p>
            <p>Total Ratings: {totalRatings}</p> {/* Optional: Display total ratings */}
        </div>
    );
};

export default Rating;
