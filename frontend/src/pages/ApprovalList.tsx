import React, { useEffect, useState } from 'react';
import styles from '../styles/approval.module.scss';
import SidePanel from '../components/nav/SidePanel';
import sidePanelStyles from '../styles/sidepanel.module.scss';

// Article interface
interface Article {
    _id: string;
    title: string;
    authors: string;
    source: string;
    yearOfPublication: number;
    pages?: number;
    volume?: number;
    doi?: string;
    claim: string;
    evidence: string; // Added for clarity, may not be in the database initially
    typeOfResearch?: string;
    typeOfParticipant?: string;
    status?: 'Approved' | 'Rejected' | 'Pending'; // Ensure status is included in the type
}

const ApprovalList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [evidenceInput, setEvidenceInput] = useState<{ [key: string]: string }>({});
    const [selectedArticles, setSelectedArticles] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8082/api/articles'); // Fetch all articles from the backend
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data: Article[] = await response.json();
                
                // Filter to only include articles with status 'Approved'
                const approvedArticles = data.filter(article => article.status === 'Approved');
                setArticles(approvedArticles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const handleCheckboxChange = (_id: string) => {
        setSelectedArticles(prev => ({
            ...prev,
            [_id]: !prev[_id], // Toggle the selection state
        }));
    };

    const handleEvidenceChange = (_id: string, value: string) => {
        setEvidenceInput(prev => ({
            ...prev,
            [_id]: value, // Update evidence for the specific article
        }));
    };

    const handleSubmitToDatabase = async () => {
        const articlesToSubmit = Object.keys(selectedArticles)
            .filter(_id => selectedArticles[_id])
            .map(_id => ({
                _id, // The article id
                evidence: evidenceInput[_id] || '' // The associated evidence
            }));

        if (articlesToSubmit.length === 0) {
            alert('No articles selected for submission.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8082/api/articles/submitReviewed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify({ articles: articlesToSubmit }), // Send data as JSON
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json(); // Parse the JSON response
            console.log('Successfully submitted articles:', data);

            // Update the articles state to remove submitted articles
            setArticles(prev => prev.filter(article => !articlesToSubmit.some(submitted => submitted._id === article._id)));

            // Reset the selected articles and evidence inputs here
            setSelectedArticles({});
            setEvidenceInput({});
            alert('Articles successfully submitted to the database!');
        } catch (error) {
            console.error('Error submitting articles:', error);
            alert('There was an error submitting the articles. Please try again.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            {isSidePanelOpen && <SidePanel onClose={() => setIsSidePanelOpen(false)} />}
            <button className={sidePanelStyles.togglePanelButton} onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}></button>
            <h1>Approval Queue</h1>
            <div className={styles.contentWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Authors</th>
                            <th>Source</th>
                            <th>Year of Publication</th>
                            <th>Pages</th>
                            <th>Volume</th>
                            <th>DOI</th>
                            <th>Claim</th>
                            <th>Evidence</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr key={article._id}>
                                <td>{article.title}</td>
                                <td>{article.authors}</td>
                                <td>{article.source}</td>
                                <td>{article.yearOfPublication}</td>
                                <td>{article.pages}</td>
                                <td>{article.volume}</td>
                                <td>{article.doi}</td>
                                <td>{article.claim}</td>
                                <td>
                                    <textarea
                                        className={styles.evidenceTextBox}
                                        value={evidenceInput[article._id] || ''}
                                        onChange={(e) => handleEvidenceChange(article._id, e.target.value)} // Pass the value directly
                                        placeholder="Write details here..."
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={!!selectedArticles[article._id]}
                                        onChange={() => handleCheckboxChange(article._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                className={styles.submitButton}
                onClick={handleSubmitToDatabase}
            >
                Submit Selected Articles to Database
            </button>
        </div>
    );
};

export default ApprovalList;
