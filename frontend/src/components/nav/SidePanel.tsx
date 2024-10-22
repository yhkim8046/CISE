import React from 'react';
import { useRouter } from 'next/router';
import styles from './Nav.module.scss';
import { useUserType } from '../../context/userType';

interface SidePanelProps {
    onToggleEditMode: () => void; // Add the prop for toggling edit mode
    onClose: () => void; // Existing close prop
}

const SidePanel: React.FC<SidePanelProps> = ({}) => {
    const router = useRouter();
    const { userType } = useUserType();

    const handleHomeClick = () => {
        router.push('/'); 
    };

    const handleSubmissionForm = () => {
        router.push('/SubmissionForm'); 
    };

    const handleSubmissionList = () => {
        router.push('/SubmissionList'); 
    };

    const handleApprovalList = () => {
        router.push('/ApprovalList'); 
    };

    return (
        <div className={styles.sidePanel}>
            <button className={styles.homeButton} onClick={handleHomeClick}>
                <span className={styles.tooltip}>Home</span>
            </button>

            <button className={styles.submitButton} onClick={handleSubmissionForm}>
                <span className={styles.tooltip}>Submit Article</span>
            </button>

            {(userType === 'moderator_user' || userType === 'admin_user') && (
                <button className={styles.queueButton} onClick={handleSubmissionList}>
                    <span className={styles.tooltip}>Article Submission List</span>
                </button>
            )}

            {(userType === 'analyst_user' || userType === 'admin_user') && (
                <button className={styles.approvalListButton} onClick={handleApprovalList}>
                    <span className={styles.tooltip}>Article Approval List</span>
                </button>
            )}
        </div>
    );
};

export default SidePanel;
