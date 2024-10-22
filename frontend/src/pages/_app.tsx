// src/pages/_app.tsx
import "../styles/globals.scss"; 
import type { AppProps } from "next/app";
import PopulatedNavBar from "../components/PopulatedNavBar"; // Assuming this renders NavBar
import { UserTypeProvider } from "../context/userType"; // Import UserTypeProvider
import { useState } from "react"; // Import useState

function MyApp({ Component, pageProps }: AppProps) {
    const [isEditMode, setIsEditMode] = useState(false); // State for edit mode

    // Function to toggle edit mode
    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
    };

    return (
        <UserTypeProvider>
            <PopulatedNavBar isEditMode={isEditMode} toggleEditMode={toggleEditMode} /> {/* Pass props here */}
            <Component {...pageProps} isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
        </UserTypeProvider>
    );
}

export default MyApp;
