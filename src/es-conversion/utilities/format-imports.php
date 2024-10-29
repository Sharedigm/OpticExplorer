<?php

if (count($argv) < 2) {
	echo "Usage: php format-imports.php <path>\n";
	exit;
}

$path = $argv[1];
echo "Formatting imports for " . $path . "\n";

function formatImportsForFile($path) {
	$contents = file_get_contents($path);
	$lines = explode("\n", $contents);
	$lines2 = [];
	$formatting = true;
	$formattingImports = false;

	for ($i = 0; $i < count($lines); $i++) {
		$line = $lines[$i];

		// stop formatting when export block is found
		//
		if (str_starts_with($line, 'import') && !$formattingImports) {

			// add blank line before start of import block
			//
			array_push($lines2, '');
			$formattingImports = true;

		// stop formatting when export block is found
		//
		} else if (str_starts_with($line, 'export')) {
			$formatting = false;
			$formattingImports = false;

			// add blank line before start of export block
			//
			array_push($lines2, '');
		}

		if ($formatting) {

			// skip blank lines
			//
			if ($line != "") {
				array_push($lines2, $line);
			}
		} else {
			array_push($lines2, $line);
		}
	}

	$contents = implode("\n", $lines2);
	file_put_contents($path, $contents);
}

function formatImportsForDirectory($dirname) {
	$files = scandir($dirname);
	foreach ($files as $key => $value) {
		if ($value != "." && $value != "..") {
			$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);
			formatImports($path);
		}
	}
}

function formatImports($path) {
	if (!is_dir($path)) {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		if ($extension === "js") {
			formatImportsForFile($path);
		}
	} else {
		formatImportsForDirectory($path);
	}
}

formatImports($path);

?>