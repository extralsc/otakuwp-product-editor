<?php
namespace Otakuwp_Pe\Store;

use Otakuwp_Pe\Store\Store;
class Helper
{
    public static function deactivate()
    {
        delete_option(Store::OPTION_NAME);
        delete_option(Store::DEBUG_OPTION_NAME);
    }
}