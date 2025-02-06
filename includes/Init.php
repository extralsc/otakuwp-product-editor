<?php
namespace Otakuwp_Pe;

class Init
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
        $this->loadHooks();
    }

    private function loadHooks()
    {
        new Store\Store();
        new Updater\Updater();
        new Api\Api();
        new Admin\Admin();
        new Frontend\Frontend();
    }
}
