/******************************************************************************\
|                                                                              |
|                              file-uploadable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a file system behavior for uploading items.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Items from '../../../../../collections/storage/items.js';
import FileIterable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-iterable.js';
import ProgressDialogView from '../../../../../views/dialogs/monitoring/progress-dialog-view.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';

//
// private globals
//
let verbose = false;
let check_file_type = false;

//
// upload throttling
//

let max_uploads = 10;
let num_uploads = 0;

const until = (condition, checkInterval=100) => {
	return new Promise(resolve => {
		let interval = setInterval(() => {
			if (!condition()) return;
			clearInterval(interval);
			resolve();
		}, checkInterval)
	})
}

export default _.extend({}, FileIterable, {

	//
	// attributes
	//

	uploadable: true,
	progress_bar_delay: 1000,
	upload_warning_count: 500,

	//
	// uploading methods
	//

	uploadFile: async function(file, directory, options) {
		let self = this;
		let path = options? options.path : null;
		let upload;
		let timeout, progressBar;
		let cancelled = false, errors = 0;

		function showProgressBar() {
			progressBar = self.showProgressBar({
				title: "Uploading " + file.name,
				percent: 0,
				cancelable: true,

				// callbacks
				//
				cancel: function() {
					cancelled = true;

					// abort upload
					//
					if (upload) {
						upload.abort();
					}
				}
			});
		}

		function updateProgressBar(percent) {
			if (progressBar) {
				progressBar.setPercent(percent);
			}
		}

		function start() {

			// show progress bar after delay
			//
			if (options && options.show_progress) {
				timeout = window.setTimeout(() => showProgressBar(), self.progress_bar_delay);
			}
		}

		// make sure that directory is writable
		//
		if (!directory.isWritable()) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to write to this directory."
			});

			return;
		}

		// make sure directory is loaded
		//
		if (!directory.loaded) {

			// wait for resources
			//
			await until(() => {
				return num_uploads < max_uploads || cancelled;
			});
			num_uploads++;

			// create directory
			//
			directory.create({

				// callbacks
				//
				success: () => {

					// free resources
					//
					num_uploads--;

					// upload directory contents
					//
					this.uploadFile(file, directory, options);
				},

				error: (response) => {

					// show error message
					//
					application.error({
						message: "Could not create uploads directory.",
						response: response
					});
				}
			});

			return;
		}

		// check if file already exists
		//
		if (!path && directory.hasItemNamed(file.name) && !(options && options.overwrite)) {
			application.confirm({
				icon: '<i class="fa fa-upload"></i>',
				title: "Confirm Upload",
				message: "This location already contains a file named '" + file.name + "'.  Would you like to replace it?",

				// callbacks
				//
				accept: () => {

					// delete duplicate item
					//
					let duplicate = directory.getItemNamed(file.name);
					directory.removeItem(duplicate);
					duplicate.destroy({

						// callbacks
						//
						success: () => {
							self.uploadFile(file, directory, options);
						}
					});
				}
			});
		} else {
			await until(() => {
				return num_uploads < max_uploads || cancelled;
			});
			num_uploads++;
			start();

			// get form data
			//
			let formData = new FormData();
			formData.append('file', file);

			// create new file model
			//
			let newFile = new (Items.toItemClass(file.name))({
				name: file.name
			});

			// upload file
			//
			if (verbose) {
				console.log("Uploading file " + file.name);
			}
			return newFile.uploadTo(directory, _.extend(_.extend({}, options), {
				path: path,
				data: formData,

				// callbacks
				//
				progress: (percent) => {
					updateProgressBar(percent);

					// perform callback
					//
					if (options && options.progress) {
						options.progress(percent, options);
					}
				},

				success: (model) => {
					num_uploads--;

					// cancel progress bar
					//
					if (timeout) {
						window.clearTimeout(timeout);
					}

					// check if top level
					//
					if (!path) {
						directory.add(model);
					}

					// close progress bar, if it exists
					//
					if (progressBar) {
						progressBar.close();
					}

					// perform callback
					//
					if (options && options.success) {
						options.success(model, options);
					}
				},

				error: (model, response) => {

					// cancel progress bar
					//
					if (timeout) {
						window.clearTimeout(timeout);
					}

					// close progress bar, if it exists
					//
					if (progressBar) {
						progressBar.close();
					}

					// perform callback
					//
					if (!cancelled && !errors) {
						if (options && options.error) {
							options.error(model, response);
						}
						errors++;
					}
				}
			}));
		}
	},

	uploadFiles: async function(files, directory, options) {
		let self = this;
		let uploads = [], uploaded = [];
		let timeout, progressBar;
		let cancelled = false, errors = 0;

		function abort() {
			if (uploads.length > 0) {
				for (let i = 0; i < uploads.length; i++) {
					uploads[i].then((upload) => {
						upload.abort();
					});
				}
			}
			uploads = [];
			num_uploads = 0;
		}

		function showProgressBar() {
			progressBar = self.showProgressBar({
				title: "Uploading " + files.length + " Files",
				fraction: {
					numerator: 1,
					denominator: files.length
				},
				cancelable: true,

				// callbacks
				//
				cancel: function() {
					cancelled = true;

					// abort all uploads
					//
					abort();
				}
			});
		}

		function updateProgressBar() {
			if (progressBar) {
				progressBar.setFraction(uploaded.length, files.length);
			}
		}

		function start() {

			// show progress bar after delay
			//
			if (options && options.show_progress) {
				timeout = window.setTimeout(() => showProgressBar(), self.progress_bar_delay);
			}
		}

		function update() {
			updateProgressBar();
		}

		function finish() {

			// cancel progress bar
			//
			if (timeout) {
				window.clearTimeout(timeout);
			}

			// close progress bar, if it exists
			//
			if (progressBar) {
				progressBar.close();
			}

			// perform callback
			//
			if (options && options.success) {
				options.success(uploaded, options);
			}
		}

		function uploadFile(file) {
			return self.uploadFile(file, directory, _.extend({}, options, {
				show_progress: false,

				// callbacks
				//
				success: (file) => {
					uploaded.push(file);
					update();

					// check if finished
					//
					if (uploaded.length == files.length) {
						finish();
					}
				},

				error: (file, response) => {

					// only report the first error
					//
					if (errors) {
						return;
					}

					// show error message
					//
					application.error({
						message: "Could not upload file.",
						response: response
					});

					errors++;
				}
			}));
		}

		// make sure that directory is writable
		//
		if (!directory.isWritable()) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to write to this directory."
			});

			return;
		}

		// make sure directory is loaded
		//
		if (!directory.loaded) {

			// wait for resources
			//
			await until(() => {
				return num_uploads < max_uploads || cancelled;
			});
			num_uploads++;

			// create directory
			//
			directory.create({

				// callbacks
				//
				success: () => {

					// free resources
					//
					num_uploads--;

					// upload directory contents
					//
					this.uploadFiles(files, directory, options);
				},

				error: (response) => {

					// show error message
					//
					application.error({
						message: "Could not create uploads directory.",
						response: response
					});
				}
			});

			return;
		}

		// iterate through files
		//
		start();
		for (let i = 0; i < files.length; i++) {
			let file = files[i];

			// check for errors
			//
			if (!errors) {
				if (check_file_type && file.type == '') {

					// show alert message
					//
					application.alert({
						icon: '<i class="fa fa-upload"></i>',
						title: "Upload Error",
						message: "The current version of your web browser can not upload folders.  Please try installing a newer version or using different type of web browser."
					});

					return;
				}

				// add file to uploads
				//
				uploads.push(uploadFile(file));
			} else {
				break;
			}
		}
	},

	uploadDirectory: async function(directoryEntry, directory, options) {
		let self = this;
		let completed = 0, numItems;
		let path = options? options.path : null;
		let uploads = [];
		let timeout, progressBar;
		let cancelled = false, errors = 0;

		function abort() {
			if (uploads.length > 0) {
				for (let i = 0; i < uploads.length; i++) {
					uploads[i].then((upload) => {
						upload.abort();
					});
				}
			}
			uploads = [];
			num_uploads = 0;
		}

		function showProgressBar() {
			progressBar = self.showProgressBar({
				title: "Uploading " + directoryEntry.name,
				fraction: {
					numerator: 1,
					denominator: numItems
				},
				cancelable: true,

				// callbacks
				//
				cancel: function() {
					cancelled = true;

					// abort all uploads
					//
					abort();
				}
			});
		}

		function updateProgressBar() {
			if (progressBar) {
				progressBar.setFraction(completed, numItems);
			}
		}

		function progress(percent, options) {
			let upload = uploads[options.index];

			// make sure we have an upload to track
			//
			if (!upload) {
				return;
			}

			// update progress
			//
			upload.progress = percent;
		}

		function start() {

			// show progress bar after delay
			//
			if (options && options.show_progress) {
				timeout = window.setTimeout(() => showProgressBar(), self.progress_bar_delay);
			}
		}

		function update() {
			completed++;
			updateProgressBar();
		}

		function error(model, response) {

			// cancel progress bar
			//
			if (timeout) {
				window.clearTimeout(timeout);
			}

			// close progress bar, if it exists
			//
			if (progressBar) {
				progressBar.close();
			}

			// perform callback
			//
			if (!cancelled && !errors) {
				if (options && options.error) {
					options.error(model, response);
				}
				errors++;
			}
		}

		function finish(model) {

			// cancel progress bar
			//
			if (timeout) {
				window.clearTimeout(timeout);
			}

			// close progress bar, if it exists
			//
			if (progressBar) {
				progressBar.close();
			}

			// perform callback
			//
			if (options && options.success) {
				options.success(model, options);
			}
		}

		async function uploadSubDirectory(directoryEntry, directory, options) {

			// wait for resources
			//
			await until(() => {
				return num_uploads < max_uploads || cancelled;
			});
			num_uploads++;

			// create directory
			//
			let dirname = directory.path? directory.path + directoryEntry.name + '/': directoryEntry.name + '/';
			return directory.createDirectory(FileUtils.getDirectoryName(dirname), {

				// options
				//
				overwrite: options && options.overwrite,
				permissions: directory.getPermissions(),

				// callbacks
				//
				success: (directory) => {

					// free resources
					//
					num_uploads--;

					// upload directory contents
					//
					self.iterateDirectoryItems(directoryEntry, (entry, options) => {
						uploadEntry(entry, directory, () => {
							update();

							// perform callback
							//
							if (options && options.success) {
								options.success();
							}
						});
					}, {
						async: true,
						success: options? options.success : null
					});
				}
			});
		}

		function uploadEntry(entry, directory, finish) {

			// return if cancelled
			//
			if (cancelled) {
				finish();
				return;
			}

			// upload entry
			//
			if (entry.isFile) {
				entry.file((file) => {
					uploads.push(self.uploadFile(file, directory, {
						show_progress: false,
						index: uploads.length,

						// callbacks
						//
						progress: progress,
						success: finish,
						error: error
					}));
				});
			} else {
				uploadSubDirectory(entry, directory, {
					show_progress: false,

					// callbacks
					//
					progress: progress,
					success: finish,
					error: error
				});
			}
		}

		async function startUpload() {
			start();

			// wait for resources
			//
			await until(() => {
				return num_uploads < max_uploads || cancelled;
			});
			num_uploads++;

			// create directory
			//
			if (verbose) {
				console.log("Uploading directory " + directoryEntry.name);
			}
			let dirname = directory.path? directory.path + directoryEntry.name + '/': directoryEntry.name + '/';
			directory.createDirectory(FileUtils.getDirectoryName(dirname), {

				// options
				//
				overwrite: options && options.overwrite,
				permissions: directory.getPermissions(),

				// callbacks
				//
				success: (directory) => {

					// free resources
					//
					num_uploads--;

					// upload directory contents
					//
					self.iterateDirectoryItems(directoryEntry, (entry, options) => {
						uploadEntry(entry, directory, () => {
							update();

							// perform callback
							//
							if (options && options.success) {
								options.success();
							}
						});
					}, {
						async: true,

						// callbacks
						//
						success: () => {
							finish(directory);
						}
					});
				}
			});
		}

		// make sure that directory is writable
		//
		if (!directory.isWritable()) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to write to this directory."
			});

			return;
		}

		// make sure directory is loaded
		//
		if (!directory.loaded) {

			// wait for resources
			//
			await until(() => {
				return num_uploads < max_uploads || cancelled;
			});
			num_uploads++;

			// create directory
			//
			directory.create({

				// callbacks
				//
				success: () => {

					// free resources
					//
					num_uploads--;

					// upload directory contents
					//
					this.uploadDirectory(directoryEntry, directory, options);
				},

				error: (response) => {

					// show error message
					//
					application.error({
						message: "Could not create uploads directory.",
						response: response
					});
				}
			});

			return;
		}

		// check if directory already exists
		//
		if (!path && directory.hasItemNamed(directoryEntry.name) && !(options && options.overwrite)) {
			application.confirm({
				icon: '<i class="fa fa-upload"></i>',
				title: "Confirm Upload",
				message: "This location already contains a file named '" + directoryEntry.name + "'.  Would you like to replace it?",

				// callbacks
				//
				accept: () => {

					// delete duplicate item
					//
					let duplicate = directory.getItemNamed(directoryEntry.name);
					directory.removeItem(duplicate);
					duplicate.destroy({

						// callbacks
						//
						success: () => {
							self.uploadDirectory(directoryEntry, directory, options);
						}
					});
				}
			});
		} else {

			// count items in directory and begin upload
			//
			this.countDirectoryItems(directoryEntry, (num) => {
				numItems = num;
				if (numItems > self.upload_warning_count) {
					application.confirm({
						icon: '<i class="fa fa-upload"></i>',
						title: "Confirm Upload",
						message: "This directory contains " + numItems + " items. When uploading large numbers of files, it may be quicker to compress them first and upload them as a single large compressed file.",

						// callbacks
						//
						accept: () => startUpload()
					});
				} else {
					startUpload();
				}
			});
		}
	},

	uploadMultipleItems: async function(items, directory, options) {
		let self = this;
		let completed = 0, numItems,  percentCompleted = 0;
		let entries = [], uploads = [], uploadedItems = [];
		let timeout, progressBar;
		let cancelled = false, errors = 0;

		function abort() {
			if (uploads.length > 0) {
				for (let i = 0; i < uploads.length; i++) {
					uploads[i].abort();
				}
			}
			uploads = [];
		}

		function showProgressBar() {
			progressBar = self.showProgressBar({
				title: "Uploading " + entries.length + " Items",
				fraction: {
					numerator: 1,
					denominator: entries.length
				},
				cancelable: true,

				// callbacks
				//
				cancel: function() {
					cancelled = true;

					// abort all uploads
					//
					abort();
				}
			});
		}

		function updateProgressBar() {
			if (progressBar) {
				progressBar.setFraction(completed, numItems);
			}
		}

		function progress(percent, options) {
			let upload = uploads[options.index];
			let percentChange = 0;

			// make sure we have an upload to track
			//
			if (!upload) {
				return;
			}

			// find change in progress in upload
			//
			if (upload.progress) {
				percentChange = percent - upload.progress;
			} else {
				percentChange = percent;
			}

			// update progress
			//
			upload.progress = percent;
			percentCompleted += percentChange / numItems;

			// update progress bar
			//
			if (progressBar) {
				progressBar.setBarPercent(percentCompleted);
			}
		}

		function start() {

			// show progress bar after delay
			//
			if (options && options.show_progress) {
				timeout = window.setTimeout(() => showProgressBar(), self.progress_bar_delay);
			}
		}

		function update() {
			completed++;
			updateProgressBar();
		}

		function error(model, response) {

			// cancel progress bar
			//
			if (timeout) {
				window.clearTimeout(timeout);
			}

			// close progress bar, if it exists
			//
			if (progressBar) {
				progressBar.close();
			}

			// perform callback
			//
			if (!cancelled && !errors) {
				if (options && options.error) {
					options.error(model, response);
				}
				errors++;
			}
		}

		function finish() {

			// cancel progress bar
			//
			if (timeout) {
				window.clearTimeout(timeout);
			}

			// close progress bar, if it exists
			//
			if (progressBar) {
				progressBar.close();
			}

			// perform callback
			//
			if (options && options.success) {
				options.success(uploadedItems, options);
			}
		}

		async function uploadSubDirectory(directoryEntry, directory, options) {

			// wait for resources
			//
			await until(() => {
				return num_uploads < max_uploads || cancelled;
			});
			num_uploads++;

			// create directory
			//
			let dirname = directory.path? directory.path + directoryEntry.name + '/': directoryEntry.name + '/';
			return directory.createDirectory(FileUtils.getDirectoryName(dirname), {

				// options
				//
				overwrite: options && options.overwrite,
				permissions: directory.getPermissions(),

				// callbacks
				//
				success: (directory) => {

					// free resources
					//
					num_uploads--;

					// upload directory contents
					//
					update();
					self.iterateDirectoryItems(directoryEntry, (entry, options) => {
						uploadEntry(entry, directory, () => {
							update();
							if (options && options.success) {
								options.success();
							}
						});
					}, {
						async: true,
						success: options? options.success : null
					});
				}
			});
		}

		function uploadEntry(entry, directory, finish) {

			// return if cancelled
			//
			if (cancelled) {
				finish();
				return;
			}

			// upload entry
			//
			if (entry.isFile) {
				entry.file((file) => {
					uploads.push(self.uploadFile(file, directory, {
						show_progress: false,
						overwrite: true,
						index: uploads.length,

						// callbacks
						//
						progress: progress,
						success: finish,
						error: error
					}));
				});
			} else {
				uploadSubDirectory(entry, directory, {
					show_progress: false,
					overwrite: true,

					// callbacks
					//
					progress: progress,
					success: finish,
					error: error
				});
			}
		}

		function uploadEntries(entries, finish) {
			let completed = 0, numEntries = entries.length;

			function onUpload(item) {
				update();
				uploadedItems.push(item);

				// check to see if we are finished
				//
				completed++;
				if (completed == numEntries && finish) {
					finish();
				}
			}

			start();
			for (let i = 0; i < entries.length; i++) {
				uploadEntry(entries[i], directory, onUpload);
			}
		}

		// make sure that directory is writable
		//
		if (!directory.isWritable()) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to write to this directory."
			});

			return;
		}

		// make sure directory is loaded
		//
		if (!directory.loaded) {

			// wait for resources
			//
			await until(() => {
				return num_uploads < max_uploads || cancelled;
			});
			num_uploads++;

			// create directory
			//
			directory.create({

				// callbacks
				//
				success: () => {

					// free resources
					//
					num_uploads--;

					// upload directory contents
					//
					this.uploadMultipleItems(items, directory, options);
				},

				error: (response) => {

					// show error message
					//
					application.error({
						message: "Could not create uploads directory.",
						response: response
					});
				}
			});

			return;
		}

		// get entries
		//
		for (let i = 0; i < items.length; i++) {
			entries.push(items[i].webkitGetAsEntry());
		}

		// count items in directory and begin upload
		//
		this.countItems(items, (num) => {
			numItems = num;
			if (numItems > self.upload_warning_count) {
				application.confirm({
					icon: '<i class="fa fa-upload"></i>',
					title: "Confirm Upload",
					message: "This directory contains " + numItems + " items. When uploading large numbers of files, it may be quicker to compress them first and upload them as a single large compressed file.",

					// callbacks
					//
					accept: () => uploadEntries(entries, finish)
				});
			} else {
				uploadEntries(entries, finish);
			}
		});
	},

	uploadItems: async function(items, directory, options) {

		// make sure directory is loaded
		//
		if (!directory.loaded) {

			// wait for resources
			//
			await until(() => {
				return num_uploads < max_uploads;
			});
			num_uploads++;

			directory.create({

				// callbacks
				//
				success: () => {

					// free resources
					//
					// num_uploads--;

					// upload directory items
					//
					this.uploadItems(items, directory, options);
				},

				error: (response) => {

					// show error message
					//
					application.error({
						message: "Could not create uploads directory.",
						response: response
					});
				}
			});
			
			return;
		}

		// check number of items to upload
		//
		if (items.length == 1) {
			let entry = items[0].webkitGetAsEntry();

			// upload a single file
			//
			if (entry.isFile) {
				entry.file((file) => {
					this.uploadFile(file, directory, _.extend({}, options, {

						// callbacks
						//
						success: (model) => {
							if (options && options.success) {
								options.success([model]);
							}
						},
						error: (model, response) => {
							if (options && options.error) {
								options.error(model, response);
							}
						}
					}));
				});

			// upload a single directory
			//
			} else {
				this.uploadDirectory(entry, directory, _.extend({}, options, {

					// callbacks
					//
					success: (model) => {
						if (options && options.success) {
							options.success([model]);
						}
					},
					error: (model, response) => {
						if (options && options.error) {
							options.error(model, response);
						}
					}
				}));
			}
		} else {

			// upload multiple files and directories
			//
			this.uploadMultipleItems(items, directory, options);
		}
	},

	//
	// rendering methods
	//

	showProgressBar: function(options) {
		return application.show(new ProgressDialogView(_.extend({
			icon: '<i class="fa fa-upload"></i>',
			title: "Uploading",
			message: "Uploading"
		}, options)));
	}
});