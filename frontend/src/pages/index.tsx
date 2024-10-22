import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SortableTable from '../components/table/SortableTable';
import SidePanel from '../components/nav/SidePanel';
import Rating from '../components/Rating'; // Import the Rating component
import indexStyles from '../styles/index.module.scss';
import sidePanelStyles from '../styles/sidepanel.module.scss';
import searchIcon from '../images/search.png';
import { useUserType } from '../context/userType';

interface ArticlesInterface {
    _id: string; 
    title: string;
    author: string;
    yearOfPublication: number;
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
    const { userType } = useUserType();
    const [isSidePanelOpen, setSidePanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState<ArticlesInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(['title', 'author', 'yearOfPublication', 'claim', 'evidence', 'rating', 'ratingCounter', 'averageRating']);
    
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
    

    useEffect(() => {
        // Ensure submissionDate is fetched in your API call
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

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase())) // Check if author is defined
    );

    const toggleColumn = (column: string) => {
        setVisibleColumns(prev => 
            prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
        );
    };

    const handleRatingChange = async (articleId: string, newRating: number) => {
        try {
            const updatedArticle = await updateArticleRating(articleId, newRating);
            // Update the local state with the new rating data
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article._id === articleId
                        ? { ...article, rating: newRating, totalRating: article.totalRating + newRating, ratingCounter: article.ratingCounter + 1, averageRating: (article.totalRating + newRating) / (article.ratingCounter + 1) }
                        : article
                )
            );
        } catch (error) {
            console.error("Error updating rating:", error);
        }
    };

    async function updateArticleRating(articleId: string, newRating: number) {
        const response = await fetch(`http://localhost:8082/api/articles/${articleId}/rate`, {
            method: 'PATCH', // Change from PUT to PATCH
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating: newRating }), // Send only the rating for now
        });
    
        if (!response.ok) {
            throw new Error('Failed to update article rating');
        }
        return await response.json(); // Assuming the server returns the updated article
    }

    if (loading) return <div className={indexStyles.loading}>Loading articles...</div>;
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
        rating: (
            <Rating 
                articleId={article._id}
                currentRating={article.rating || 0}
                ratingCounter={article.ratingCounter || 0} // Pass ratingCounter
                averageRating={article.averageRating || 0} // Pass average rating
                onRatingChange={handleRatingChange} 
            />
        ),
        submittedDate: new Date(article.submittedDate).toLocaleDateString() // Format the date
    }))} 
    searchTerm={searchTerm} 
    showActions={false} 
/>

            </div>

            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}>
                {isSidePanelOpen ? '' : ''}
            </button>
        </div>
    );
};

export default Index;
