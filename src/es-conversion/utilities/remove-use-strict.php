<?php

if (count($argv) < 2) {
	echo "Usage: php remove-use-strict.php <path>\n";
	exit;
}

$path = $argv[1];
echo "Removing use strict from " . $path . "\n";

function removeUseStrictFromFile($path) {
	$contents = file_get_contents($path);
	$lines = explode("\n", $contents);
	$lines2 = [];

	$i = 0;
	while ($i < count($lines)) {
		$line = $lines[$i++];

		if ($line == '"use strict";'|| $line == "'use strict';") {

			// skp blank line under use strict
			//
			$line = $lines[$i];
			if ($line == '') {
				$i++;
			}
		} else {

			// add code line
			//
			array_push($lines2, $line);
		}
	}

	$contents = implode("\n", $lines2);
	file_put_contents($path, $contents);
}

function removeUseStrictFromDirectory($dirname) {
	$files = scandir($dirname);
	foreach ($files as $key => $value) {
		if ($value != "." && $value != "..") {
			$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);
			removeUseStrict($path);
		}
	}
}

function removeUseStrict($path) {
	if (!is_dir($path)) {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		if ($extension === "js") {
			removeUseStrictFromFile($path);
		}
	} else {
		removeUseStrictFromDirectory($path);
	}
}

removeUseStrict($path);

?>