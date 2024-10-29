wc -l `find . \
-path \
-prune -o -path ./build \
-prune -o -path ./fonts \
-prune -o -path ./images \
-prune -o -path ./library \
-prune -o -path ./project \
-prune -o -path ./sounds \
-prune -o -path ./vendor \
-prune -o -type f -print`