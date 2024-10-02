// src/components/nav/NavDropdown.tsx
import React from 'react';
import styles from './Nav.module.scss';

interface NavDropdownProps {
    label: string;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label }) => {
    return (
        <div className={styles.navDropdown}>
            {/* Dropdown content can go here */}
        </div>
    );
};

export default NavDropdown;
