import React, { useState } from 'react';

const SubmissionForm: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '', // keep as a string
        yearOfPublication: '',
        pages: '',
        volume: '',
        doi: '',
        claim: '',
        typeOfResearch: 'Case Study', // default value
        typeOfParticipant: 'Student', // default value
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const dataToSubmit = {
            ...formData,
            authors: formData.author.split(',').map(author => author.trim()).join('; '),
            yearOfPublication: Number(formData.yearOfPublication),
            pages: formData.pages ? Number(formData.pages) : undefined,
            volume: formData.volume ? Number(formData.volume) : undefined,
        };
    
        console.log('Data to submit:', dataToSubmit); // Log the data before sending
    
        try {
            const response = await fetch('http://localhost:8082/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Backend error:', errorResponse);
                throw new Error(`Failed to submit the article: ${errorResponse.error}`);
            }
    
            alert('Article submitted successfully!');
        } catch (error) {
            console.error('Error submitting article:', error);
        }
    };
    

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="author">Authors (comma-separated)</label>
                <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                />
                <small>Enter authors separated by commas.</small>
            </div>

            <div>
                <label htmlFor="yearOfPublication">Year of Publication</label>
                <input
                    type="number"
                    id="yearOfPublication"
                    name="yearOfPublication"
                    value={formData.yearOfPublication}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="pages">Pages</label>
                <input
                    type="number"
                    id="pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label htmlFor="volume">Volume</label>
                <input
                    type="number"
                    id="volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label htmlFor="doi">DOI</label>
                <input
                    type="url"
                    id="doi"
                    name="doi"
                    value={formData.doi}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label htmlFor="claim">Claim</label>
                <textarea
                    id="claim"
                    name="claim"
                    value={formData.claim}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="typeOfResearch">Type of Research</label>
                <select
                    id="typeOfResearch"
                    name="typeOfResearch"
                    value={formData.typeOfResearch}
                    onChange={handleInputChange}
                    required
                >
                    <option value="Case Study">Case Study</option>
                    <option value="Experiment">Experiment</option>
                </select>
            </div>

            <div>
                <label htmlFor="typeOfParticipant">Type of Participant</label>
                <select
                    id="typeOfParticipant"
                    name="typeOfParticipant"
                    value={formData.typeOfParticipant}
                    onChange={handleInputChange}
                    required
                >
                    <option value="Student">Student</option>
                    <option value="Practitioner">Practitioner</option>
                </select>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};

export default SubmissionForm;
