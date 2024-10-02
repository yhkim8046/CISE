import React, { useState } from 'react';
import SortableTable from '../components/table/SortableTable';
import SidePanel from '../components/nav/SidePanel';
import styles from '../styles/index.module.scss'; // Import your styles

const IndexPage: React.FC = () => {
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [data, setData] = useState([
        { title: 'Sample Article', author: 'John Doe', journal: 'Science Journal', year: 2024, volume: 15, number: 2, pages: '100-110', doi: '10.1234/xyz' },
        // Add more sample data as needed
    ]);

    const headers = [
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'journal', label: 'Journal Name' },
        { key: 'year', label: 'Year' },
        { key: 'volume', label: 'Volume' },
        { key: 'number', label: 'Number' },
        { key: 'pages', label: 'Pages' },
        { key: 'doi', label: 'DOI' },
    ];

    const handleSubmit = () => {
        console.log('Article submitted');
        // Add any submission logic here
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    return (
        <div className={styles.pageContainer}>
            {/* Side Panel */}
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}

            {/* Main Content */}
            <div className={`${styles.mainContent} ${isSidePanelOpen ? styles.openSidePanel : ''}`}>
                <div className={styles.headerContainer}>
                    <h1>Articles</h1>
                    <button className={styles.submitButton} onClick={handleSubmit}>
                        Submit Article
                    </button>
                </div>
                <SortableTable headers={headers} data={data} />
            </div>

            {/* Button to toggle side panel */}
            <button className={styles.togglePanelButton} onClick={toggleSidePanel}>
                {isSidePanelOpen ? '' : ''}
            </button>
        </div>
    );
};

export default IndexPage;
