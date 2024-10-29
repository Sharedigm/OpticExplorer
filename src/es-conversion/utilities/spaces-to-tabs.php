<?php

$dirname = dirname(__FILE__);
echo "directory = $dirname\n";

function fixFile($path) {
	echo "fixing file: $path\n";
	$contents = file_get_contents($path);
	$lines = explode("\n", $contents);
	for ($i = 0; $i < sizeof($lines); $i++) {
		$lines[$i] = preg_replace('~(?:^|\G)\h{4}~m', "\t", $lines[$i]);
	}
	$contents = implode("\n", $lines);
	file_put_contents($path, $contents);
}

function fixFiles($dirname) {
	$files = scandir($dirname);

	foreach ($files as $key => $value) {
		$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);

		if (!is_dir($path)) {
			$extension = pathinfo($path, PATHINFO_EXTENSION);
			if ($extension === "js") {
				fixFile($path);
			}
		} else if ($value != "." && $value != "..") {
			fixFiles($path);
		}
	}
}

fixFiles($dirname, 0);

?>