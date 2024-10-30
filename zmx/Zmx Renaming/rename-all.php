<?php

if (count($argv) != 3) {
	echo "Usage: php rename-all.php <source-directory-name> <dest-directory-name>";
	exit();
}

$sourceDir = $argv[1];
$destDir = $argv[2];

// parse renaming directory
//
$lines = explode("\n", file_get_contents('ZmxHub.tab'));
$directory = [];
for ($i = 0; $i < sizeof($lines); $i++) {

	// break line into terms
	//
	$line = $lines[$i];
	$terms = $parts = preg_split('/\s+/', $line);

	// compose filename from first two terms
	//
	// $words = explode('_', $terms[1]);
	$filename = $terms[0] . '_' . $terms[1] . '.zmx';

	// compose name from remaining terms
	//
	$name = $terms[2];
	for ($j = 3; $j < count($terms) - 1; $j++) {
		$name .= ' ' . $terms[$j];
	}

	// add filename to name mapping to directory
	//
	// echo "filename: '" . $filename . "', name: '" . $name . "'\n";
	$directory[$filename] = $name;
}

// exit();

// loop over files in directory
//
$iterator = new RecursiveDirectoryIterator($sourceDir);
foreach(new RecursiveIteratorIterator($iterator) as $file) {
	$path = $file->getPath();
	$filename = $file->getFilename();
	$sourcePath = $sourceDir . '/' . $filename;

	// check for file
	//
	if (file_exists($sourcePath)) {
		$data = file_get_contents($sourcePath);
		if ($data) {
			if (array_key_exists($filename, $directory)) {
				$realname = str_replace('/', '', $directory[$filename]);
				$realpath = $destDir . '/' . $realname . '.zmx';
				// echo "Writing data to " . $realpath . "\n";
				file_put_contents($realpath, $data);
			} else {
				echo "Real name not found for " . $filename . "\n";
			}
		}
	} else {
		echo "File not found: " . $sourcePath . "\n";
	}
}
?>