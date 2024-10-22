import React, { useEffect, useState, useCallback } from 'react';
import SortableTable from '../components/table/SortableTable';
import styles from '../styles/submission.module.scss';
import SidePanel from '../components/nav/SidePanel'; 
import sidePanelStyles from '../styles/sidepanel.module.scss';

interface Article {
    _id: string;
    title: string;
    author: string;
    yearOfPublication: number;
    pages?: number;
    volume?: number;
    doi?: string;
    claim: string;
    status?: 'Approved' | 'Rejected' | 'Pending';
}

const SubmissionList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [rejectedArticles, setRejectedArticles] = useState<Article[]>([]);
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [tempStatus, setTempStatus] = useState<{ [key: string]: 'Approved' | 'Rejected' | undefined }>({});
    const [showRejected, setShowRejected] = useState(false);

    useEffect(() => {
        fetchArticles(); // Call the function to fetch articles on component mount
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch('https://cise-backend-nine.vercel.app/api/articles'); // Updated port here
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const fetchedArticles: Article[] = await response.json();
            
            // Filter to only include articles with status 'Pending'
            const pendingArticles = fetchedArticles.filter(article => article.status === 'Pending');
            setArticles(pendingArticles);

            // Filter to include articles with status 'Rejected'
            const rejected = fetchedArticles.filter(article => article.status === 'Rejected');
            setRejectedArticles(rejected);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(prevState => !prevState);
    };

    const headers = [
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'yearOfPublication', label: 'Year of Publication' },
        { key: 'pages', label: 'Pages' },
        { key: 'volume', label: 'Volume' },
        { key: 'doi', label: 'DOI' },
        { key: 'claim', label: 'Claim' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
    ];

    const rejectedHeaders = [
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'yearOfPublication', label: 'Year of Publication' },
        { key: 'pages', label: 'Pages' },
        { key: 'volume', label: 'Volume' },
        { key: 'doi', label: 'DOI' },
        { key: 'claim', label: 'Claim' },
    ];

    const handleStatusChange = useCallback((_id: string, newStatus: 'Approved' | 'Rejected') => {
        setTempStatus(prev => ({ ...prev, [_id]: newStatus }));
    }, []);

    const handleSubmit = async () => {
        const updates = articles.map(article => ({
            _id: article._id,
            status: tempStatus[article._id] || article.status,
        })).filter(update => update.status); // Only keep updates with a status
    
        if (updates.length === 0) {
            console.warn('No status changes to submit');
            return; // Exit early if there are no updates
        }
    
        try {
            const response = await fetch('https://cise-backend-nine.vercel.app/api/articles/batch-update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to submit changes: ${response.status} ${response.statusText}`);
            }
    
            await fetchArticles(); // Refetch articles after the update
            setTempStatus({}); // Reset temporary status
        } catch (error) {
            console.error('Error submitting changes:', error);
        }
    };

    const toggleShowRejected = () => {
        setShowRejected(prev => !prev);
    };
    
    return (
        <div className={styles.container}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} onToggleEditMode={function (): void {
            } } />}
            <button onClick={toggleSidePanel} className={sidePanelStyles.togglePanelButton}></button>
            <h1>Articles Submission Queue</h1>
            <SortableTable
                headers={headers}
                data={articles.map(article => ({
                    ...article,
                    status: (
                        <div className={styles.statusContainer}>
                            <span>{tempStatus[article._id] || article.status}</span>
                        </div>
                    ),
                    actions: (
                        <div className={styles.actionButtonsContainer}>
                            <button
                                className={styles.approveButton}
                                onClick={() => handleStatusChange(article._id, 'Approved')}
                            >
                                Approve
                            </button>
                            <button
                                className={styles.rejectButton}
                                onClick={() => handleStatusChange(article._id, 'Rejected')}
                            >
                                Reject
                            </button>
                        </div>
                    ),
                }))}
            />
            <button onClick={handleSubmit} className={styles.sendButton} disabled={Object.keys(tempStatus).length === 0}>
                Submit Changes
            </button>

            {/* Button to show/hide rejected articles */}
            <button onClick={toggleShowRejected} className={styles.showRejectedButton}>
                {showRejected ? 'Hide Rejected Articles' : 'Show Rejected Articles'}
            </button>

            {/* Conditionally render rejected articles table */}
            {showRejected && (
                <div className={styles.rejectedArticlesTable}>
                    <h2>Rejected Articles</h2>
                    <SortableTable
                        headers={rejectedHeaders}
                        data={rejectedArticles.map(article => ({
                            ...article,
                        }))}
                    />
                </div>
            )}
        </div>
    );
};

export default SubmissionList;
