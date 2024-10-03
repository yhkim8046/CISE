// src/context/UserType.tsx
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface UserTypeContextType {
    userType: string;
    setUserType: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

// Create a provider component
export const UserTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userType, setUserType] = useState('normal_user'); // Default user type

    return (
        <UserTypeContext.Provider value={{ userType, setUserType }}>
            {children}
        </UserTypeContext.Provider>
    );
};


// Custom hook to use the context
export const useUserType = () => {
    const context = useContext(UserTypeContext);
    if (!context) {
        throw new Error('useUserType must be used within a UserTypeProvider');
    }
    return context;
};
