import { createContext, useState } from "@wordpress/element";

const AppContext = createContext('');

export const AppProvider = ({ children }) => {
    const [hash, setHash] = useState('');
    const [userId, setUserId] = useState();
    const [consumerKey, setConsumerKey] = useState();
    const [consumerSecret, setConsumerSecret] = useState();
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatusFetched, setConnectionStatusFetched] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [hashError, setHashError] = useState(false);
    const [newHash, setNewHash] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [showSecretCKey, setShowSecretCKey] = useState(false);
    const [confirmResetSettings, setConfirmResetSettings] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [forceReload, setForceReload] = useState(false);

    // debug values
    const [debugModeOn, setDebugModeOn] = useState(false);

    const contextValue = {
        debugModeOn,
        setDebugModeOn,
        hash,
        setHash,
        userId,
        setUserId,
        consumerKey,
        setConsumerKey,
        consumerSecret,
        setConsumerSecret,
        isConnected,
        setIsConnected,
        connectionStatusFetched,
        setConnectionStatusFetched,
        registered,
        setRegistered,
        hashError,
        setHashError,
        newHash,
        setNewHash,
        appLoading,
        setAppLoading,
        showSecretCKey,
        setShowSecretCKey,
        confirmResetSettings,
        setConfirmResetSettings,
        showResetModal,
        setShowResetModal,
        forceReload,
        setForceReload
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;