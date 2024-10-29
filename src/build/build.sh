# define directories
#
src=../../sharedigm
dest=../../sharedigm-built

#
# functions
#

make_copy() {
	rm -rf $2
	cp -r $1 $2
}

#
# script processing functions
#

bundle_scripts() {
	rm -rf $1
	mkdir $1
	rollup --config rollup.config.js --bundleConfigAsCjs
}

compress_scripts() {
	for filename in $1/*.js; do
		echo "minifying script $filename"
		terser --compress --mangle --ecma 6 $filename -o $filename 
	done
}

#
# style processing functions
#

clean_styles() {
	# remove unused less folders
	for item in "$1"/*; do
		if [ -d "$item" ]; then
			if [[ $item != *themes ]]; then
				rm -rf "$item"
			fi
		fi
	done

	# remove development files
	for file in $(find $1 -name '*.less' -or -name '*.scss' -or -name '*.map' -or -name 'makefile'); do rm $file; done

	# remove all empty directories
	find $1 -name ".DS_Store" -depth -exec rm {} \;
	find $1 -type d -empty -print -delete
}

compress_styles() {
	for item in "$1"/*;do
		if [ -d "$item" ];then
			compress_styles "$item"
		elif [ -f "$item" ]; then
			if [[ $item = *.css ]]; then
				echo "minifying styles $item"
				cssmin $item > temp
				rm $item
				mv temp $item
			fi
		fi
	done
}

# create built copy
#
make_copy $src $dest

# process scripts
bundle_scripts "$dest/scripts"
compress_scripts "$dest/scripts"

# process styles
clean_styles "$dest/styles"
compress_styles "$dest/styles"