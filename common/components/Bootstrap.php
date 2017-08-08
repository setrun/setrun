<?php

/**
 * @author Denis Utkin <dizirator@gmail.com>
 * @link   https://github.com/dizirator
 */

namespace common\components;

use setrun\sys\helpers\FileHelper;
use yii\base\BootstrapInterface;

/**
 * Class Bootstrap.
 */
class Bootstrap implements BootstrapInterface
{
    public function bootstrap($app)
    {
        $this->loadComponentsBootstrap($app);
    }

    /**
     * @param $app
     */
    protected function loadComponentsBootstrap($app)
    {
        $files = (array) FileHelper::findExtensionsFiles('bootstrap.php');
        foreach ($files as $file) {
            require $file;
        }

    }
}