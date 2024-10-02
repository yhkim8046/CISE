// src/components/nav/NavBar.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import NavDropdown from './NavDropdown';
import SidePanel from './SidePanel'; // Import your new SidePanel component
import styles from './Nav.module.scss';
import userIcon from '../../images/user.png'; // Import your icon

const NavBar = () => {
    const [selectedOption, setSelectedOption] = useState('normal_user');

    const options = [
        { value: 'admin_user', label: 'Admin' },
        { value: 'analyst_user', label: 'Analyst' },
        { value: 'moderator_user', label: 'Moderator' },
        { value: 'normal_user', label: 'User' },
    ];

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };



    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navLeft}>
                    <button className={styles.dropdownButton} aria-label="Menu" />
                    <h1>SPEED Article Database</h1>
                    <NavDropdown label="" />
                </div>
                <div className={styles.navRight}>
                    <div className={styles.userSelectContainer}>
                        <Image src={userIcon} alt="User Icon" className={styles.userIcon} />
                        <select
                            className={styles.userSelect}
                            value={selectedOption}
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
        </>
    );
};

export default NavBar;
