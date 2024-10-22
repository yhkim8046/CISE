import React, { useEffect, useState } from 'react';
import styles from '../styles/approval.module.scss';
import SidePanel from '../components/nav/SidePanel';
import sidePanelStyles from '../styles/sidepanel.module.scss';

// Article interface defining the structure of article data
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
    const [articles, setArticles] = useState<Article[]>([]); // State to hold articles
    const [loading, setLoading] = useState(true); // State for loading status
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); // State for side panel visibility
    const [evidenceInput, setEvidenceInput] = useState<{ [key: string]: string }>({}); // State to hold evidence inputs
    const [selectedArticles, setSelectedArticles] = useState<{ [key: string]: boolean }>({}); // State to hold selected articles

    useEffect(() => {
        // Function to fetch articles from the backend
        const fetchArticles = async () => {
            setLoading(true); // Set loading state
            try {
                const response = await fetch('http://localhost:8082/api/articles'); // Fetch all articles from the backend
                if (!response.ok) {
                    throw new Error('Failed to fetch articles'); // Handle fetch error
                }
                const data: Article[] = await response.json(); // Parse JSON response
                
                // Filter to only include articles with status 'Approved'
                const approvedArticles = data.filter(article => article.status === 'Approved');
                setArticles(approvedArticles); // Update articles state with approved articles
            } catch (error) {
                console.error('Error fetching articles:', error); // Log fetch error
            } finally {
                setLoading(false); // Set loading state to false
            }
        };
        fetchArticles(); // Call the fetch function
    }, []); // Empty dependency array to run once on mount

    // Function to handle checkbox state change
    const handleCheckboxChange = (_id: string) => {
        setSelectedArticles(prev => ({
            ...prev,
            [_id]: !prev[_id], // Toggle the selection state
        }));
    };

    // Function to handle changes in evidence input
    const handleEvidenceChange = (_id: string, value: string) => {
        setEvidenceInput(prev => ({
            ...prev,
            [_id]: value, // Update evidence for the specific article
        }));
    };

    // Function to submit selected articles and their evidence to the database
    const handleSubmitToDatabase = async () => {
        // Prepare articles to submit based on selected checkboxes
        const articlesToSubmit = Object.keys(selectedArticles)
            .filter(_id => selectedArticles[_id]) // Filter selected articles
            .map(_id => ({
                _id, // The article id
                evidence: evidenceInput[_id] || '' // The associated evidence
            }));

        if (articlesToSubmit.length === 0) {
            alert('No articles selected for submission.'); // Alert if no articles are selected
            return;
        }

        try {
            const response = await fetch('http://localhost:8082/api/articles/submitReviewed', {
                method: 'POST', // Set request method to POST
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify({ articles: articlesToSubmit }), // Send data as JSON
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText); // Handle response error
            }

            const data = await response.json(); // Parse the JSON response
            console.log('Successfully submitted articles:', data); // Log success

            // Update the articles state to remove submitted articles
            setArticles(prev => prev.filter(article => !articlesToSubmit.some(submitted => submitted._id === article._id)));

            // Reset the selected articles and evidence inputs here
            setSelectedArticles({}); // Clear selected articles
            setEvidenceInput({}); // Clear evidence inputs
            alert('Articles successfully submitted to the database!'); // Alert success
        } catch (error) {
            console.error('Error submitting articles:', error); // Log submission error
            alert('There was an error submitting the articles. Please try again.'); // Alert failure
        }
    };

    // Display loading message while fetching articles
    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            {isSidePanelOpen && <SidePanel onClose={() => setIsSidePanelOpen(false)} onToggleEditMode={function (): void {
            } } />}
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
                                        value={evidenceInput[article._id] || ''} // Set textarea value
                                        onChange={(e) => handleEvidenceChange(article._id, e.target.value)} // Pass the value directly
                                        placeholder="Write details here..." // Placeholder text
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={!!selectedArticles[article._id]} // Set checkbox checked state
                                        onChange={() => handleCheckboxChange(article._id)} // Handle checkbox change
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                className={styles.submitButton}
                onClick={handleSubmitToDatabase} // Handle submission button click
            >
                Submit Selected Articles to Database
            </button>
        </div>
    );
};

export default ApprovalList;
