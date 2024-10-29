<?php

if (count($argv) < 2) {
	echo "Usage: php fix-paths.php <path>\n";
	exit;
}

$path = $argv[1];
echo "Fixing paths for " . $path . "\n";

function getPathToTop($level) {
	if ($level == 0) {
		return './';
	} else {
		$path = '';
		for ($i = 0; $i < $level; $i++) {
			$path .= '../';
		}
		return $path;
	}
}

function fixFilePath($path, $level) {
	$prefix = getPathToTop($level);
	if ($level > 0) {
		$contents = file_get_contents($path);
		$lines = explode("\n", $contents);
		for ($i = 0; $i < sizeof($lines); $i++) {
			$line = $lines[$i];
			if (substr($line, 0, 6) == "import") {
				$lines[$i] = str_replace("from '", "from '" . $prefix, $line);
			}
		}
		$contents = implode("\n", $lines);
		file_put_contents($path, $contents);
	}
}

function fixFilePaths($dirname, $level) {
	$files = scandir($dirname);

	foreach ($files as $key => $value) {
		$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);

		if (!is_dir($path)) {
			$extension = pathinfo($path, PATHINFO_EXTENSION);
			if ($extension === "js") {
				fixFilePath($path, $level);
			}
		} else if ($value != "." && $value != "..") {
			fixFilePaths($path, $level + 1);
		}
	}
}

fixFilePaths($path, 0);

?>