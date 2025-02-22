FROM php:8.2-apache

# COPY print.php /var/www/html
# RUN docker-php-ext-install

# Add the rewrite module
RUN a2enmod rewrite

# Add the remote ip module, tell it what address to use, and update the log format
RUN a2enmod remoteip

# COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# COPY composer.json /var/www/html/composer.json
# WORKDIR /var/www/html/
# RUN apt update \
#     && apt install git zip -y \
#     && composer install

COPY apache2.conf /etc/apache2/apache2.conf
COPY .htaccess /var/www/html/.htaccess

EXPOSE 80

# USER www-data
CMD ["apache2-foreground"]