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
    CheckboxControl
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { check, close } from "@wordpress/icons"
import { useDebugSettings } from '../hooks';
import { Notices } from './notices';
import { HashControl, VisibleTokenControl, HiddenTokenControl } from './controls';

const DebugTitle = () => {
    return (
        <Heading level={1} className="otakuwp_main-header">
            {__('OtakuWP Product Editor - Debug settings', 'otakuwp-product-editor')}
        </Heading>
    );
};

const SaveButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} size='compact' __next40pxDefaultSize>
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

const DebugPage = () => {
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
        setForceReload,
        debugModeOn,
        setDebugModeOn,
        updateDebugMode
    } = useDebugSettings();

    useEffect(() => {
        console.log("Mode:", debugModeOn)

    }, [debugModeOn])


    return (
        <>
            <DebugTitle />
            <Notices />
            <Panel>
                <PanelBody>
                    <PanelRow>
                        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Heading level={2}>Debug settings</Heading>
                                </div>
                            </div>
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {__('This page if only for debugging if the plugin is not working.', 'otakuwp-product-editor')}
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                            <p>
                                {__('Debug mode is not on. Please activate debug mode on below.', 'otakuwp-product-editor')}
                            </p>
                            {debugModeOn && "Its on remove this..."}
                            <div class="form">
                                <CheckboxControl
                                    __nextHasNoMarginBottom
                                    label="Enable debug mode"
                                    checked={debugModeOn}
                                    onChange={(value) => setDebugModeOn(value)}
                                />
                                <SaveButton onClick={updateDebugMode} />
                            </div>
                        </div>
                    </PanelRow>
                </PanelBody>

                <PanelBody
                    title={__('Tokens', 'otakuwp-product-editor')}
                    initialOpen={true}
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

export { DebugPage };