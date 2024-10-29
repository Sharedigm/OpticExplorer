# Create a copy
#
cp -r ../scripts ../"scripts-es5"

# Add use strict to top of each script
# This is done to avoid dupliate header blocks from the codeshift transform.
#
php utilities/add-use-strict.php "../scripts"

# Convert scripts
#
jscodeshift -t node_modules/5to6-codemod/transforms/amd.js ../scripts  --useTabs=true --tabWidth=4

# Remove use strict from top of each script
#
php utilities/remove-use-strict.php "../scripts"

# Fix paths to import files
#
php utilities/fix-paths.php "../scripts"

# Fix .js suffixes to import files
#
php utilities/add-js-suffixes.php "../scripts"

# Remove references to $ and _ imports
#
php utilities/remove-libs.php "../scripts"

# remove whitespace inside of top import blocks
#
php utilities/format-imports.php "../scripts"

# Inline templates for view scripts
#
# php utilities/inline-templates.php "../scripts"

# convert dynamic requires into imports
#
php utilities/convert-requires.php "../scripts"