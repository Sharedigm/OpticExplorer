# Use PHP with Apache as the base image
FROM php:8.2-apache

# Install Additional System Dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    vim \
    libmagickwand-dev \
    imagemagick

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip

# Install Imagemagick
RUN pecl install imagick

# Install exif utility
RUN docker-php-ext-install exif

# Copy in php.ini file
COPY ./docker/php.ini /usr/local/etc/php/php.ini

# Enable Apache mod_rewrite for URL rewriting
RUN a2enmod rewrite

# Configure Apache DocumentRoot to point to Laravel's public directory
# and update Apache configuration files
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Copy the application code
# COPY ./src /var/www/html

# Copy the application data
# COPY ./data /var/www/data

# Set the working directory
WORKDIR /var/www/html

# Install composer
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install project dependencies
# RUN composer install

# Set permissions
RUN chown -R www-data:www-data /var/www