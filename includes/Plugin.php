<?php
namespace Otakuwp_Pe;

class Plugin
{
    private static $instance = null;

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->loadDependencies();
        $this->initHooks();
    }

    private function loadDependencies()
    {
        require_once OTAKUWP_PE_PLUGIN_DIR . 'includes/Autoloader.php';
        require_once OTAKUWP_PE_PLUGIN_DIR . 'includes/Init.php';
    }

    private function initHooks()
    {
        Init::getInstance();
    }
}
