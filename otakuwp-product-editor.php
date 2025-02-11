<?php
/**
 * Plugin Name: OtakuWP Product Editor
 * Plugin URI: https://www.otakuwp.com/plugin/product-editor
 * Description: Bulk edit WooCommerce products.
 * Version: 1.0.0
 * Requires at least: 6.1
 * Requires PHP: 7.4
 * Author: OtakuWP
 * Author URI: https://www.otakuwp.com/
 * Text Domain: otakuwp-product-editor
 * Requires Plugins: woocommerce
 * GitHub Plugin URI: https://github.com/extralsc/otakuwp-product-editor
 *
 * @package otakuwp-product-editor
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('OTAKUWP_PE_VERSION', '1.0.0');
define('OTAKUWP_PE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OTAKUWP_PE_PLUGIN_URL', plugin_dir_url(__FILE__));
define('OTAKUWP_PLUGIN_FILENAME', 'otakuwp-product-editor.php');
define('OTAKUWP_PE_CLASS_PREFIX', 'Otakuwp_Pe\\');

require_once OTAKUWP_PE_PLUGIN_DIR . 'includes/Plugin.php';

function otakuwp_product_editor_init()
{
    \Otakuwp_Pe\Plugin::getInstance();
}
add_action('plugins_loaded', 'otakuwp_product_editor_init');

function otakuwp_product_editor_deactivate() {
    require_once OTAKUWP_PE_PLUGIN_DIR . "/includes/Store/Store.php";
    \Otakuwp_Pe\Store\Helper::deactivate();
}

register_deactivation_hook(__FILE__, 'otakuwp_product_editor_deactivate');
