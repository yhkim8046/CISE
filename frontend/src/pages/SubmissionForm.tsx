import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import formStyles from '../styles/Form.module.scss'; // Import the form styles with a different name
import sidePanelStyles from '../styles/sidepanel.module.scss'; // Import the side panel styles
import SidePanel from '../components/nav/SidePanel';

export default function SubmissionForm() {
    const [isSidePanelOpen, setSidePanelOpen] = useState(false); // Side panel state
    const { register, handleSubmit } = useForm(); // Move the useForm hook out of the data state

    const onSubmit = (data: any) => {
        console.log(JSON.stringify(data)); // You can replace this with submission logic
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(!isSidePanelOpen); // Function to toggle side panel
    };

    return (
        <div className={formStyles.formContainer}>
            {/* Side Panel */}
            {isSidePanelOpen && <SidePanel onClose={toggleSidePanel} />}

            {/* Add the title for the form */}
            <h1 className={formStyles.formTitle}>Article Submission Form</h1>

            <form onSubmit={handleSubmit(onSubmit)} className={formStyles.form}>
                <p>
                    <input {...register("title")} placeholder="Title" className={formStyles.formItem} />
                </p>
                <p>
                    <input {...register("author")} placeholder="Author" className={formStyles.formItem} />
                </p>
                <p>
                    <input {...register("journal")} placeholder="Journal Name" className={formStyles.formItem} />
                </p>
                <p>
                    <input {...register("year")} placeholder="Year" className={formStyles.formItem} />
                </p>
                <p>
                    <input {...register("volume")} placeholder="Volume" className={formStyles.formItem} />
                </p>
                <p>
                    <input {...register("number")} placeholder="Number" className={formStyles.formItem} />
                </p>
                <p>
                    <input {...register("pages")} placeholder="Pages" className={formStyles.formItem} />
                </p>
                <p>
                    <input {...register("doi")} placeholder="DOI" className={formStyles.formItem} />
                </p>
                <input type="submit" value="Submit" className={formStyles.submitButton} />
            </form>

            {/* Button to toggle side panel */}
            <button className={sidePanelStyles.togglePanelButton} onClick={toggleSidePanel}>
                {isSidePanelOpen ? '' : ''}
            </button>
        </div>
    );
}
