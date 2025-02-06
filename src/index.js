import './index.scss';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { SettingsPage } from './components';
import { AppProvider } from './store/AppContext';
import { APP } from './data/constants';

domReady(() => {
    const root = createRoot(
        document.getElementById(APP.APP_CONTAINER)
    );

    root.render(
        <AppProvider>
            <SettingsPage />
        </AppProvider>
    );
});