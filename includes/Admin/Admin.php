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
            __('Product Editor', Store::TEXT_DOMAIN),
            'manage_options',
            Store::TEXT_DOMAIN,
            [$this, 'render_admin_page'],
            'dashicons-database',
            3
        );

        add_submenu_page(
            Store::TEXT_DOMAIN, 
            __('OtakuWP Settings', Store::TEXT_DOMAIN),
            __('Settings', Store::TEXT_DOMAIN), 
            'manage_options', 
            Store::get_prefixed('settings'), 
            [$this, 'render_settings_page'] 
        );
    }

    public function render_settings_page()
    {
        echo 'hello';
        echo 'hello', '<hr/>';

        // Din hemliga nyckel (behåll den säker och privat)
        $secret_key = "din-superhemliga-nyckel";

        // Krypteringsmetod (kontrollera vilka som stöds med openssl_get_cipher_methods())
        $cipher_method = "AES-256-CBC";

        // En slumpmässig initialiseringsvektor (IV) krävs för säker kryptering
        $iv_length = openssl_cipher_iv_length($cipher_method);
        $iv = openssl_random_pseudo_bytes($iv_length);

        // Text att kryptera
        $original_text = "deff8c2cc04ee5a5ae81e8ad6c5d1cbc6baaa7a9c4951c318af7a01960e18ff2";

        // Kryptera texten
        $encrypted_text = openssl_encrypt($original_text, $cipher_method, $secret_key, 0, $iv);

        // Kombinera krypterad text med IV (så att du kan använda IV vid dekryptering)
        $encrypted_data = base64_encode($iv . $encrypted_text);

        echo "Krypterad text: " . $encrypted_data . PHP_EOL . "<br>";

        // Dekryptera texten
        $decoded_data = base64_decode($encrypted_data);

        // Extrahera IV och själva krypterade texten
        $iv_decoded = substr($decoded_data, 0, $iv_length);
        $encrypted_text_decoded = substr($decoded_data, $iv_length);

        // Dekryptera texten
        $decrypted_text = openssl_decrypt($encrypted_text_decoded, $cipher_method, $secret_key, 0, $iv_decoded);

        echo "Dekrypterad text: " . $decrypted_text . PHP_EOL;

        global $wpdb;

        // Hämta den inloggade användarens ID
        $user_id = get_current_user_id(); // Hämtar den inloggade användarens ID

        if ($user_id === 0) {
            echo 'Inga användare är inloggade.';
        }


        // Tabell för API-nycklar i databasen
        $table_name = $wpdb->prefix . 'woocommerce_api_keys';

        // Hämta API-nycklar från databasen för den inloggade användaren
        $api_keys = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$table_name} WHERE user_id = %d AND permissions='read_write' AND description LIKE '%otakuwp product editor%' ORDER BY key_id DESC LIMIT 1",
                $user_id
            ),
            ARRAY_A
        );

        if (!empty($api_keys)) {
            // Skapa en tabell för att visa nycklar
            $output = '<h3>API-nycklar för Inloggad Användare (ID: ' . esc_html($user_id) . ')</h3>';
            $output .= '<table class="wp-list-table widefat fixed striped">';
            $output .= '<thead><tr><th>API-namn</th><th>Consumer key</th><th>Consumer secret</th><th>Behörighet</th><th>Status</th></tr></thead>';
            $output .= '<tbody>';

            foreach ($api_keys as $key_data) {
                $output .= '<tr>';
                $output .= '<td>' . esc_html($key_data['description']) . '</td>';
                $output .= '<td>' . esc_html($key_data['consumer_key']) . '</td>';
                $output .= '<td>' . esc_html($key_data['consumer_secret']) . '</td>';
                $output .= '<td>' . esc_html($key_data['permissions']) . '</td>';
                $output .= '<td>' . esc_html($key_data['truncated_key']) . '</td>';
                $output .= '</tr>';
            }

            $output .= '</tbody>';
            $output .= '</table>';
            echo $output;
        } else {
            echo 'Inga API-nycklar hittades för den inloggade användaren.';
        }
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

    /**
     * Registers the setting and defines its type and default value.
     */
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
    }

    public function render_admin_page()
    {
        printf(
            '<div class="wrap" id="' . Store::APP_CONTAINER . '">%s</div>',
            esc_html__('Loading…', Store::TEXT_DOMAIN)
        );
    }
}
