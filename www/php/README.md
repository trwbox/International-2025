# PHP Things that need done

The uploads folder above this needs to be writable by the web server, so run the run.sh script. That folder is bind mounted to the uploads folder in the container so that files would be available to the nextjs app.

Using this library to parse the stl file. [https://github.com/ChubV/php-stl](https://github.com/ChubV/php-stl)

If there is no vendor folder, run the following command to download the dependencies

```bash
sudo apt-get install composer
composer install
```
