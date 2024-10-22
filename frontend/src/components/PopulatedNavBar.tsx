// src/components/PopulatedNavBar.tsx
import React from 'react';
import NavBar from './nav/NavBar';
import styles from './PopulatedNavBar.module.scss';

// Define the props interface
interface PopulatedNavBarProps {
    isEditMode: boolean;              // Prop to indicate edit mode status
    toggleEditMode: () => void;      // Function to toggle edit mode
}

const PopulatedNavBar: React.FC<PopulatedNavBarProps> = ({ isEditMode, toggleEditMode }) => {
    return (
        <div className={styles.navBar}>
            <NavBar isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
        </div>
    );
};

export default PopulatedNavBar;
