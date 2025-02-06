import { __ } from '@wordpress/i18n';
import {
    FontSizePicker,
    TextareaControl,
    ToggleControl,
    TextControl,
    __experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
    __experimentalInputControl as InputControl,
    Button
} from '@wordpress/components';
import { seen, unseen } from '@wordpress/icons';
import { useContext } from '@wordpress/element';

import AppContext from '../store/AppContext';

const VisibleTokenControl = ({ label = "", value }) => {
    return (
        <InputControl
            __next40pxDefaultSize
            label={label}
            value={value}
            onChange={() => { }}
            onDrag={() => { }}
            onDragEnd={() => { }}
            onDragStart={() => { }}
            onValidate={() => { }}
            readOnly
        />
    );
}

const HiddenTokenControl = ({ label = "", value }) => {
    const { showSecretCKey, setShowSecretCKey } = useContext(AppContext);

    return (
        <InputControl
            __next40pxDefaultSize
            label={label}
            onChange={() => { }}
            onDrag={() => { }}
            onDragEnd={() => { }}
            onDragStart={() => { }}
            onValidate={() => { }}
            value={value}
            suffix={
                <InputControlSuffixWrapper variant="control">
                    <Button icon={showSecretCKey ? seen : unseen} label="Show key" onClick={() => { setShowSecretCKey(!showSecretCKey) }} size="small" />
                </InputControlSuffixWrapper>}
            readOnly
            type={showSecretCKey ? 'text' : 'password'}
        />
    );
}

const MessageControl = ({ value, onChange }) => {
    return (
        <TextareaControl
            label={__('Hashtoken', 'otakuwp-product-editor')}
            value={value}
            onChange={onChange}
            __nextHasNoMarginBottom
        />
    );
};

const HashControl = ({ value, onChange }) => {
    return (
        <TextControl
            label={__('Hash token', 'otakuwp-product-editor')}
            value={value}
            onChange={onChange}
            help={__('Only make changes if you\'re sure of what you\'re doing.', 'otakuwp - product - editor')}
            __nextHasNoMarginBottom
            __next40pxDefaultSize
        />
    );
};

const DisplayControl = ({ value, onChange }) => {
    return (
        <ToggleControl
            checked={value}
            label={__('Display', 'otakuwp-product-editor')}
            onChange={onChange}
            __nextHasNoMarginBottom
        />
    );
};

const SizeControl = ({ value, onChange }) => {
    return (
        <FontSizePicker
            fontSizes={[
                {
                    name: __('Small', 'otakuwp-product-editor'),
                    size: 'small',
                    slug: 'small',
                },
                {
                    name: __('Medium', 'otakuwp-product-editor'),
                    size: 'medium',
                    slug: 'medium',
                },
                {
                    name: __('Large', 'otakuwp-product-editor'),
                    size: 'large',
                    slug: 'large',
                },
                {
                    name: __('Extra Large', 'otakuwp-product-editor'),
                    size: 'x-large',
                    slug: 'x-large',
                },
            ]}
            value={value}
            onChange={onChange}
            disableCustomFontSizes={true}
            __next40pxDefaultSize
            __nextHasNoMarginBottom
        />
    );
};

export { MessageControl, DisplayControl, SizeControl, HashControl, VisibleTokenControl, HiddenTokenControl };