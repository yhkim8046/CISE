import React, { useState } from 'react';
import SortableTable from '../components/table/SortableTable';
import styles from '../styles/submission.module.scss'; // Import submission styles
import SidePanel from '../components/nav/SidePanel'; // Import SidePanel
import sidePanelStyles from '../styles/sidepanel.module.scss'; // Import side panel styles
import { useRouter } from 'next/router'; // Import useRouter hook

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

const SubmissionList: React.FC = () => {
    const [isSidePanelOpen, setSidePanelOpen] = useState(false); // Side panel state
    const [articles, setArticles] = useState<Article[]>([
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
            status: 'pending',
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
            status: 'pending',
        },
        {
            id: '3',
            title: 'Machine Learning in Practice',
            author: 'Alice Johnson',
            journal: 'Journal of ML',
            year: '2024',
            volume: '5',
            number: '1',
            pages: '15-30',
            doi: '10.1000/def456',
            submissionDate: '2024-09-25',
            status: 'pending',
        },
        {
            id: '4',
            title: 'Advances in Deep Learning',
            author: 'Bob Brown',
            journal: 'Deep Learning Journal',
            year: '2024',
            volume: '10',
            number: '4',
            pages: '200-215',
            doi: '10.1000/ghi789',
            submissionDate: '2024-09-26',
            status: 'pending',
        },
        {
            id: '5',
            title: 'Data Science in 2024',
            author: 'Eve White',
            journal: 'Data Science Journal',
            year: '2024',
            volume: '8',
            number: '2',
            pages: '75-90',
            doi: '10.1000/jkl012',
            submissionDate: '2024-09-28',
            status: 'pending',
        },
    ]);

    const [processedArticles, setProcessedArticles] = useState<Article[]>([]); // Store processed articles
    const router = useRouter(); // Router for navigation

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
        { key: 'actions', label: 'Actions' }, // Added 'Actions' to headers for buttons
    ];

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen); // Function to toggle side panel
    };

    const handleApprove = (id: string) => {
        // Update status to approved but don't remove it from the list
        setArticles(articles.map(article =>
            article.id === id ? { ...article, status: 'approved' } : article
        ));
    };

    const handleReject = (id: string) => {
        // Update status to rejected but don't remove it from the list
        setArticles(articles.map(article =>
            article.id === id ? { ...article, status: 'rejected' } : article
        ));
    };

    const handleSendToApprovalList = () => {
        // Filter only processed articles (approved or rejected)
        const newProcessedArticles = articles.filter(article => article.status !== 'pending');
        
        // Remove processed articles from the original list
        const remainingArticles = articles.filter(article => article.status === 'pending');
        setArticles(remainingArticles); // Update the articles to only keep pending ones
    
        // Redirect to the approval list page, sending the processed articles
        router.push({
            pathname: '/approvalList',
            query: { articles: JSON.stringify(newProcessedArticles) }, // Send articles as query parameter
        });
    };
    
    // Only display pending articles in the table
    const tableData = articles.map(article => ({
        ...article,
        actions: (
            <div className={styles.actionButtons}>
                <button className={styles.approveButton} onClick={() => handleApprove(article.id)}>Approve</button>
                <button className={styles.rejectButton} onClick={() => handleReject(article.id)}>Reject</button>
            </div>
        ),
    }));

    return (
        <div className={styles.container}>
            {/* Side Panel */}
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}

            <h1>Submitted Articles</h1>
            <SortableTable headers={headers} data={tableData} />

            <button onClick={handleSendToApprovalList} className={styles.sendButton}>
                Send to Approval List
            </button>
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}>
                {/* Empty button */}
            </button>
        </div>
    );
};

export default SubmissionList;
