find ./app/ -name "*.php" -print0 | xargs -0 php -l 1> /dev/null
