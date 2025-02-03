<?php
namespace Otakuwp_Pe;

class Autoloader
{
    public static function register()
    {
        spl_autoload_register(function ($class) {
            $prefix = OTAKUWP_PE_CLASS_PREFIX;
            $base_dir = OTAKUWP_PE_PLUGIN_DIR . 'includes/';

            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                return;
            }

            $relative_class = substr($class, $len);
            $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

            if (file_exists($file)) {
                require_once $file;
            }
        });
    }
}

Autoloader::register();
