import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SortableTable from '../components/table/SortableTable';
import styles from '../styles/approval.module.scss'; // Import approval styles
import SidePanel from '../components/nav/SidePanel'; // Import SidePanel
import sidePanelStyles from '../styles/sidepanel.module.scss'; // Import side panel styles

interface Article {
    id: string;
    title: string;
    author: string;
    journal: string;
    year: string;
    volume: string;
    number: string;
    pages: string;
    doi: string;
    submissionDate: string;
    status: 'pending' | 'approved' | 'rejected'; // Status field added
}

const ApprovalList: React.FC = () => {
    const [isSidePanelOpen, setSidePanelOpen] = useState(false); // Side panel state
    const [articles, setArticles] = useState<Article[]>([]); // State to store the approved/rejected articles
    const router = useRouter(); // Router to access query parameters

    useEffect(() => {
        if (router.query.articles) {
            const receivedArticles = JSON.parse(router.query.articles as string);
            setArticles(receivedArticles); // Set the received articles
        } else {
            // Add default articles if none are received
            setArticles([
                {
                    id: '1',
                    title: 'Understanding AI in 2024',
                    author: 'Jane Doe',
                    journal: 'AI Journal',
                    year: '2024',
                    volume: '15',
                    number: '3',
                    pages: '50-67',
                    doi: '10.1000/xyz123',
                    submissionDate: '2024-09-15',
                    status: 'approved', // Sample approved article
                },
                {
                    id: '2',
                    title: 'The Future of Quantum Computing',
                    author: 'John Smith',
                    journal: 'Quantum Computing Reviews',
                    year: '2024',
                    volume: '12',
                    number: '2',
                    pages: '100-120',
                    doi: '10.1000/abc987',
                    submissionDate: '2024-09-20',
                    status: 'rejected', // Sample rejected article
                },
            ]);
        }
    }, [router.query]);

    const headers = [
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'journal', label: 'Journal Name' },
        { key: 'year', label: 'Year' },
        { key: 'volume', label: 'Volume' },
        { key: 'number', label: 'Number' },
        { key: 'pages', label: 'Pages' },
        { key: 'doi', label: 'DOI' },
        { key: 'submissionDate', label: 'Submission Date' },
        { key: 'status', label: 'Status' }, // Adding status to headers
    ];

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen); // Function to toggle side panel
    };

    return (
        <div className={styles.container}>
            {/* Side Panel */}
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}

            <h1>Articles Waiting for Approval</h1>
            <SortableTable headers={headers} data={articles} />

            {/* Button to toggle side panel */}
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}>
                {/* Empty button */}
            </button>
        </div>
    );
};

export default ApprovalList;
