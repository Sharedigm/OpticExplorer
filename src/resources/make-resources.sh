#******************************************************************************#
#                                                                              #
#                             make-resourcess.sh                               #
#                                                                              #
#******************************************************************************#
#                                                                              #
#        This script concatenates each apps resources into a single file.      #
#                                                                              #
#        Author(s): Abe Megahed                                                #
#                                                                              #
#        This file is subject to the terms and conditions defined in           #
#        'LICENSE.md', which is part of this source code distribution.         #
#                                                                              #
#******************************************************************************#
#        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          #
#******************************************************************************#

function add_file {

	# get filename from path
	#
	filename=$(basename "$filepath")

	# remove extension from filename
	#
	filename=${filename/.json/}

	# skip non-json files
	#
	if [[ $filename == '*' ]]; then
		return
	fi

	# get resource name from filename
	#
	resource=${filename/-/_}

	# get file contents
	#
	contents=`cat $filepath`

	# get resources
	#
	resources=`cat $app/resources.json`

	# append contents to resources
	#
	echo "Adding $resource."
	cat $target | jq --tab ".$resource+= $contents" > $app/output.json
	mv $app/output.json $target
}

function concat_app_resources {
	app=$1
	target=$app/resources.json
	echo "Processing $app resources..."

	echo '{}' > $target
	for filepath in $app/*/*.json; do
		add_file
	done
}

function process_apps {

	# iterate over all apps
	#
	for app in */; do

		# remove slashes from app name
		#
		app=${app/\//}

		# concatenate all json files in app directory
		#
		concat_app_resources $app
	done
}

function concat_all_resources {
	target=resources.json
	echo "Processing all resources..."
	echo '{}' > $target

	# iterate over all apps
	#
	for dirname in */; do

		# remove slashes from app name
		#
		dirname=${dirname/\//}

		# get resource name from filename
		#
		appname=${dirname/-/_}

		# get path to resources
		#
		filepath=$dirname/resources.json

		# get file contents
		#
		contents=`cat $filepath`

		# append contents to resources
		#
		echo "Adding resources from $appname."
		cat $target | jq --tab ".$appname+= $contents" > output.json
		mv output.json $target
	done
}

# concatenate resources for each app
#
process_apps