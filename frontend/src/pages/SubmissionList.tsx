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
    evidence: string;
    typeOfResearch?: string;
    typeOfParticipant?: string;
    status?: 'Approved' | 'Rejected' | 'Pending';
}

const SubmissionList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);

    useEffect(() => {
        const storedArticles = localStorage.getItem('articles');
        if (storedArticles) {
            try {
                const articlesWithStatus: Article[] = JSON.parse(storedArticles).map((article: Article) => ({
                    ...article,
                    status: article.status || 'Pending',
                }));
                setArticles(articlesWithStatus);
            } catch (error) {
                console.error('Error parsing articles from localStorage:', error);
            }
        }
    }, []);

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
        { key: 'evidence', label: 'Evidence' },
        { key: 'typeOfResearch', label: 'Type of Research' },
        { key: 'typeOfParticipant', label: 'Type of Participant' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
    ];

    const handleStatusChange = useCallback((id: string, newStatus: 'Approved' | 'Rejected') => {
        const updatedArticles = articles.map(article =>
            article.id === id ? { ...article, status: newStatus } : article
        );
        setArticles(updatedArticles);
        localStorage.setItem('articles', JSON.stringify(updatedArticles));
    }, [articles]);

    const handleSubmitToAnalyst = async () => {
        const approvedArticles = articles.filter(article => article.status === 'Approved');
        const rejectedArticles = articles.filter(article => article.status === 'Rejected');

        localStorage.setItem('reviewedArticles', JSON.stringify(approvedArticles));

        // Optionally send rejected articles to a backend endpoint
        try {
            const response = await fetch('/api/articles/rejected', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rejectedArticles),
            });

            if (!response.ok) {
                throw new Error('Failed to send rejected articles');
            }

            console.log('Rejected articles sent successfully.');
        } catch (error) {
            console.error('Error sending rejected articles:', error);
        }

        const remainingArticles = articles.filter(article => article.status === 'Pending');
        setArticles(remainingArticles);
        localStorage.setItem('articles', JSON.stringify(remainingArticles));
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
                            <span>{article.status}</span>
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
            <button onClick={handleSubmitToAnalyst} className={styles.sendButton}>
                Submit to Analyst
            </button>
        </div>
    );
};

export default SubmissionList;
