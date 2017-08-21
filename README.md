Installing SETRUN Basic App
==============
### Installing Composer

If you do not already have Composer installed, you may do so by following the instructions at
[getcomposer.org](https://getcomposer.org/download/). On Linux and Mac OS X, you'll run the following commands:

```bash
curl -sS https://getcomposer.org/installer | php mv composer.phar /usr/local/bin/composer
```

### Installing SETRUN

```bash
composer create-project --prefer-dist --stability=dev --no-install  setrun/setrun-app-basic example.com
```

```bash
cd example.com
```

Edit the file to access the database, it is located at `applications/primary/config/db-local.php`


```bash
composer install -o
```

[![Yii2](https://img.shields.io/badge/Powered_by-Yii_Framework-green.svg?style=flat)](http://www.yiiframework.com/)
