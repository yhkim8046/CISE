// src/pages/_app.tsx
import "../styles/globals.scss"; 
import type { AppProps } from "next/app";
import PopulatedNavBar from "../components/PopulatedNavBar"; // Assuming this renders NavBar
import { UserTypeProvider } from "../context/userType"; // Import UserTypeProvider
import { useState } from "react"; // Import useState
import { useRouter } from "next/router"; // Import useRouter

function MyApp({ Component, pageProps }: AppProps) {
    const [isEditMode, setIsEditMode] = useState(false); // State for edit mode
    const router = useRouter(); // Initialize router
    const isIndexPage = router.pathname === '/'; // Check if the current path is the index page

    // Function to toggle edit mode
    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
    };

    return (
        <UserTypeProvider>
            {/* Render PopulatedNavBar only if not on the index page */}
            {!isIndexPage && (
                <PopulatedNavBar isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
            )}
            <Component {...pageProps} isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
        </UserTypeProvider>
    );
}

export default MyApp;
