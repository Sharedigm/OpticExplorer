/******************************************************************************\
|                                                                              |
|                               file-iterable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains utilities for iterating through items.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileUtils from '../../../../../utilities/files/file-utils.js';
//
// private variables
//
let filters = {
	is_file: (item) => item.isFile,
	is_directory: (item) => item.isDirectory,
	is_visible: (item) => !FileUtils.getFileName(item.fullPath).startsWith('.'),
	is_visible_file: (item) => this.is_file(item) && this.is_directory(item),
	is_visible_directory: (item) => this.is_file(item) && this.is_directory(item)
};
filters.is_visible.recursive = true;
filters.is_visible_directory.recursive = true;

export default {

	//
	// attributes
	//

	filters: filters,

	//
	// iterating methods
	//

	iterateDirectoryItems: function(directoryEntry, callback, options) {
		let dirReader = directoryEntry.createReader();

		//
		// local functions
		//

		function iterateFile(entry, finish) {

			// process file entry
			//
			if (options && options.filter) {

				// check filtering
				//
				if (options.filter(entry)) {
					callback(entry, {

						// callbacks
						//
						success: () => {
							if (options && options.async) {
								finish();
							}
						}
					});
				}
			} else {
				callback(entry, {

					// callbacks
					//
					success: () => {
						if (options && options.async) {
							finish();
						}
					}
				});
			}

			if (!options || !options.async) {
				finish();
			}
		}

		function iterateDirectory(iterable, entry, finish) {

			// process directory entry
			//
			if (options && options.filter) {

				// check filtering
				//
				if (options.filter(entry)) {
					callback(entry, {

						// callbacks
						//
						success: () => {

							// iterate directory contents
							//
							if (options && options.async) {
								iterateDirectoryContents(iterable, entry, finish);
							}							
						}									
					});
				} else if (options.filter.recursive) {

					// skip directory contents
					//
					finish();
					return;
				}
			} else {
				callback(entry, {

					// callbacks
					//
					success: () => {

						// iterate directory contents
						//
						if (options && options.async) {
							iterateDirectoryContents(iterable, entry, finish);
						}							
					}
				});
			}

			// iterate directory contents
			//
			if (!options || !options.async) {
				iterateDirectoryContents(iterable, entry, finish);
			}
		}

		function iterateSubDirectory(iterable, entry, finish) {

			// process entry
			//
			if (options && options.filter) {

				// check filtering
				//
				if (options.filter(entry)) {
					callback(entry, {

						// callbacks
						//
						success: () => {

							// iterate directory contents
							//
							if (options && options.async) {
								finish();
							}
						}
					});
				} else if (options.filter.recursive) {

					// skip directory contents
					//
					finish();
					return;
				}
			} else {
				callback(entry, {
					
					// callbacks
					//
					success: () => {

						// iterate directory contents
						//
						if (options && options.async) {
							finish();
						}
					}				
				});
			}

			// done
			//
			if (!options || !options.async) {
				finish();
			}
		}

		function iterateDirectoryContents(iterable, entry, finish) {
			iterable.iterateDirectoryItems(entry, callback, {
				async: options? options.async : false,

				// callbacks
				//
				filter: options? options.filter : null,
				success: finish
			});	
		}

		function iterateEntry(iterable, entry, finish) {
			if (entry.isFile) {
				iterateFile(entry, finish);
			} else if (entry.isDirectory && options && options.async) {
				iterateSubDirectory(iterable, entry, finish);
			} else if (entry.isDirectory) {
				iterateDirectory(iterable, entry, finish);
			}
		}

		async function iterateEntries(iterable, entries, condition) {
			let count = 0;

			function onIterate() {
				count++;

				// process next set of entries
				//
				if (count == entries.length) {
					readEntries(iterable);
				}		
			}

			// iterate through entries
			//
			for (let i = 0; i < entries.length; i++) {
				if (condition) {
					await condition();
				}
				iterateEntry(iterable, entries[i], onIterate);
			}
		}

		async function readEntries(iterable, condition) {
			dirReader.readEntries((entries) => {

				// check if done
				//
				if (entries.length == 0 && options && options.success) {
					options.success();
				} else {
					iterateEntries(iterable, entries, condition);
				}
			});
		}

		// process next set of entries
		//
		readEntries(this, options? options.condition : undefined);
	},
	
	iterateItems: async function(items, callback, options) {

		//
		// local functions
		//

		function iterateFile(entry, finish) {

			// process file entry
			//
			if (options && options.filter) {

				// check filtering
				//
				if (options.filter(entry)) {
					callback(entry, {

						// callbacks
						//
						success: () => {

							// iterate directory contents
							//
							if (options && options.async) {
								finish();
							}
						}
					});
				}
			} else {
				callback(entry, {

					// callbacks
					//
					success: () => {

						// iterate directory contents
						//
						if (options && options.async) {
							finish();
						}
					}
				});
			}

			if (!options || !options.async) {
				finish();
			}
		}

		function iterateDirectory(iterable, entry, finish) {

			// process entry
			//
			if (options && options.filter) {

				// check filtering
				//
				if (options.filter(entry)) {
					callback(entry, {

						// callbacks
						//
						success: () => {

							// iterate directory contents
							//
							if (options && options.async) {
								iterateDirectoryContents(iterable, entry, finish);
							}
						}
					});
				} else if (options.filter.recursive) {

					// skip directory contents
					//
					finish();
					return;
				}
			} else {
				callback(entry, {
					
					// callbacks
					//
					success: () => {

						// iterate directory contents
						//
						if (options && options.async) {
							iterateDirectoryContents(iterable, entry, finish);
						}
					}				
				});
			}

			// iterate directory contents
			//
			if (!options || !options.async) {
				iterateDirectoryContents(iterable, entry, finish);
			}
		}

		function iterateDirectoryContents(iterable, entry, finish) {
			iterable.iterateDirectoryItems(entry, callback, {

				// callbacks
				//
				filter: options? options.filter : null,
				success: finish
			});	
		}

		function iterateEntry(iterable, entry, finish) {
			if (entry.isFile) {
				iterateFile(entry, finish);
			} else if (entry.isDirectory) {
				iterateDirectory(iterable, entry, finish);
			}
		}

		async function iterateItems(iterable, items, finish) {
			let count = 0, numItems = items.length;

			function onIterate() {

				// check if done
				//
				count++;
				if (count == numItems && finish) {
					finish();
				}		
			}

			for (let i = 0; i < items.length; i++) {
				if (options && options.condition) {
					await options.condition();
				}
				iterateEntry(iterable, items[i].webkitGetAsEntry(), onIterate);
			}
		}

		// iterate through items
		//
		iterateItems(this, items, () => {
			if (options && options.success) {
				options.success();
			}
		});
	},

	//
	// item counting methods
	//

	countDirectoryItems: function(items, callback, options) {
		let count = 0;
		this.iterateDirectoryItems(items, () => {
			count++;
		}, {
			// callbacks
			//
			filter: options && options.filter? options.filter : null,
			success: () => callback(count)
		});
	},

	countItems: function(items, callback, options) {
		let count = 0;
		this.iterateItems(items, () => {
			count++;
		}, {
			// callbacks
			//
			filter: options && options.filter? options.filter : null,
			success: () => callback(count)
		});
	},

	//
	// file counting methods
	//

	countDirectoryFiles: function(items, callback) {
		let count = 0;
		this.iterateDirectoryItems(items, () => {
			count++;
		}, {
			// callbacks
			//
			filter: this.filters.is_file,
			success: () => {
				callback(count);
			}
		});
	},

	countFiles: function(items, callback) {
		let count = 0;
		this.iterateItems(items, () => {
			count++;
		}, {
			// callbacks
			//
			filter: this.filters.is_file,
			success: () => {
				callback(count);
			}
		});
	}
};