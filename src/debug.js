import './index.scss';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { DebugPage } from './components';
import { AppProvider } from './store/AppContext';
import { APP } from './data/constants';

domReady(() => {
    const root = createRoot(
        document.getElementById(APP.APP_DEBUG_CONTAINER)
    );

    root.render(
        <AppProvider>
            <DebugPage />
        </AppProvider>
    );
});