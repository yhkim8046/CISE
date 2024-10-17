// src/pages/_app.tsx
import "../styles/globals.scss"; 
import type { AppProps } from "next/app";
import PopulatedNavBar from "../components/PopulatedNavBar";
import { UserTypeProvider } from "../context/userType"; // Import UserTypeProvider

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
            <UserTypeProvider> {/* Wrap in UserTypeProvider */}
                <PopulatedNavBar />
                <Component {...pageProps} />
            </UserTypeProvider>
    );
}

export default MyApp;
