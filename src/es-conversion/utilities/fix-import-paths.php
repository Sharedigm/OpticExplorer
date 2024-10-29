<?php

if (count($argv) < 2) {
	echo "Usage: php fix-import-paths.php <path>\n";
	exit;
}

$path = $argv[1];
echo "Fixing import paths for " . $path . "\n";

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
		$i = 0;
		while ($i < sizeof($lines)) {
			$line = $lines[$i++];
			if (trim($line) == 'import(') {
				$line = $lines[$i];
				if (str_starts_with(trim($line), "'./")) {
					$lines[$i] = str_replace("./", getPathToTop($level), $line);
				}
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