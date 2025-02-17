import { createContext, useState } from "react";
import { deviceProps, screenProps } from "../types";

interface AppContextType {
    screens: screenProps[];
    setScreens: (screens: screenProps[]) => void;
    devices: deviceProps[];
    setDevices: (devices: deviceProps[]) => void;
}

const AppContext = createContext<AppContextType>(null!);

function AppProvider({ children }: { children: React.ReactNode }) {
    const [screens, setScreens] = useState<screenProps[]>([]);
    const [devices, setDevices] = useState<deviceProps[]>([]);

    const value = {
        screens,
        devices,
        setScreens,
        setDevices
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export { AppContext, AppProvider }

