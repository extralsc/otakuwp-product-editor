import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useContext, useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { getAuthority, getQueryArg } from '@wordpress/url'

import { APP } from "../data/constants"
import AppContext from '../store/AppContext';

const useDebugSettings = () => {
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
    const {
        hash, setHash,
        userId, setUserId,
        consumerKey, setConsumerKey,
        consumerSecret, setConsumerSecret,
        isConnected, setIsConnected,
        connectionStatusFetched, setConnectionStatusFetched,
        registered, setRegistered,
        hashError, setHashError,
        newHash, setNewHash,
        appLoading, setAppLoading,
        showResetModal, setShowResetModal,
        confirmResetSettings, setConfirmResetSettings,
        forceReload, setForceReload,
        debugModeOn, setDebugModeOn

    } = useContext(AppContext);

    const [confirmResetSettings_local, setConfirmResetSettings_local] = useState(confirmResetSettings)

    useEffect(() => {
        setConfirmResetSettings_local(confirmResetSettings)
    }, [confirmResetSettings])



    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' }).then((settings) => {
            setHash(settings.otakuwp_product_editor.hash);
            setUserId(settings.otakuwp_product_editor.userId);
            setConsumerKey(settings.otakuwp_product_editor.consumerKey);
            setConsumerSecret(settings.otakuwp_product_editor.consumerSecret);

            setDebugModeOn(settings.otakuwp_product_editor_debug);

            fetch(APP.AUTH_URL + '?website=' + getAuthority(window.location.href) + "&plugin=" + APP.PLUGIN_SLUG + "&hash=" + settings.otakuwp_product_editor.hash)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json(); // Tolka JSON-respons
                })
                .then((data) => {
                    setConnectionStatusFetched(true);
                    if (data.status === "success" || data.status === "success-data") {
                        setIsConnected(true);
                    } else if (data.code == "invalid-hash") {
                        setIsConnected(false);

                        setHashError(true);
                        createErrorNotice(
                            __('It seems that you have adjusted the hash codes. Please try authenticating again.', 'otakuwp-product-editor')
                        );
                    } else {
                        setIsConnected(false);
                        // console.log('API response status is not success:', data);
                    }
                })
                .catch((error) => {
                    setIsConnected(false);
                    console.error('Fetch error:', error);
                    createErrorNotice(
                        __('Could not connect to OtakuWP API server. Please try reloading or contact support at www.otakuwp.com.', 'otakuwp-product-editor')
                    );
                });
        });
    }, [newHash]);

    // Validate
    useEffect(() => {
        const hashQueryString = getQueryArg(window.location.href, 'hash');
        const successQueryString = getQueryArg(window.location.href, 'success');
        if (hashQueryString && successQueryString == "1") {
            apiFetch({
                path: '/wp/v2/settings',
                method: 'POST',
                data: {
                    otakuwp_product_editor: {
                        hash: hashQueryString,
                    },
                },
            }).then(() => {
                setHash(hashQueryString);
                fetch(APP.AUTH_URL + '?website=' + getAuthority(window.location.href) + "&plugin=" + APP.PLUGIN_SLUG + "&hash=" + hashQueryString)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setConnectionStatusFetched(true);
                        if (data.status === "success-data") {
                            apiFetch({
                                path: '/wp/v2/settings',
                                method: 'POST',
                                data: {
                                    otakuwp_product_editor: {
                                        hash: hashQueryString,
                                        userId: data.user_id,
                                        consumerKey: data.consumer_key,
                                        consumerSecret: data.consumer_secret,
                                    },
                                },
                            }).then(() => {
                                setHash(hashQueryString);
                                setUserId(data.user_id);
                                setConsumerKey(data.consumer_key);
                                setConsumerSecret(data.consumer_secret);
                                setIsConnected(true);
                                setRegistered(true);
                                createSuccessNotice(
                                    __('Connected!', 'otakuwp-product-editor')
                                );
                            });
                        } else {
                            setIsConnected(false);
                            setRegistered(flalse);
                            console.log('API response status is not success:', data);
                        }
                    })
                    .catch((error) => {
                        setIsConnected(false);
                        setRegistered(false);

                        console.error('Fetch error:', error);
                        createErrorNotice(
                            __('Could not connect to OtakuWP API server. Please try reloading or contact support at www.otakuwp.com.', 'otakuwp-product-editor')
                        );
                    });
            });
        }
        if (successQueryString == "0") {
            setIsConnected(false);
            setRegistered(false);
            createErrorNotice(
                __('Access was denied by user. Please try again.', 'otakuwp-product-editor')
            );
        }
    }, [])

    const launchApp = () => {
        window.open(APP.APP_URL + "/?hash=" + hash + "&ck=" + consumerKey + "&cs=" + consumerSecret, "_blank")
    }

    const handleConfirmReset = () => {
        setConfirmResetSettings(true);
        setShowResetModal(false);
        resetConnection(true);
    }

    const saveSettings = () => {
        apiFetch({
            path: '/wp/v2/settings',
            method: 'POST',
            data: {
                otakuwp_product_editor: {
                    hash: hash,
                    userId: userId,
                    consumerKey: consumerKey,
                    consumerSecret: consumerSecret,
                },
            },
        }).then(() => {
            setNewHash(hash);
            setIsConnected(false);
            setRegistered(false);
            setConnectionStatusFetched(false);
            setHashError(false);
            setNewHash(hash);
            setForceReload(true);
            createSuccessNotice(
                __('Settings saved.', 'otakuwp-product-editor')
            );
            // window.location.reload();
        });
    };

    const successQueryCheck = () => {
        const successQueryString = getQueryArg(window.location.href, 'success');
        return successQueryString;
    }

    const connectToOtakuWP = () => {
        const open_url = APP.CONNECT_URL + '?domain=' + getAuthority(window.location.href) + '&plugin=' + APP.PLUGIN_SLUG + "&return_url=" + window.location.href + "&user_id=" + APP.PLUGIN_SLUG + "|" + getAuthority(window.location.href);
        window.open(open_url, "_self", "noreferrer");
    };

    const resetConnection = () => {
        if (!confirmResetSettings) {
            setShowResetModal(true);
            return;
        }

        apiFetch({
            path: '/wp/v2/settings',
            method: 'POST',
            data: {
                otakuwp_product_editor: {
                    hash: '',
                    userId: '',
                    consumerKey: '',
                    consumerSecret: '',
                },
            },
        }).then(() => {
            setHash('');
            setUserId('');
            setConsumerKey('');
            setConsumerSecret('');
            setIsConnected(false);
            setConnectionStatusFetched(false);
            setRegistered(false);
            window.location.reload();
            createSuccessNotice(
                __('Settings have been reset. Please reload the page.', 'otakuwp-product-editor')
            );
        });
    };

    const updateDebugMode = () => {
        apiFetch({
            path: '/wp/v2/settings',
            method: 'POST',
            data: {
                otakuwp_product_editor_debug: debugModeOn
            },
        }).then(() => {
            createSuccessNotice(
                __('Settings have been reset. Please reload the page.', 'otakuwp-product-editor')
            );
        });
    }

    return {
        hash,
        setHash,
        userId,
        setUserId,
        consumerKey,
        setConsumerKey,
        consumerSecret,
        setConsumerSecret,
        saveSettings,
        isConnected,
        setIsConnected,
        setConnectionStatusFetched,
        connectionStatusFetched,
        connectToOtakuWP,
        registered,
        setRegistered,
        hashError,
        setHashError,
        resetConnection,
        launchApp,
        appLoading,
        setAppLoading,
        successQueryCheck,
        showResetModal,
        setShowResetModal,
        setConfirmResetSettings,
        handleConfirmReset,
        forceReload,
        setForceReload,
        debugModeOn,
        setDebugModeOn,
        updateDebugMode
    };
};

export default useDebugSettings;