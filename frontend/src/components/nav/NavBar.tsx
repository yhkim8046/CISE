// src/components/nav/NavBar.tsx
import React from 'react';
import Image from 'next/image';
import NavDropdown from './NavDropdown';
import styles from './Nav.module.scss';
import userIcon from '../../images/user.png'; // Import your icon
import { useUserType } from '../../context/userType'; // Import your context

interface NavBarProps {
    isEditMode: boolean; // Prop for edit mode status
    toggleEditMode: () => void; // Prop for toggling edit mode
    className?: string; // Optional className prop
}

const NavBar: React.FC<NavBarProps> = ({ isEditMode, toggleEditMode, className }) => {
    const { userType, setUserType } = useUserType(); // Use the user type from context

    const options = [
        { value: 'admin_user', label: 'Admin' },
        { value: 'analyst_user', label: 'Analyst' },
        { value: 'moderator_user', label: 'Moderator' },
        { value: 'normal_user', label: 'User' },
    ];

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserType(event.target.value); // Update userType via context
    };

    return (
        <nav className={`${styles.navbar} ${className}`}> {/* Apply the className prop */}
            <div className={styles.navLeft}>
                <button className={styles.dropdownButton} aria-label="Menu" />
                <h1>SPEED Article Database</h1>
                <NavDropdown label="" />
            </div>
            <div className={styles.navRight}>
                {/* Display Edit Mode status and toggle button only if user is admin */}
                {userType === 'admin_user' && (
                    <div className={styles.editModeContainer}>
                        <div className={styles.editModeStatus}>
                            Edit Mode: {isEditMode ? 'On' : 'Off'}
                        </div>
                        <button onClick={toggleEditMode} aria-label="Toggle Edit Mode">
                            Toggle Edit Mode
                        </button>
                    </div>
                )}
                <div className={styles.userSelectContainer}>
                    <Image src={userIcon} alt="User Icon" className={styles.userIcon} />
                    <select
                        className={styles.userSelect}
                        value={userType} // Controlled by context
                        onChange={handleChange}
                    >
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
