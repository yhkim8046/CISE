// src/pages/SubmissionList.tsx
import React, { useState } from 'react';
import SortableTable from '../components/table/SortableTable';
import styles from '../styles/List.module.scss'; // Import your styles
import SidePanel from '../components/nav/SidePanel'; // Import SidePanel
import sidePanelStyles from '../styles/sidepanel.module.scss'; // Import side panel styles

interface Article {
    id: string;
    title: string;
    author: string;
    submissionDate: string;
}

const SubmissionList: React.FC = () => {
    const [isSidePanelOpen, setSidePanelOpen] = useState(false); // Side panel state

    const articles: Article[] = [
        {
            id: '1',
            title: 'Understanding AI in 2024',
            author: 'Jane Doe',
            submissionDate: '2024-09-15',
        },
        {
            id: '2',
            title: 'The Future of Quantum Computing',
            author: 'John Smith',
            submissionDate: '2024-09-20',
        },
        // Add more sample articles as needed
    ];

    const headers = [
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'submissionDate', label: 'Submission Date' },
    ];

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen); // Function to toggle side panel
    };

    return (
        <div className={styles.container}>
            {/* Side Panel */}
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}

            <h1>Submitted Articles for Review</h1>
            <SortableTable headers={headers} data={articles} />

            {/* Button to toggle side panel */}
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}>
                {isSidePanelOpen ? '' : ''}
            </button>
        </div>
    );
};

export default SubmissionList;
