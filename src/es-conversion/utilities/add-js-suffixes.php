<?php

if (count($argv) < 2) {
	echo "Usage: php add-js-suffixes.php <path>\n";
	exit;
}

$path = $argv[1];
echo "Adding js suffix to " . $path . "\n";

function addSuffixToFile($path) {
	$contents = file_get_contents($path);
	$lines = explode("\n", $contents);

	for ($i = 0; $i < count($lines); $i++) {
		$line = $lines[$i];
		if (str_starts_with($line, 'import') && !str_ends_with($line, ".tpl';")) {
			$lines[$i] = str_replace("';", ".js';", $line);
		}
	}

	$contents = implode("\n", $lines);
	file_put_contents($path, $contents);
}

function addSuffixToDirectory($dirname) {
	$files = scandir($dirname);
	foreach ($files as $key => $value) {
		if ($value != "." && $value != "..") {
			$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);
			addSuffix($path);
		}
	}
}

function addSuffix($path) {
	if (!is_dir($path)) {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		if ($extension === "js") {
			addSuffixToFile($path);
		}
	} else {
		addSuffixToDirectory($path);
	}
}

addSuffix($path);

?>