import { useEffect, useState } from 'react';
import SortableTable from '../components/table/SortableTable';

interface Article {
    _id: string;
    title: string;
    authors: string; // Assuming authors is a string; adjust as needed
    source: string; // Assuming source is a string; adjust as needed
    yearOfPublication: number;
    doi: string; // Assuming DOI is a string; adjust as needed
    claim: string; // Assuming claim is a string; adjust as needed
    evidence: string; // Assuming evidence is a string; adjust as needed
}

const ArticlesPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/articles/');
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data = await response.json();
                setArticles(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Define headers for the table
    const headers = [
        { key: 'title', label: 'Title' },
        { key: 'authors', label: 'Authors' },
        { key: 'source', label: 'Source' },
        { key: 'yearOfPublication', label: 'Publication Year' },
        { key: 'doi', label: 'DOI' },
        { key: 'claim', label: 'Claim' },
        { key: 'evidence', label: 'Evidence' },
    ];

    // Handler for search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <h1>Articles</h1>
            <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <SortableTable
                headers={headers}
                data={articles}
                searchTerm={searchTerm} // Pass the search term here
            />
        </div>
    );
};

export default ArticlesPage;
