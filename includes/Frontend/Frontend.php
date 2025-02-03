<?php
namespace Otakuwp_Pe\Frontend;

use Otakuwp_Pe\Store\Store;
class Frontend
{
    public function __construct()
    {
        // add_action('wp_body_open', [$this, 'product_editor_front_page']);
    }

    /**
     * Displays the announcement bar on the front-end.
     */
    function product_editor_front_page()
    {
        $options = get_option(Store::OPTION_NAME);

        if (!$options['display']) {
            return;
        }

        $css = WP_Style_Engine::compile_css(
            array(
                'background' => 'var(--wp--preset--color--vivid-purple, #9b51e0)',
                'color' => 'var(--wp--preset--color--white, #ffffff)',
                'padding' => 'var(--wp--preset--spacing--20, 1.5rem)',
                'font-size' => $options['size'],
            ),
            ''
        );

        printf(
            '<div style="%s">%s</div>',
            esc_attr($css),
            esc_html($options['message'])
        );
    }
}
