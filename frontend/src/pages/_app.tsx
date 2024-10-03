import "../styles/globals.scss"; 
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import PopulatedNavBar from "../components/PopulatedNavBar";
import { UserTypeProvider } from "../context/userType"; // Import UserTypeProvider

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <UserTypeProvider> {/* Wrap in UserTypeProvider */}
                <PopulatedNavBar />
                <Component {...pageProps} />
            </UserTypeProvider>
        </SessionProvider>
    );
}

export default MyApp;
