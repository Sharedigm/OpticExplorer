<?php

if (count($argv) < 2) {
	echo "Usage: php inline-templates.php <path>\n";
	exit;
}

// global vars
//
$path = $argv[1];
echo "Inlining templates for " . $path . "\n";
$inlinedFileCount = 0;
$errorFileCount = 0;
$verbose = true;

function getTemplatePath($string) {
	$path = str_replace("'", "", $string);
	$path = str_replace("text!", "", $path);
	$path = str_replace("!strip.js", "", $path);
	$path = str_replace(" ", "", $path);
	$path = str_replace("../", "", $path);
	$path = str_replace(";", "", $path);
	return $path;
}

function getTemplateLines($path) {
	$contents = null;

	if (file_exists('../' . $path)) {
		$contents = explode("\n", file_get_contents('../' . $path));
	} else {
		echo "\n";
		echo "Warning: Missing template file: " . $path . "\n";
	}

	return $contents;
}

function isTemplateImport($line) {
	return str_starts_with($line, 'import') && (str_contains($line, 'text!'));
}

function storeTemplate($line, &$templates) {

	// parse line in form:
	// import KEY from PATH
	//
	$terms = explode(' ', $line);
	$templateKey = $terms[1];
	$templatePath = getTemplatePath($terms[3]);

	// parse template lines from file
	//
	$templateLines = getTemplateLines($templatePath);

	if ($templateLines) {

		// store template lines
		//
		$templates[$templateKey] = $templateLines;
		return $templateLines;
	} else {
		return null;
	}
}

function isTemplateInstance($line, $templates) {
	foreach ($templates as $key => $value) {
		if (str_ends_with($line, ': _.template(' . $key . '),')) {
			return true;
		}
	}
	return false;
}

function isTemplateStringInstance($line, $templates) {
	foreach ($templates as $key => $value) {
		if (str_ends_with($line, ': ' . $key . ',')) {
			return true;
		}
	}
	return false;
}

function getTemplateInstance($line, $templates) {
	foreach ($templates as $key => $value) {
		if (str_ends_with($line, '_.template(' . $key . '),')) {
			return $key;
		}
	}
}

function getTemplateStringInstance($line, $templates) {
	foreach ($templates as $key => $value) {
		if (str_ends_with($line, ': ' . $key . ',')) {
			return $key;
		}
	}
	return false;
}

function inlineTemplatesForFile($path) {
	$contents = file_get_contents($path);
	$lines = explode("\n", $contents);
	$lines2 = [];
	$templates = [];
	$missingTemplate = false;
	global $inlinedFileCount, $errorFileCount;
	$i = 0;

	while ($i < count($lines) && !$missingTemplate) {
		$line = $lines[$i++];

		// parse template imports
		//
		if (isTemplateImport($line)) {
			if (!storeTemplate($line, $templates)) {
				$missingTemplate = true;
			}

		// replace template instance
		//
		} else if (isTemplateInstance($line, $templates)) {
			$templateName = getTemplateInstance($line, $templates);
			$templateLines = $templates[$templateName];

			// inline template code
			//
			if ($templateLines) {
				if ($lines[$i - 2] != '') {
					array_push($lines2, '');
				}
				array_push($lines2, '	' . $templateName . ': template(`');
				for ($j = 0; $j < count($templateLines); $j++) {
					array_push($lines2, "\t\t" . $templateLines[$j]);
				}
				array_push($lines2, "\t" . '`),');
			} else {
				echo "Missing template file for " . $path . "\n";
			}

		} else if (isTemplateStringInstance($line, $templates)) {
			$templateName = getTemplateStringInstance($line, $templates);
			$templateLines = $templates[$templateName];

			// inline template code
			//
			if ($templateLines) {
				if ($lines[$i - 2] != '') {
					array_push($lines2, '');
				}
				array_push($lines2, '	' . $templateName . ': `');
				for ($j = 0; $j < count($templateLines); $j++) {
					array_push($lines2, "\t\t" . $templateLines[$j]);
				}
				array_push($lines2, "\t" . '`,');
			} else {
				echo "Missing template string file for " . $path . "\n";
			}

		// skip lines
		//
		} else if (str_starts_with($line, '// pre-compile template') || 
			str_starts_with($line, "\t" . '// pre-compile template')) {
			$i += 1;

		} else if (str_starts_with($line, 'let _template = _.template(Template);') ||
			str_starts_with($line, "\t" . 'let _template = _.template(Template);')) {

		// preserve existing code
		//
		} else {
			array_push($lines2, $line);
		}
	}

	$contents = implode("\n", $lines2);
	if ($missingTemplate) {
		echo "Missing template for " . $path . "\n";

		// delete script file if missing template
		//
		unlink($path);
		$errorFileCount++;
	} else if (count($templates) > 0) {
		// echo "Inlined template for " . $path . "\n";
		file_put_contents($path, $contents);
		$inlinedFileCount++;
	}
}

function inlineTemplatesForDirectory($dirname) {
	$files = scandir($dirname);
	foreach ($files as $key => $value) {
		if ($value != "." && $value != "..") {
			$path = realpath($dirname . DIRECTORY_SEPARATOR . $value);
			inlineTemplates($path);
		}
	}
}

function inlineTemplates($path) {
	if (!is_dir($path)) {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		if ($extension === "js") {
			inlineTemplatesForFile($path);
		}
	} else {
		inlineTemplatesForDirectory($path);
	}
}

inlineTemplates($path);

echo "Inlined templates for " . $inlinedFileCount . " files.\n";
echo "Encountered errors for " . $errorFileCount . " files.\n";

?>