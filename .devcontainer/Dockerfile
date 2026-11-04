FROM mcr.microsoft.com/devcontainers/php:8.4-bookworm

USER root

# Native libraries required to compile the GD, intl, and zip extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    zlib1g-dev \
    libicu-dev \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Configure and build the PHP extensions used by NTS-SMS
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        mysqli \
        bcmath \
        gd \
        intl \
        zip

USER vscode

WORKDIR /workspaces/NTS-SMS