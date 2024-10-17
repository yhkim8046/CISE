import React, { useEffect, useState, useCallback } from 'react';
import SortableTable from '../components/table/SortableTable';
import styles from '../styles/submission.module.scss';
import SidePanel from '../components/nav/SidePanel'; 
import sidePanelStyles from '../styles/sidepanel.module.scss';

interface Article {
    id: string;
    title: string;
    authors: string;
    source: string;
    yearOfPublication: number;
    pages?: number;
    volume?: number;
    doi?: string;
    claim: string;
    status?: 'Approved' | 'Rejected' | 'Pending';
}

const SubmissionList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [tempStatus, setTempStatus] = useState<{ [key: string]: 'Approved' | 'Rejected' | 'Pending' | undefined }>({});

    useEffect(() => {
        fetchArticles(); // Call the function to fetch articles on component mount
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch('/api/articles');
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const fetchedArticles: Article[] = await response.json();
            setArticles(fetchedArticles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(prevState => !prevState);
    };

    const headers = [
        { key: 'title', label: 'Title' },
        { key: 'authors', label: 'Authors' },
        { key: 'source', label: 'Source' },
        { key: 'yearOfPublication', label: 'Year of Publication' },
        { key: 'pages', label: 'Pages' },
        { key: 'volume', label: 'Volume' },
        { key: 'doi', label: 'DOI' },
        { key: 'claim', label: 'Claim' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
    ];

    const handleStatusChange = useCallback((id: string, newStatus: 'Approved' | 'Rejected') => {
        setTempStatus(prev => ({ ...prev, [id]: newStatus }));
    }, []);

    const handleSubmit = async () => {
        const updates = articles.map(article => ({
            id: article.id,
            status: tempStatus[article.id] || article.status,
        })).filter(update => update.status);

        try {
            const response = await fetch('/api/articles/batch-update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to submit changes');
            }

            // Refetch articles to get the latest state
            fetchArticles(); // Refetch articles after the update
            setTempStatus({}); // Reset temporary status
        } catch (error) {
            console.error('Error submitting changes:', error);
        }
    };

    return (
        <div className={styles.container}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}
            <button onClick={toggleSidePanel} className={sidePanelStyles.togglePanelButton}></button>
            <h1>Articles Submission Queue</h1>
            <SortableTable
                headers={headers}
                data={articles.map(article => ({
                    ...article,
                    status: (
                        <div className={styles.statusContainer}>
                            <span>{tempStatus[article.id] || article.status}</span>
                        </div>
                    ),
                    actions: (
                        <div className={styles.actionButtonsContainer}>
                            <button
                                className={styles.approveButton}
                                onClick={() => handleStatusChange(article.id, 'Approved')}
                            >
                                Approve
                            </button>
                            <button
                                className={styles.rejectButton}
                                onClick={() => handleStatusChange(article.id, 'Rejected')}
                            >
                                Reject
                            </button>
                        </div>
                    ),
                }))}
            />
            <button onClick={handleSubmit} className={styles.sendButton}>Submit Changes</button>
        </div>
    );
};

export default SubmissionList;
