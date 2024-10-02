import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SortableTable from '../components/table/SortableTable';
import SidePanel from '../components/nav/SidePanel';
import indexStyles from '../styles/index.module.scss';
import sidePanelStyles from '../styles/sidepanel.module.scss';
import data from '../utils/dummydata'; // Import the article data

// Define the interface for the articles
interface ArticlesInterface {
    id: string;
    title: string;
    authors: string;
    source: string;
    pubyear: string;
    doi: string;
    claim: string;
    evidence: string;
}

const IndexPage: React.FC = () => {
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);

    const router = useRouter();

    const headers: { key: keyof ArticlesInterface; label: string }[] = [
        { key: 'title', label: 'Title' },
        { key: 'authors', label: 'Authors' },
        { key: 'source', label: 'Source' },
        { key: 'pubyear', label: 'Publication Year' },
        { key: 'doi', label: 'DOI' },
        { key: 'claim', label: 'Claim' },
        { key: 'evidence', label: 'Evidence' },
    ];

    const handleSubmit = () => {
        router.push('/SubmissionForm');
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    return (
        <div className={indexStyles.pageContainer}>
            {/* Side Panel */}
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}

            {/* Main Content */}
            <div className={`${indexStyles.mainContent} ${isSidePanelOpen ? indexStyles.openSidePanel : ''}`}>
                <div className={indexStyles.headerContainer}>
                    <h1>Articles</h1>
                    <button className={indexStyles.submitButton} onClick={handleSubmit}>
                        Submit Article
                    </button>
                </div>
                <SortableTable headers={headers} data={data} />
            </div>

            {/* Button to toggle side panel */}
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}>
                {isSidePanelOpen ? '' : ''}
            </button>
        </div>
    );
};

export default IndexPage;
