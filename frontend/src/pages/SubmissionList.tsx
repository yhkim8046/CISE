import React, { useEffect, useState } from 'react';
import SortableTable from '../components/table/SortableTable';
import styles from '../styles/submission.module.scss';
import SidePanel from '../components/nav/SidePanel';
import sidePanelStyles from '../styles/sidepanel.module.scss';
import { useRouter } from 'next/router';

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
    const router = useRouter(); // Add useRouter for navigation

    useEffect(() => {
        const storedArticles: Article[] = JSON.parse(localStorage.getItem('articles') || '[]');
        const articlesWithStatus = storedArticles.map(article => ({
            ...article,
            status: article.status || 'Pending',
        }));
        setArticles(articlesWithStatus);
    }, []);

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
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
        { key: 'status', label: 'Status' }
    ];

    const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
        const updatedArticles = articles.map(article =>
            article.id === id ? { ...article, status: newStatus } : article
        );
        setArticles(updatedArticles);
        localStorage.setItem('articles', JSON.stringify(updatedArticles));
    };

    const modifiedArticles = articles.map(article => ({
        ...article,
        status: (
            <div className={styles.statusContainer}>
                <span>{article.status}</span>
            </div>
        ),
        actions: (
            <div className={styles.actionButtonsContainer}>
                <button className={styles.approveButton} onClick={() => handleStatusChange(article.id, 'Approved')}>Approve</button>
                <button className={styles.rejectButton} onClick={() => handleStatusChange(article.id, 'Rejected')}>Reject</button>
            </div>
        )
    }));

    const handleSubmitToAnalyst = () => {
        const reviewedArticles = articles.filter(article => article.status === 'Approved' || article.status === 'Rejected');
        const remainingArticles = articles.filter(article => article.status === 'Pending');

        setArticles(remainingArticles);
        localStorage.setItem('articles', JSON.stringify(remainingArticles));
        
        // Optionally, you can store reviewed articles or directly navigate to the Approval List
        // For example, you can use local storage or pass the data in router state
        localStorage.setItem('reviewedArticles', JSON.stringify(reviewedArticles));

    };

    return (
        <div className={styles.container}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}
            <button onClick={toggleSidePanel} className={sidePanelStyles.togglePanelButton}></button>
            <h1>Articles Submission Queue</h1>
            <SortableTable
                headers={[
                    ...headers,
                    { key: 'actions', label: 'Actions' }
                ]}
                data={modifiedArticles}
            />
            <button onClick={handleSubmitToAnalyst} className={styles.submitToAnalystButton}>
                Submit to Analyst
            </button>
        </div>
    );
};

export default SubmissionList;
