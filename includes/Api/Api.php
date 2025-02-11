<?php
namespace Otakuwp_Pe\Api;

use Otakuwp_Pe\Store\Store;
class Api
{
    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    public function register_routes() {
        register_rest_route( 'custom-api/v1', '/get-api-keys', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'fetch_api_keys' ],
            'permission_callback' => [ $this, 'permission_check' ],
        ] );
    }

    public function fetch_api_keys( $request ) {
        return rest_ensure_response( "hello" );

        
        global $wpdb;

        // Din tabell
        $table_name = $wpdb->prefix . 'your_table_name'; // Exempel: wp_api_keys

        // Fråga med $wpdb
        $api_keys = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$table_name} 
                 WHERE user_id = %d 
                 AND permissions = %s 
                 AND description LIKE %s 
                 ORDER BY key_id DESC 
                 LIMIT 1",
                get_current_user_id(),
                'read_write',
                '%otakuwp product editor%'
            ),
            ARRAY_A
        );

        // Returnera resultat
        if ( empty( $api_keys ) ) {
            return new WP_Error( 'no_keys', 'Inga API-nycklar hittades.', [ 'status' => 404 ] );
        }

        return rest_ensure_response( $api_keys );
    }

    public function permission_check() {
        return current_user_can( 'manage_options' ); // Endast admins
    }
}