<?php
namespace Otakuwp_Pe\Updater;

require OTAKUWP_PE_PLUGIN_DIR . '/includes/lib/plugin-update-checker-5.5/plugin-update-checker.php';

use Otakuwp_Pe\Store\Store;
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

class Updater
{
    private $plugin_slug = Store::PLUGIN_SLUG;
    private $github_repo = Store::REPO;

    public function __construct()
    {
        add_action('admin_init', [$this, 'checkForUpdate']);
    }

    public function checkForUpdate()
    {
        if (is_admin()) {
            $UpdateChecker = PucFactory::buildUpdateChecker(
                Store::GIT_REPO,
                OTAKUWP_PE_PLUGIN_DIR . '/' . OTAKUWP_PLUGIN_FILENAME,
                Store::PLUGIN_SLUG
            );

            $UpdateChecker->setBranch(Store::GIT_STABLE_BRANCH);
        }
    }

}
