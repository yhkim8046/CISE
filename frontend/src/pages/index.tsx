import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SortableTable from '../components/table/SortableTable';
import SidePanel from '../components/nav/SidePanel';
import indexStyles from '../styles/index.module.scss';
import sidePanelStyles from '../styles/sidepanel.module.scss';
import data from '../utils/dummydata'; // Import the article data
import searchIcon from '../images/search.png'; // Import the search icon
import { useUserType } from '../context/userType'; // Import context

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
    const { userType } = useUserType(); // Use the hook to get userType
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSubmissionList = () => {
        router.push('/SubmissionList'); 
    };

    const handleApprovalList = () => {
        router.push('/ApprovalList'); 
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className={indexStyles.pageContainer}>
            {/* Side Panel */}
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}

            {/* Main Content */}
            <div className={`${indexStyles.mainContent} ${isSidePanelOpen ? indexStyles.openSidePanel : ''}`}>
                <div className={indexStyles.headerContainer}>
                    <h1>Articles</h1>
                    <div className={indexStyles.searchBarContainer}>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className={indexStyles.searchInput}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className={indexStyles.searchButton}>
                            <Image src={searchIcon} alt="Search" width={16} height={16} />
                        </button>
                    </div>
                    <div className={indexStyles.buttonContainer}>
                        {/* Show button only for 'moderator_user' and 'admin_user' */}
                        {(userType === 'moderator_user' || userType === 'admin_user') && (
                            <button className={indexStyles.moderatorButton} onClick={handleSubmissionList}>
                                Submission List
                            </button>
                        )}
                        
                        {/* Show button only for 'analyst_user' and 'admin_user' */}
                        {(userType === 'analyst_user' || userType === 'admin_user') && (
                            <button className={indexStyles.analystButton} onClick={handleApprovalList}>
                                Approval List
                            </button>
                        )}
                        
                        <button className={indexStyles.submitButton} onClick={handleSubmit}>
                            Submit Article
                        </button>
                    </div>
                </div>
                <SortableTable headers={headers} data={data} />
            </div>

            {/* Button to toggle side panel */}
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}>
                {isSidePanelOpen ? '' : ''}  {/* Keep toggle text for clarity */}
            </button>
        </div>
    );
};

export default IndexPage;
