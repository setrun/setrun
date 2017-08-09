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
    /**
     * @inheritdoc
     */
    public function bootstrap($app)
    {
        $this->loadComponentsBootstrap($app);
    }

    /**
     * Load installed components bootstrap.
     * @param $app
     * @return void
     */
    protected function loadComponentsBootstrap($app) : void
    {
        $files = (array) FileHelper::findExtensionsFiles('bootstrap.php');
        foreach ($files as $file) {
            require $file;
        }
    }
}