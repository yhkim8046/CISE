import React, { useState } from 'react'; 
import { useForm, SubmitHandler } from "react-hook-form";
import styles from '../styles/Form.module.scss';
import SidePanel from '../components/nav/SidePanel'; 
import sidePanelStyles from '../styles/sidepanel.module.scss'; 

interface Article {
    // id: string;  
    title: string;
    author: string;  // Changed from authors to author
    yearOfPublication: number;
    pages?: number;
    volume?: number;
    doi?: string;
    claim: string;
    typeOfResearch: 'Case Study' | 'Experiment'; // Enum values
    typeOfParticipant: 'Student' | 'Practitioner'; // Enum values
}

interface FormValues {
    title: string;
    author: string;  // Changed from authors to author
    yearOfPublication: number;
    pages?: number;
    volume?: number;
    doi: string;
    claim: string;
    typeOfResearch: 'Case Study' | 'Experiment'; // Enum values
    typeOfParticipant: 'Student' | 'Practitioner'; // Enum values
}

const SubmissionForm: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
    const [isSidePanelOpen, setSidePanelOpen] = useState(false); 
    const [submitted, setSubmitted] = useState(false);  
    const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages

    const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log("Submitted data:", data); // Log the submitted data for debugging
    
        const newArticle: Article = {
            // No need to manually assign an id, MongoDB will generate one
            // id: `article-${Date.now()}`, // Remove this line
            title: data.title,
            author: data.author,  // Use the corrected field name
            yearOfPublication: data.yearOfPublication,
            pages: data.pages,
            volume: data.volume,
            doi: data.doi,
            claim: data.claim,
            typeOfResearch: data.typeOfResearch,
            typeOfParticipant: data.typeOfParticipant,
        };
    
        try {
            const response = await fetch('https://cise-backend-nine.vercel.app/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newArticle),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error response:', errorResponse); // Log the error response for debugging
                throw new Error(errorResponse.message || 'Failed to submit article');
            }
    
            reset(); // Clear form
            setSubmitted(true); // Show submission success message
            setErrorMessage(''); // Clear any previous error messages
        } catch (error) {
            console.error('Error submitting article:', error); // Log the error
            setErrorMessage('Failed to submit article. Please try again.'); // Update error message state
        }
    };
    

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    return (
        <div className={styles.formContainer}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} onToggleEditMode={function (): void {
            } } />}
            <button onClick={toggleSidePanel} className={sidePanelStyles.togglePanelButton}></button>
            
            <h1 className={styles.formTitle}>Submit an Article</h1>

            {submitted && <p className={styles.confirmationMessage}>Article submitted successfully!</p>}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} {/* Display error message */}

            <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
                <div className={styles.formItem}>
                    <input 
                        {...register("title", { required: true })} 
                        placeholder="Title" 
                        className={styles.inputField} 
                        required
                    />
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("author", { required: true })}  // Use the corrected field name
                        placeholder="Author"  // Change the placeholder to match the field name
                        className={styles.inputField} 
                        required
                    />
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("yearOfPublication", { 
                            required: true, 
                            min: 1900, 
                            max: new Date().getFullYear(),
                        })} 
                        type="number" 
                        placeholder="Year of Publication" 
                        className={styles.inputField} 
                        required
                    />
                </div>

                <div className={styles.formItem}>
                    <input {...register("pages")} type="number" placeholder="Pages (optional)" className={styles.inputField} />
                </div>

                <div className={styles.formItem}>
                    <input {...register("volume")} type="number" placeholder="Volume (optional)" className={styles.inputField} />
                </div>
                
                <div className={styles.formItem}>
                    <input 
                        {...register("doi", { required: true })} 
                        placeholder="DOI" 
                        className={styles.inputField} 
                        required
                    />
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("claim", { required: true })} 
                        placeholder="Claim" 
                        className={styles.inputField} 
                        required
                    />
                </div>

                <div className={styles.formItem}>
                    <select 
                        {...register("typeOfResearch", { required: true })} 
                        className={styles.inputField}
                    >
                        <option value="">Select Type of Research</option>
                        <option value="Case Study">Case Study</option>
                        <option value="Experiment">Experiment</option>
                    </select>
                    {errors.typeOfResearch && <p className={styles.errorMessage}>This field is required</p>}
                </div>

                <div className={styles.formItem}>
                    <select 
                        {...register("typeOfParticipant", { required: true })} 
                        className={styles.inputField}
                    >
                        <option value="">Select Type of Participant</option>
                        <option value="Student">Student</option>
                        <option value="Practitioner">Practitioner</option>
                    </select>
                    {errors.typeOfParticipant && <p className={styles.errorMessage}>This field is required</p>}
                </div>

                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
        </div>
    );
};

export default SubmissionForm;
