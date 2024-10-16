import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SortableTable from '../components/table/SortableTable';
import SidePanel from '../components/nav/SidePanel';
import indexStyles from '../styles/index.module.scss';
import sidePanelStyles from '../styles/sidepanel.module.scss';
import searchIcon from '../images/search.png';
import { useUserType } from '../context/userType';

// Define the interface for the articles
interface ArticlesInterface {
    id: string; // Assuming this matches the MongoDB ObjectId
    title: string;
    author: string; // Renamed to match your data structure
    yearOfPublication: number; // Changed to match the SQL field
    doi: string;
    pages: number;
    claim: string;
    typeOfResearch: string;
    typeOfParticipant: string;
    evidence?: string; // Assuming 'evidence' may not always be present
}

const IndexPage: React.FC = () => {
    const { userType } = useUserType();
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState<ArticlesInterface[]>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [visibleColumns, setVisibleColumns] = useState<string[]>(['title', 'author', 'yearOfPublication', 'claim', 'evidence']); // Columns to display

    const router = useRouter();

    const headers: { key: keyof ArticlesInterface; label: string }[] = [
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Authors' },
        { key: 'yearOfPublication', label: 'Publication Year' },
        { key: 'doi', label: 'DOI' },
        { key: 'pages', label: 'Pages' },
        { key: 'claim', label: 'Claim' },
        { key: 'typeOfResearch', label: 'Type' },
        { key: 'typeOfParticipant', label: 'Participant' },
        { key: 'evidence', label: 'Evidence' },
    ];

    // Fetch articles from the database
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8082/api/articles/');
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data: ArticlesInterface[] = await response.json();
                setArticles(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

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

    // Filter articles based on the search term
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleColumn = (column: string) => {
        setVisibleColumns(prev => 
            prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
        );
    };

    if (loading) return <div className={indexStyles.loading}>Loading articles...</div>; // Loading state
    if (error) return <div className={indexStyles.error}>Error: {error}</div>; // Error state

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
                        {(userType === 'moderator_user' || userType === 'admin_user') && (
                            <button className={indexStyles.moderatorButton} onClick={handleSubmissionList}>
                                Submission List
                            </button>
                        )}
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

                {/* Column Selection */}
                <div className={indexStyles.columnSelection}>
                    {headers.map(header => (
                        <label key={header.key}>
                            <input
                                type="checkbox"
                                checked={visibleColumns.includes(header.key)}
                                onChange={() => toggleColumn(header.key)}
                            />
                            {header.label}
                        </label>
                    ))}
                </div>

                {/* Articles Table */}
                <SortableTable 
                    headers={headers.filter(header => visibleColumns.includes(header.key))} 
                    data={filteredArticles} 
                    searchTerm={searchTerm} 
                    showActions={false} 
                />
            </div>

            {/* Button to toggle side panel */}
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}>
                {isSidePanelOpen ? '' : ''}
            </button>
        </div>
    );
};

export default IndexPage;
