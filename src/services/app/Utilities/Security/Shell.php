<?php
/******************************************************************************\
|                                                                              |
|                                 Shell.php                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for performing password encryption.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\Security;

use App\Models\Users\User;
use App\Utilities\Storage\FileStorage;

class Shell
{
	//
	// static methods
	//

	public $directory = '';

	//
	// constructor
	//

	function __construct($options) {

		// set attributes
		//
		if ($options && $options['directory']) {
			$this->directory = $options['directory'];
		}
	}

	/**
	 * Return the home directory.
	 *
	 * @return string
	 */
	public function home(): string {
		return FileStorage::home();
	}

	/**
	 * Return the current directory.
	 *
	 * @return string
	 */
	public function current(): string {
		return $this->home() . $this->directory;
	}

	/**
	 * Convert an absolute path to a path relative to the home directory.
	 *
	 * @return string
	 */
	public function toAbsolutePath($path): string {
		$relativePath = $this->toRelativePath($path);
		if ($relativePath == -1) {
			return -1;
		}

		return self::home() . $relativePath;
	}

	public function isValidPath($path): bool {
		return $this->toRelativePath($path) != -1;
	}

	/**
	 * Convert an path to a path relative to the home directory.
	 *
	 * @return string
	 */
	public function toRelativePath($path) {
		$current = $this->directory;

		// home directory
		//
		if ($path == '~') {
			return '';

		// current directory
		//
		} else if (!$path || $path == '.') {
			return $current;

		// dereferenced home directory
		//
		} else if (str_starts_with($path, '~/')) {
			return $this->toRelativePath(substr($path, 2));

		// dereferenced current directory
		//
		} else if (str_starts_with($path, './')) {
			return $this->toRelativePath($current . '/' . substr($path, 1));

		// remove initial slashes
		//
		} else if (str_starts_with($path, '/')) {
			return $this->toRelativePath(substr($path, 1));

		// go up in directory hierarchy
		//
		} else if (str_starts_with($path, '..')) {

			// add trailing slash
			//
			if (!str_ends_with($path, '/')) {
				$path = $path . '/';
			}

			// count number of dereferences
			//
			$numLevels = 0;
			while (str_starts_with($path, '../')) {
				$path = substr($path, 3);
				$numLevels++;
			}

			// concatenate paths
			//
			if ($path) {
				$path = trim($current . '/' . $path, '/');
			} else {
				$path = trim($current);
			}

			// dereference full path
			//
			$terms = explode('/', $path);
			$numTerms = count($terms);
			if ($numLevels < $numTerms) {
				$terms = array_slice($terms, 0, $numTerms - $numLevels);
				$path = implode('/', $terms);
				return $path;
			} else {
				return -1;
			}

		// dereference current directory
		//
		} else {
			return $current . '/' . $path;
		}
	}

	/**
	 * Execute a cd command.
	 *
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function cd(array $flags, array $args): string {
		if (count($args) < 1) {
			return '';
		}

		// get target directory
		//
		$directory = $args[0];

		// get path relative to current directory
		//
		$path = $this->toRelativePath($directory);
		if ($path == -1) {
			return "Can not access this directory.";
		}

		// find root path
		//
		$rootPath = FileStorage::home() . '/' . $path;
		if (file_exists($rootPath)) {
			if (is_dir($rootPath)) {
				$this->directory = $path;
				return '';
			} else {
				return $path . " is not a directory.";
			}
		} else {
			return "Directory does not exist.";
		}
	}

	/**
	 * Execute a cp command.
	 *
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function cp(array $flags, array $args): string{
		return $this->exec2('cp', $flags, $args);
	}

	/**
	 * Execute a ls command.
	 *
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function ls(array $flags, array $args): string {
		return $this->exec1('ls', $flags, $args);
	}

	/**
	 * Execute a mkdir command.
	 *
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function mkdir(array $flags, array $args): string {
		return $this->exec1('mkdir', $flags, $args);
	}

	/**
	 * Execute a mv command.
	 *
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function mv(array $flags, array $args): string {
		return $this->exec2('mv', $flags, $args);
	}

	/**
	 * Execute a pwd command.
	 *
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function pwd(array $flags): string {

		// compose command
		//
		$command = implode(' ', array_merge(['pwd'], $flags));
		$script = 'cd ' . $this->current() . '; ' . $command;

		// execute command
		//
		$output = trim(shell_exec($script . " 2>&1"));

		// strip user directory
		//
		return '/' . str_replace(FileStorage::root(), '', $output);
	}

	/**
	 * Execute a rm command.
	 *
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function rm(array $flags, array $args): string {
		return $this->exec1('rm', $flags, $args);
	}

	/**
	 * Execute a rmdir command.
	 *
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function rmdir(array $flags, array $args): string {
		return $this->exec1('rmdir', $flags, $args);
	}

	/**
	 * Execute a whoami command.
	 *
	 * @return string
	 */
	public function whoami(): string {
		return User::current()->account->username;
	}

	/**
	 * Execute a shell command.
	 *
	 * @param string $command - the command to run.
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function exec(string $executable, array $flags, array $args): string {
		switch ($executable) {
			case 'cd':
				return $this->cd($flags, $args);
			case 'cp':
				return $this->cp($flags, $args);
			case 'ls':
				return $this->ls($flags, $args);
			case 'mkdir':
				return $this->mkdir($flags, $args);
			case 'mv':
				return $this->mv($flags, $args);
			case 'pwd':
				return $this->pwd($flags, $args);
			case 'rm':
				return $this->rm($flags, $args);
			case 'rmdir':
				return $this->rmdir($flags, $args);
			case 'whoami':
				return $this->whoami();
			default:
				return 'Command not found.';
		}
	}

	/**
	 * Execute a shell command with one operand.
	 *
	 * @param string $command - the command to run.
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function exec1(string $executable, array $flags, array $args): string {
		$path = $this->toAbsolutePath($args? $args[0] : '');

		// check first path argument
		//
		if ($path == -1) {
			return "Can not access this file or directory.";
		}

		// compose command
		//
		$command = implode(' ', array_merge([$executable], $flags, [$path]));
		$script = 'cd ' . $this->current() . '; ' . $command;

		// execute command
		//
		return trim(shell_exec($script . " 2>&1"));
	}

	/**
	 * Execute a shell command with two operands.
	 *
	 * @param string $command - the command to run.
	 * @param string $flags - the flags to pass.
	 * @param string $args - the arguments to pass.
	 * @return string
	 */
	public function exec2(string $executable, array $flags, array $args): string {
		$path1 = $this->toAbsolutePath($args? $args[0] : '');
		$path2 = $this->toAbsolutePath($args? $args[1] : '');

		// check first and second path arguments
		//
		if ($path1 == -1 || $path2 == -1) {
			return "Can not access this file or directory.";
		}

		// compose command
		//
		$command = implode(' ', array_merge([$executable], $flags, [$path1], [$path2]));
		$script = 'cd ' . $this->current() . '; ' . $command;

		// execute command
		//
		return trim(shell_exec($script . " 2>&1"));
	}

	/**
	 * parse the executable from a command.
	 *
	 * @return string
	 */
	public static function parseExecutable(string $command): string {
		$terms = explode(' ', $command);
		return $terms[0];
	}

	/**
	 * parse the flags from a command.
	 *
	 * @return string
	 */
	public static function parseFlags(string $command): array {
		$flags = [];
		$terms = explode(' ', $command);
		for ($i = 1; $i < count($terms); $i++) {
			$term = $terms[$i];
			if (str_starts_with($term, '-')) {
				array_push($flags, $term);
			}
		}
		return $flags;
	}

	/**
	 * parse the flags from a command.
	 *
	 * @return string
	 */
	public static function parseArgs(string $command): array {
		$args = [];
		$terms = explode(' ', $command);
		for ($i = 1; $i < count($terms); $i++) {
			$term = $terms[$i];
			if (!str_starts_with($term, '-')) {
				array_push($args, $term);
			}
		}
		return $args;
	}
}