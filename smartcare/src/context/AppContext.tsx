import { createContext } from "react";
import  { doctors } from "../assets/assets";

type Doctor={
        id: number,
        name: string,
        image: string,
        speciality: string,
        degree: string,
        experience: string,
        about: string,
        fees: number,
        address: {
            line1: string,
            line2: string
        }
};

type AppContextType={
    doctors:Doctor[];
}

export const AppContext = createContext<AppContextType>(
    {
        doctors:[]
    }
);


const AppContextProvider=({ children }: { children: React.ReactNode })=>{



    const value:AppContextType={doctors}
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;