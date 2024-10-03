import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from './Nav.module.scss';
import { useUserType } from '../../context/userType'; // Import context

const SidePanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const router = useRouter();
    const { userType } = useUserType(); // Get the user type from context

    const handleHomeClick = () => {
        router.push('/'); // Navigate to the index page (home)
    };

    const handleSubmissionForm = () => {
        router.push('/SubmissionForm'); // Navigate to the index page (home)
    };

    const handleSubmissionList = () => {
        router.push('/SubmissionList'); // Navigate to the Submission List page
    };

    const handleApprovalList = () => {
        router.push('/ApprovalList'); // Navigate to the Submission List page
    };

    return (
        <div className={styles.sidePanel}>
            <button className={styles.homeButton} onClick={handleHomeClick}>
                <span className={styles.tooltip}>Home</span>
            </button>

            <button className={styles.submitButton} onClick={handleSubmissionForm}>
                <span className={styles.tooltip}>Submit Article</span>
            </button>

            {/* Show button only for 'moderator_user' and 'admin_user' */}
            {(userType === 'moderator_user' || userType === 'admin_user') && (
                <button className={styles.queueButton} onClick={handleSubmissionList}>
                    <span className={styles.tooltip}>Article Submission List</span>
                </button>
            )}

            {/* Show button only for 'analyst_user' and 'admin_user' */}
            {(userType === 'analyst_user' || userType === 'admin_user') && (
                <button className={styles.approvalListButton} onClick={handleApprovalList}>
                    <span className={styles.tooltip}>Article Approval List</span>
                </button>
            )}

            {/* Show button only for 'admin_user' */}
            {(userType === 'admin_user') && (
                <button className={styles.settingsButton} onClick={handleApprovalList}>
                    <span className={styles.tooltip}>Configure</span>
                </button>
            )}
        </div>
    );
};

export default SidePanel;
