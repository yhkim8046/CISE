import React, { useState } from 'react'; 
import { useForm, SubmitHandler } from "react-hook-form";
import styles from '../styles/Form.module.scss';
import SidePanel from '../components/nav/SidePanel'; 
import sidePanelStyles from '../styles/sidepanel.module.scss'; 

interface Article {
    id: string;  
    title: string;
    authors: string;
    yearOfPublication: number;
    pages?: number;
    volume?: number;
    doi?: string;
    claim: string;
    typeOfResearch: string;
    typeOfParticipant: string;
    status: 'Pending'; 
}

interface FormValues {
    title: string;
    authors: string;
    yearOfPublication: number;
    pages?: number;
    volume?: number;
    doi: string;
    claim: string;
    typeOfResearch: string;
    typeOfParticipant: string;
}

const SubmissionForm: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const [isSidePanelOpen, setSidePanelOpen] = useState(false); 
    const [submitted, setSubmitted] = useState(false);  

    const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
        const newArticle: Article = {
            id: `article-${Date.now()}`, // Temporary ID for frontend, should be handled by the backend
            title: data.title,
            authors: data.authors,
            yearOfPublication: data.yearOfPublication,
            pages: data.pages,
            volume: data.volume,
            doi: data.doi,
            claim: data.claim,
            typeOfResearch: data.typeOfResearch,
            typeOfParticipant: data.typeOfParticipant,
            status: 'Pending',
        };

        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newArticle),
            });

            if (!response.ok) {
                throw new Error('Failed to submit article');
            }

            reset(); // Clear form
            setSubmitted(true); // Show submission success message
        } catch (error) {
            console.error('Error submitting article:', error);
            alert('There was an error submitting the article. Please try again.');
        }
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    return (
        <div className={styles.formContainer}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}
            <button onClick={toggleSidePanel} className={sidePanelStyles.togglePanelButton}></button>
            
            <h1 className={styles.formTitle}>Submit an Article</h1>

            {submitted && <p className={styles.confirmationMessage}>Article submitted successfully!</p>}

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
                        {...register("authors", { required: true })} 
                        placeholder="Authors" 
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
                    <input 
                        {...register("typeOfResearch", { required: true })} 
                        placeholder="Type of Research" 
                        className={styles.inputField} 
                        required
                    />
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("typeOfParticipant", { required: true })} 
                        placeholder="Type of Participant" 
                        className={styles.inputField} 
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
        </div>
    );
};

export default SubmissionForm;
