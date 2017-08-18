<?php

/**
 * @author Denis Utkin <dizirator@gmail.com>
 * @link   https://github.com/dizirator
 */

namespace themes\backend\imperial\assets;

use Yii;
use setrun\sys\components\web\AssetBundle;

class ThemeAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public $sourcePath = '@themes/backend/imperial/assets/dist';

    /**
     * @inheritdoc
     */
    public $css = [
        '//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic',
        '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        '//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
        '//cdnjs.cloudflare.com/ajax/libs/chosen/1.7.0/chosen.min.css',
        'css/datepicker.css',
        'css/chosen-image.css',
        'css/adminLTE.css',
        'css/layout.css'
    ];

    /**
     * @inheritdoc
     */
    public $js = [
        '//cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.8/jquery.slimscroll.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/chosen/1.7.0/chosen.jquery.min.js',
        '//oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js',
        '//oss.maxcdn.com/respond/1.4.2/respond.min.js',
        "//cdnjs.cloudflare.com/ajax/libs/jquery-noty/2.4.1/packaged/jquery.noty.packaged.min.js",
        'js/jquery.livequery.min.js',
        'js/chosen-image.jquery.js',
        'js/adminLTE.js',
        'js/noty.js',
        'js/app.js'
    ];

    /**
     * @inheritdoc
     */
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapPluginAsset',
        'setrun\sys\assets\SysAsset',
        'setrun\sys\assets\NotyAsset'
    ];
}