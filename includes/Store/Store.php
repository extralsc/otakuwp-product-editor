<?php
namespace Otakuwp_Pe\Store;

class Store
{

    const PREFIX = 'otakuwp_product_editor';
    const TEXT_DOMAIN = 'otakuwp-product-editor';
    const OPTION_NAME = 'otakuwp_product_editor';
    const PLUGIN_SLUG = 'otakuwp-product-editor';
    const REPO = 'otakuwp/otakuwp-product-editor';
    const GIT_REPO = 'https://github.com/extralsc/otakuwp-product-editor';
    const GIT_STABLE_BRANCH = 'main';
    const APP_CONTAINER = 'otakuwp-pe-app';
    public static $VERSION;
    public static $CLASS_PREFIX;

    public static function init()
    {
        self::$VERSION = OTAKUWP_PE_VERSION;
        self::$CLASS_PREFIX = OTAKUWP_PE_CLASS_PREFIX;

    }

    public static function get_prefixed($string)
    {
        return self::PREFIX . '_' . $string;
    }

    public static function get_slug($string)
    {
        return str_replace('_', '-', self::get_prefixed($string));
    }
}