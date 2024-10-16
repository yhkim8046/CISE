import React, { useState } from 'react'; 
import { useForm, FieldError, SubmitHandler } from "react-hook-form";
import styles from '../styles/Form.module.scss';
import SidePanel from '../components/nav/SidePanel'; 
import sidePanelStyles from '../styles/sidepanel.module.scss'; 

interface Article {
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

interface FormValues {
    title: string;
    authors: string;
    source: string;
    yearOfPublication: number;
    pages?: number;
    volume?: number;
    doi: string;
    claim: string;
    evidence: string;
    typeOfResearch?: string;
    typeOfParticipant?: string;
}

const SubmissionForm: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
    const [isSidePanelOpen, setSidePanelOpen] = useState(false); 
    const [submitted, setSubmitted] = useState(false);  // Track form submission

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => {
                if (error) alert((error as FieldError).message); // Display error message as a popup
            });
            return; // Stop the form submission if there are errors
        }

        const newArticle: Article = {
            title: data.title,
            authors: data.authors,
            source: data.source,
            yearOfPublication: data.yearOfPublication,
            pages: data.pages,
            volume: data.volume,
            doi: data.doi,
            claim: data.claim,
            evidence: data.evidence,
            typeOfResearch: data.typeOfResearch,
            typeOfParticipant: data.typeOfParticipant,
        };

        const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
        existingArticles.push(newArticle);
        localStorage.setItem('articles', JSON.stringify(existingArticles));
        reset();
        setSubmitted(true); // Set confirmation after submission
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen);
    };

    return (
        <div className={styles.formContainer}>
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}
            <button onClick={toggleSidePanel} className={sidePanelStyles.togglePanelButton}></button>
            
            <h1 className={styles.formTitle}>Submit an Article</h1>

            {/* Show a confirmation message when the form is successfully submitted */}
            {submitted && <p className={styles.confirmationMessage}>Article submitted successfully!</p>}

            <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>

                <div className={styles.formItem}>
                    <input 
                        {...register("title", { required: "Title is required" })} 
                        placeholder="Title" 
                        className={styles.inputField} 
                    />
                    {errors.title && <p>{errors.title.message}</p>}
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("authors", { required: "Authors are required" })} 
                        placeholder="Authors" 
                        className={styles.inputField} 
                    />
                    {errors.authors && <p>{errors.authors.message}</p>}
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("source", { required: "Source is required" })} 
                        placeholder="Source" 
                        className={styles.inputField} 
                    />
                    {errors.source && <p>{errors.source.message}</p>}
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("yearOfPublication", { 
                            required: "Year of Publication is required", 
                            min: { value: 1900, message: "Year must be after 1900" },
                            max: { value: new Date().getFullYear(), message: "Year must not be in the future" }
                        })} 
                        type="number" 
                        placeholder="Year of Publication" 
                        className={styles.inputField} 
                    />
                    {errors.yearOfPublication && <p>{errors.yearOfPublication.message}</p>}
                </div>

                {/* Optional fields */}
                <div className={styles.formItem}>
                    <input {...register("pages")} type="number" placeholder="Pages (optional)" className={styles.inputField} />
                </div>
                <div className={styles.formItem}>
                    <input {...register("volume")} type="number" placeholder="Volume (optional)" className={styles.inputField} />
                </div>
                
                <div className={styles.formItem}>
                    <input 
                        {...register("doi", { required: "DOI is required" })} 
                        placeholder="DOI" 
                        className={styles.inputField} 
                    />
                    {errors.doi && <p>{errors.doi.message}</p>}
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("claim", { required: "Claim is required" })} 
                        placeholder="Claim" 
                        className={styles.inputField} 
                    />
                    {errors.claim && <p>{errors.claim.message}</p>}
                </div>

                <div className={styles.formItem}>
                    <input 
                        {...register("evidence", { required: "Evidence is required" })} 
                        placeholder="Evidence" 
                        className={styles.inputField} 
                    />
                    {errors.evidence && <p>{errors.evidence.message}</p>}
                </div>

                <div className={styles.formItem}>
                    <input {...register("typeOfResearch")} placeholder="Type of Research (optional)" className={styles.inputField} />
                </div>

                <div className={styles.formItem}>
                    <input {...register("typeOfParticipant")} placeholder="Type of Participant (optional)" className={styles.inputField} />
                </div>

                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
        </div>
    );
};

export default SubmissionForm;
