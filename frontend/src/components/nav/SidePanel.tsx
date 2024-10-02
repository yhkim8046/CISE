// src/components/nav/SidePanel.tsx
import React from 'react';
import styles from './Nav.module.scss';

interface SidePanelProps {
    onClose: () => void; // Function to close the panel
}

const SidePanel: React.FC<SidePanelProps> = ({ onClose }) => {
    return (
        <div className={styles.sidePanel}>
            <button className={styles.panelButton}></button> 
        </div>
    );
};

export default SidePanel;
