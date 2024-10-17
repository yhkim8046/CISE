import React, { useEffect, useState } from 'react';
import styles from '../styles/approval.module.scss';
import SidePanel from '../components/nav/SidePanel';
import sidePanelStyles from '../styles/sidepanel.module.scss';

// Article interface
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
                const storedReviewedArticles = JSON.parse(localStorage.getItem('reviewedArticles') || '[]');
                setArticles(storedReviewedArticles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const handleCheckboxChange = (id: string) => {
        setSelectedArticles(prev => ({
            ...prev,
            [id]: !prev[id], // Toggle the selection state
        }));
    };

    const handleSubmitToDatabase = async () => {
        const articlesToSubmit = Object.keys(selectedArticles).filter(id => selectedArticles[id]).map(id => ({
            id, // The article id
            evidence: evidenceInput[id] || '' // The associated evidence
        }));

        if (articlesToSubmit.length === 0) {
            alert('No articles selected for submission.');
            return;
        }

        try {
            const response = await fetch('/api/articles/submit-reviewed', {
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

            // Optionally, you can reset the selected articles and evidence inputs here
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
                            <tr key={article.id}>
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
                                        value={evidenceInput[article.id] || ''}
                                        onChange={(e) => setEvidenceInput({ ...evidenceInput, [article.id]: e.target.value })}
                                        placeholder="Write details here..."
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={!!selectedArticles[article.id]}
                                        onChange={() => handleCheckboxChange(article.id)}
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
