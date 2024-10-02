import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from './Nav.module.scss';

interface SidePanelProps {
    onClose: () => void; // Function to close the panel
}

const SidePanel: React.FC<SidePanelProps> = ({ onClose }) => {
    const router = useRouter(); // Initialize Next.js router

    const handleHomeClick = () => {
        router.push('/'); // Navigate to the index page (home)
    };

    const handleSubmissionList = () => {
        router.push('/SubmissionList'); // Navigate to the Submission List page
    };

    return (
        <div className={styles.sidePanel}>
            <button className={styles.homeButton} onClick={handleHomeClick}>
                <span className={styles.tooltip}>Home</span>
            </button>
            <button className={styles.queueButton} onClick={handleSubmissionList}>
                <span className={styles.tooltip}>Article Submission List</span>
            </button>
        </div>
    );
};

export default SidePanel;
