<?php
namespace Otakuwp_Pe\Admin;

use Otakuwp_Pe\Store\Store;

class Admin
{
    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_admin_page']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_style_script']);
        add_action('init', [$this, 'product_editor_settings']);

    }

    public function add_admin_page()
    {
        add_menu_page(
            __('OtakuWP Product Editor', Store::TEXT_DOMAIN),
            __('OtakuWP Product Editor', Store::TEXT_DOMAIN),
            'manage_options',
            Store::TEXT_DOMAIN,
            [$this, 'render_admin_page'],
            'dashicons-database',
            3
        );
    }

    public function enqueue_style_script($admin_page)
    {

        if ('toplevel_page_otakuwp-product-editor' !== $admin_page) {
            return;
        }

        $asset_file = OTAKUWP_PE_PLUGIN_DIR . '/build/index.asset.php';

        if (!file_exists($asset_file)) {
            return;
        }

        $asset = include $asset_file;

        wp_enqueue_script(
            'otakuwp-product-editor-script',
            OTAKUWP_PE_PLUGIN_URL . '/build/index.js',
            $asset['dependencies'],
            $asset['version'],
            array(
                'in_footer' => true,
            )
        );

        wp_enqueue_style(
            'otakuwp-product-editor-style',
            OTAKUWP_PE_PLUGIN_URL . '/build/index.css',
            array_filter(
                $asset['dependencies'],
                function ($style) {
                    return wp_style_is($style, 'registered');
                }
            ),
            $asset['version'],
        );
    }

    public function product_editor_settings()
    {
        $default = array(
            'userId' => '',
            'consumerKey' => '',
            'consumerSecret' => '',
            'hash' => '',
        );
        $schema = array(
            'type' => 'object',
            'properties' => array(
                'userId' => array(
                    'type' => 'string',
                ),
                'consumerKey' => array(
                    'type' => 'string',
                ),
                'consumerSecret' => array(
                    'type' => 'string',
                ),
                'hash' => array(
                    'type' => 'string',
                ),
            ),
        );

        register_setting(
            'options',
            Store::OPTION_NAME,
            array(
                'type' => 'object',
                'default' => $default,
                'show_in_rest' => array(
                    'schema' => $schema,
                ),
            )
        );

        // !! feature@debug
        register_setting(
            'options',
            Store::DEBUG_OPTION_NAME,
            array(
                'type' => 'boolean',
                'default' => false,
                'show_in_rest' => true,
                'sanitize_callback' => function ($value) {
                    return filter_var($value, FILTER_VALIDATE_BOOLEAN);
                }
            )
        );
    }

    public function render_admin_page()
    {
        printf(
            '<div class="wrap" id="' . Store::APP_CONTAINER . '">%s</div>',
            esc_html__('Loading…', Store::TEXT_DOMAIN)
        );
    }
}
