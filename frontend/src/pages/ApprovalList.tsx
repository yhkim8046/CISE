import React, { useEffect, useState } from 'react';
import SortableTable from '../components/table/SortableTable';
import styles from '../styles/approval.module.scss';
import SidePanel from '../components/nav/SidePanel';
import sidePanelStyles from '../styles/sidepanel.module.scss';

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
    status: 'pending' | 'approved' | 'rejected';
}

const ApprovalList: React.FC = () => {
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            // Load reviewed articles from local storage
            const storedReviewedArticles: Article[] = JSON.parse(localStorage.getItem('reviewedArticles') || '[]');
            setArticles(storedReviewedArticles);
            setLoading(false);
        };

        fetchArticles();
    }, []);

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
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    const handleApprove = (id: string) => {
        console.log(`Approved article with id: ${id}`);
        // Add approval logic here
    };

    const handleReject = (id: string) => {
        console.log(`Rejected article with id: ${id}`);
        // Add rejection logic here
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}
            <div className={styles.contentWrapper}>
                <h1>Analysis Queue</h1>
                <SortableTable headers={headers} data={articles} onApprove={handleApprove} onReject={handleReject} />
            </div>
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}></button>
        </div>
    );
};

export default ApprovalList;
