import { __ } from '@wordpress/i18n';
import {
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    __experimentalHeading as Heading,
    Button,
    Panel,
    PanelBody,
    PanelRow,
    Spinner,
    Icon,
    Modal,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { check, close } from "@wordpress/icons"

import { useSettings } from '../hooks';
import { Notices } from './notices';
import { HashControl, VisibleTokenControl, HiddenTokenControl } from './controls';

const SettingsTitle = () => {
    return (
        <Heading level={1} className="otakuwp_main-header">
            {__('OtakuWP Product Editor', 'otakuwp-product-editor')}
        </Heading>
    );
};

const SaveButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('Save', 'otakuwp-product-editor')}
        </Button>
    );
};

const UnlinkButton = ({ onClick }) => {
    return (
        <Button variant="secondary" onClick={onClick} __next40pxDefaultSize>
            {__('Reset Connection', 'otakuwp-product-editor')}
        </Button>
    );
};

const ConnectButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('Connect to OtakuWP', 'otakuwp-product-editor')}
        </Button>
    );
};


const LaunchButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('Open Product Editor', 'otakuwp-product-editor')}
        </Button>
    );
};

const ResetButton = ({ onClick }) => {
    return (
        <Button variant="secondary" onClick={onClick} __next40pxDefaultSize>
            {__('Reset Settings', 'otakuwp-product-editor')}
        </Button>
    );
};

const SettingsPage = () => {
    const {
        userId,
        consumerKey,
        consumerSecret,
        saveSettings,
        isConnected,
        connectToOtakuWP,
        hash,
        setHash,
        hashError,
        resetConnection,
        launchApp,
        appLoading,
        setAppLoading,
        successQueryCheck,
        showResetModal,
        setShowResetModal,
        handleConfirmReset,
        forceReload,
        setForceReload
    } = useSettings();

    const [hashError_local, setHashError_local] = useState(false);
    const [isConnected_local, setIsConnected_local] = useState(isConnected)

    useEffect(() => {
        setHashError_local(hashError)
    }, [hashError])

    useEffect(() => {
        setTimeout(() => {
            setAppLoading(false);
        }, 500);
    }, [])

    useEffect(() => {
        setIsConnected_local(isConnected);
    }, [isConnected])

    useEffect(() => {
        if (forceReload) {
            let timer1 = setTimeout(() => {
                window.location.reload();
            }, 1000);

            return () => {
                clearTimeout(timer1);
            };
        }
    }, [forceReload])



    const ConnectPage = () => {
        return (
            <>
                <PanelBody>
                    <PanelRow>
                        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Heading level={2}>Connect</Heading>
                                </div>
                                <div>
                                    Status: <Icon icon={close} size={10} /> not connected
                                </div>
                            </div>
                            {__('Simply connect your store to OtakuWP.', 'otakuwp-product-editor')}
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <ConnectButton onClick={connectToOtakuWP} />
                            {hashError_local && <ResetButton onClick={resetConnection} />}
                        </div>
                    </PanelRow>
                </PanelBody>
            </>
        )
    }

    const LaunchPage = () => {
        return (
            <>
                <PanelBody>
                    <PanelRow>
                        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Heading level={2}>Connected!</Heading>
                                </div>
                                <div>
                                    Status: <Icon icon={check} size={10} /> connected
                                </div>
                            </div>
                            {__('Your website is connected with OtakuWP. Click on the button below to start.', 'otakuwp-product-editor')}
                        </div>
                    </PanelRow>
                </PanelBody>
                <PanelBody>
                    <PanelRow>

                        <LaunchButton onClick={launchApp} />
                        {hashError_local && <ResetButton onClick={resetConnection} />}

                    </PanelRow>
                </PanelBody>
            </>
        );
    }

    return (
        <>
            {showResetModal && (
                <Modal title={__('Restore Default Settings', 'otakuwp-product-editor')} onRequestClose={() => setShowResetModal(false)}>
                    <p>
                        {__('This action will reset all configuration settings for your plugin and disconnect it from OtakuWP. All settings will be erased, and you will need to reconnect your site.', 'otakuwp-product-editor')}
                    </p>
                    <p>
                        {__('Click the button twice to confirm.', 'otakuwp-product-editor')}
                    </p>
                    <Button variant="secondary" onClick={handleConfirmReset}>
                        {__('Yes, restore my settings', 'otakuwp-product-editor')}
                    </Button>
                </Modal>
            )}
            <SettingsTitle />
            <Notices />
            <Panel>

                {appLoading ? (
                    <>
                        <div>
                            <Spinner />
                            Fetching info...
                        </div>
                    </>
                ) : (
                    <>
                        {!isConnected_local ? <ConnectPage /> : <LaunchPage />}
                    </>
                )}

                <PanelBody
                    title={__('Help', 'otakuwp-product-editor')}
                    initialOpen={false}
                >
                    <PanelRow className='panel-row-help'>
                        <div className="col-1">
                            <div className="wrap">
                                <h2 className="wp-heading-inline">{__('Having trouble connecting?', 'otakuwp-product-editor')}</h2>
                                <ol className="list">
                                    <li>
                                        <strong>{__('Check your permalinks:', 'otakuwp-product-editor')}</strong> <br />
                                        <span dangerouslySetInnerHTML={{ __html: __(`Ensure that your permalink settings are not set to <strong>"Plain."</strong> To verify this, go to <strong>Settings → Permalinks</strong> in your WordPress admin panel and select any option other than "Plain."`) }} />
                                    </li>
                                    <li>
                                        <strong>{__('Admin rights required:', 'otakuwp-product-editor')}</strong> <br />
                                        <span dangerouslySetInnerHTML={{ __html: __(`Make sure you are logged in as an admin user with full permissions to write and edit the site. This is essential for establishing a connection between your site and OtakuWP, as these rights are needed to generate REST API keys and integrate the plugin.`) }} />
                                    </li>
                                    <li>
                                        <strong>{__('Still having issues?', 'otakuwp-product-editor')}</strong> <br />
                                        <span dangerouslySetInnerHTML={{ __html: __(`Contact us at <a href="http://www.otakuwp.com" target="_blank">www.otakuwp.com</a>.`) }} />
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <div className='col-2'>
                            <div className="wrap">
                                <div>
                                    <h2 className="wp-heading-inline">{__('Debug Information', 'otakuwp-product-editor')}</h2>
                                </div>
                                <div className="debug-info">
                                    <VisibleTokenControl label="User ID" value={userId} />
                                    <VisibleTokenControl label="Consumer Key" value={consumerKey} />
                                    <HiddenTokenControl label="Consumer Secret" value={consumerSecret} />
                                </div>

                                <div className="hash-control">
                                    <HashControl
                                        value={hash}
                                        onChange={(value) => setHash(value)}
                                    />
                                </div>


                                <div className="button-group">
                                    <SaveButton onClick={saveSettings} />
                                    {!successQueryCheck() && <UnlinkButton onClick={resetConnection} />}

                                </div>
                            </div>
                        </div>
                    </PanelRow>
                </PanelBody>
            </Panel >
        </>
    );
};

export { SettingsPage };