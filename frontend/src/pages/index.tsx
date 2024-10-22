import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SortableTable from '../components/table/SortableTable';
import SidePanel from '../components/nav/SidePanel';
import Rating from '../components/Rating';
import indexStyles from '../styles/index.module.scss';
import sidePanelStyles from '../styles/sidepanel.module.scss';
import searchIcon from '../images/search.png';
import { useUserType } from '../context/userType';

interface ArticlesInterface {
    _id: string; 
    title: string;
    author: string;
    yearOfPublication: number | null;
    doi: string;
    pages: number;
    claim: string;
    typeOfResearch: string;
    typeOfParticipant: string;
    evidence?: string;
    rating?: number; 
    totalRating: number; 
    averageRating: number; 
    ratingCounter: number; 
    submittedDate: string; 
}

const Index: React.FC = () => {
    const { userType } = useUserType(); // Get the current user type from context
    const [isSidePanelOpen, setSidePanelOpen] = useState(false); // State to manage side panel visibility
    const [searchTerm, setSearchTerm] = useState(''); // State for the search input
    const [articles, setArticles] = useState<ArticlesInterface[]>([]); // State for storing articles
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState<string | null>(null); // State for error handling
    const [visibleColumns, setVisibleColumns] = useState<string[]>(['title', 'author', 'yearOfPublication', 'claim', 'evidence', 'rating', 'ratingCounter', 'averageRating', 'submittedDate']); // State for visible columns in the table
    const [savedQueries, setSavedQueries] = useState<string[]>([]); // State for saved queries
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

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
        { key: 'submittedDate', label: 'Submission Date' },
        { key: 'rating', label: 'Rating' },
    ];

    // Fetch articles from the API on component mount
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const response = await fetch('http://localhost:8082/api/articles/');
                if (!response.ok) {
                    throw new Error('Failed to fetch articles'); // Handle fetch error
                }
                const data: ArticlesInterface[] = await response.json();
                setArticles(data); // Set fetched articles to state
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred'); // Set error message
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchArticles();
    }, []);

    // Navigate to the submission form
    const handleSubmit = () => {
        router.push('/SubmissionForm');
    };

    // Navigate to the submission list
    const handleSubmissionList = () => {
        router.push('/SubmissionList');
    };

    // Navigate to the approval list
    const handleApprovalList = () => {
        router.push('/ApprovalList');
    };

    // Toggle the visibility of the side panel
    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    // Handle search input changes
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Function to save the current search term
    const saveSearchQuery = () => {
        if (searchTerm && !savedQueries.includes(searchTerm)) {
            setSavedQueries(prevQueries => [...prevQueries, searchTerm]);
        }
    };

    // Filter articles based on the search term
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.typeOfResearch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.typeOfParticipant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.submittedDate && article.submittedDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (article.yearOfPublication !== null && article.yearOfPublication.toString().includes(searchTerm)) ||
        (article.evidence && article.evidence.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Toggle the visibility of a column in the table
    const toggleColumn = (column: string) => {
        setVisibleColumns(prev => 
            prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
        );
    };

    // Handle rating change for an article
    const handleRatingChange = async (articleId: string, newRating: number) => {
        try {
            const updatedArticle = await updateArticleRating(articleId, newRating);
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article._id === articleId
                        ? { ...article, rating: newRating, totalRating: article.totalRating + newRating, ratingCounter: article.ratingCounter + 1, averageRating: (article.totalRating + newRating) / (article.ratingCounter + 1) }
                        : article
                )
            );
        } catch (error) {
            console.error("Error updating rating:", error); // Log error if updating rating fails
        }
    };

    // Update article rating on the server
    async function updateArticleRating(articleId: string, newRating: number) {
        const response = await fetch(`http://localhost:8082/api/articles/${articleId}/rate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating: newRating }),
        });

        if (!response.ok) {
            throw new Error('Failed to update article rating'); // Handle update error
        }
        return await response.json(); // Return updated article data
    }

    // Toggle dropdown visibility for saved queries
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Loading state
    if (loading) return <div className={indexStyles.loading}>Loading articles...</div>;
    // Error state
    if (error) return <div className={indexStyles.error}>Error: {error}</div>;

    return (
        <div className={indexStyles.pageContainer}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}
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
                        <button className={indexStyles.searchButton} onClick={saveSearchQuery}>
                            <Image src={searchIcon} alt="Search" width={16} height={16} />
                        </button>
                        {/* Saved Queries Dropdown */}
                        <div className={indexStyles.savedQueriesDropdown}>
                            <button className={indexStyles.dropdownButton} onClick={toggleDropdown}>
                                Saved Queries
                            </button>
                            {dropdownOpen && (
                                <ul className={indexStyles.dropdownList}>
                                    {savedQueries.length > 0 ? (
                                        savedQueries.map((query, index) => (
                                            <li key={index} onClick={() => setSearchTerm(query)} style={{ cursor: 'pointer' }}>
                                                {query}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No saved queries</li>
                                    )}
                                </ul>
                            )}
                        </div>
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

                <SortableTable 
                    headers={headers.filter(header => visibleColumns.includes(header.key))} 
                    data={filteredArticles.map(article => ({
                        ...article,
                        submittedDate: new Date(article.submittedDate).toLocaleDateString(),
                        rating: (
                            
                            <Rating 
                                articleId={article._id}
                                currentRating={article.rating || 0}
                                ratingCounter={article.ratingCounter || 0} 
                                averageRating={article.averageRating || 0} 
                                onRatingChange={handleRatingChange} 
                            />
                        ),
                    }))} 
                />
            </div>
        </div>
    );
};

export default Index;
