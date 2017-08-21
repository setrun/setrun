Installing
==============
### Installing Composer

If you do not already have Composer installed, you may do so by following the instructions at
[getcomposer.org](https://getcomposer.org/download/). On Linux and Mac OS X, you'll run the following commands:

```bash
curl -sS https://getcomposer.org/installer | php mv composer.phar /usr/local/bin/composer
```

### Installing SETRUN

Go to the previously created folder in which the project will be located
> Note: The project directory must be completely empty, it should not contain any files
```bash
cd /path/to/site
```
Create a project without installing dependency files (vendor)

```bash
composer create-project --prefer-dist --stability=dev --no-install setrun/setrun-app-basic ./
```

Edit the file to access the database, it is located at `applications/primary/config/db-local.php`. Next, perform the installation of dependencies (vendor)


```bash
composer install -o
```

Create a new user

```bash
./yii user/user/create 
```

Add a role for the user

```bash
./yii user/rbac/role-assign
```

[![Yii2](https://img.shields.io/badge/Powered_by-Yii_Framework-green.svg?style=flat)](http://www.yiiframework.com/)
