<?php

if (count($argv) < 2) {
	echo "Usage: php convert-requires.php <path>\n";
	exit;
}

$path = $argv[1];
echo "Converting requires to es6 dynamic imports for " . $path . "\n";

function getPathToTop($level) {
	if ($level == 1) {
		return './';
	} else {
		$path = '';
		for ($i = 1; $i < $level; $i++) {
			$path .= '../';
		}
		return $path;
	}
}

function formatImport($file, $module, $body, $indents, $level) {
	$newlines = [];
	$path = getPathToTop($level);
	$filename = "'" . $path . $file . ".js'";
	array_push($newlines, $indents . 'import(');
	array_push($newlines, $indents . "\t" . $filename);
	array_push($newlines, $indents . ').then((' . $module . ') => {');

	// add import body
	//
	for ($i = 0; $i < count($body); $i++) {
		$line = $body[$i];
		$line = str_replace($module, $module . '.default', $line);
		array_push($newlines, $line);
	}

	array_push($newlines, $indents . '});');
	return $newlines;
}

function formatImports($files, $modules, $body, $indents, $level) {
	$newlines = [];
	array_push($newlines, $indents . 'Promise.all([');

	// add files
	//
	for ($i = 0; $i < count($files); $i++) {
		$file = $files[$i];
		$path = getPathToTop($level);
		$filename = "'" . $path . $file . ".js'";
		$line = $indents . "\t" . 'import(' . $filename . ')';
		if ($i < count($files) - 1) {
			$line .= ', ';
		}
		array_push($newlines, $line);
	}

	array_push($newlines, $indents . ']).then(([' . implode(', ', $modules) . ']) => {');

	// add import body
	//
	for ($i = 0; $i < count($body); $i++) {
		$line = $body[$i];
		for ($j = 0; $j < count($modules); $j++) {
			$module = $modules[$j];
			$line = str_replace($module, $module . '.default', $line);
		}
		array_push($newlines, $line);
	}

	array_push($newlines, $indents . '});');
	return $newlines;
}

function convertRequiresForFile($path, $level) {
	$contents = file_get_contents($path);
	$lines = explode("\n", $contents);
	$lines2 = [];

	$i = 0;
	while ($i < count($lines)) {
		$line = $lines[$i++];

		if (trim($line) == 'require([') {
			$strpos = strpos($line, 'require([');
			$indents = substr($line, 0, $strpos);
			$line = $lines[$i++];
			$files = [];

			// find list of files
			//
			while (str_starts_with(trim($line), "'") && $i < count($lines)) {
				$line = trim($line);
				$line = str_replace("'", '', $line);
				$line = str_replace(",", '', $line);
				array_push($files, $line);
				$line = $lines[$i++];
			}

			/*
			echo "files: ";
			print_r($files);
			echo "\n";
			*/

			// find list of modules
			//
			$modules = trim($line);
			$modules = str_replace('],', '', $modules);
			$modules = str_replace(']', '', $modules);
			$modules = str_replace('function', '', $modules);
			$modules = str_replace('{', '', $modules);
			$modules = str_replace(')', '', $modules);
			$modules = str_replace('(', '', $modules);
			$modules = str_replace(')', '', $modules);
			$modules = str_replace('=>', '', $modules);
			$modules = str_replace(' ', '', $modules);
			$modules = explode(',', $modules);
			$body = [];

			/*
			echo "modules: ";
			print_r($modules);
			echo "\n";
			*/

			$line = $lines[$i++];
			while ($line != $indents . '});' && $i < count($lines)) {
				array_push($body, $line);
				$line = $lines[$i++];
			}

			if (count($files) == 1) {
				$newlines = formatImport($files[0], $modules[0], $body, $indents, $level);
				for ($j = 0; $j < count($newlines); $j++) {
					array_push($lines2, $newlines[$j]);
				}
			} else {
				$newlines = formatImports($files, $modules, $body, $indents, $level);
				for ($j = 0; $j < count($newlines); $j++) {
					array_push($lines2, $newlines[$j]);
				}
			}
		} else {
			array_push($lines2, $line);
		}
	}

	$contents = implode("\n", $lines2);
	// echo $contents;
	file_put_contents($path, $contents);
}

function convertRequiresForDirectory($dirname, $level) {
	$files = scandir($dirname);
	foreach ($files as $key => $value) {
		if ($value != "." && $value != "..") {
			$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);
			convertRequires($path, $level + 1);
		}
	}
}

function convertRequires($path, $level) {
	if (!is_dir($path)) {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		if ($extension === "js") {
			convertRequiresForFile($path, $level);
		}
	} else {
		convertRequiresForDirectory($path, $level);
	}
}

convertRequires($path, 0);

?>