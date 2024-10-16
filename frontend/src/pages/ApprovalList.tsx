import React, { useEffect, useState } from 'react';
import SortableTable from '../components/table/SortableTable';
import styles from '../styles/approval.module.scss';
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
    status: 'Pending' | 'Approved' | 'Rejected';
}

const ApprovalList: React.FC = () => {
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            const storedReviewedArticles: Article[] = JSON.parse(localStorage.getItem('reviewedArticles') || '[]');
            setArticles(storedReviewedArticles);
            setLoading(false);
        };
        fetchArticles();
    }, []);

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    const handleApprove = (id: string) => {
        const updatedArticles = articles.map(article =>
            article.id === id ? { ...article, status: 'Approved' } : article
        );
        setArticles(updatedArticles);
        localStorage.setItem('reviewedArticles', JSON.stringify(updatedArticles));
    };

    const handleReject = (id: string) => {
        const updatedArticles = articles.map(article =>
            article.id === id ? { ...article, status: 'Rejected' } : article
        );
        setArticles(updatedArticles);
        localStorage.setItem('reviewedArticles', JSON.stringify(updatedArticles));
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
        { key: 'actions', label: 'Actions' }
    ];

    const modifiedArticles = articles.map(article => ({
        ...article,
        statusDisplay: (
            <div className={styles.statusContainer}>
                <span>{article.status}</span>
            </div>
        ),
        actions: (
            <div className={styles.actionButtonsContainer}>
                <button className={styles.approveButton} onClick={() => handleApprove(article.id)}>Approve</button>
                <button className={styles.rejectButton} onClick={() => handleReject(article.id)}>Reject</button>
            </div>
        )
    }));

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}></button>
            <h1>Approval Queue</h1>
            <SortableTable
                headers={headers}
                data={modifiedArticles.map(({ statusDisplay, ...article }) => ({
                    ...article,
                    status: statusDisplay,
                }))}
            />
        </div>
    );
};

export default ApprovalList;
