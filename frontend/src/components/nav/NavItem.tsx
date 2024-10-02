// src/components/nav/NavItem.tsx
import React from 'react';
import styles from './Nav.module.scss';

interface NavItemProps {
    label: string;
}

const NavItem: React.FC<NavItemProps> = ({ label }) => {
    return (
        <button className={styles.navItemButton}>{label}</button>
    );
};

export default NavItem;
