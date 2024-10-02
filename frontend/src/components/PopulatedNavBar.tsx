// src/components/PopulatedNavBar.tsx
import React from 'react';
import NavBar from './nav/NavBar';
import styles from './PopulatedNavBar.module.scss';

const PopulatedNavBar: React.FC = () => {
    return (
        <div className={styles.navBar}>
            <NavBar />
        </div>
    );
};

export default PopulatedNavBar;
