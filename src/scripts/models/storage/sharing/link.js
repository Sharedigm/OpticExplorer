/******************************************************************************\
|                                                                              |
|                                    link.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a link to a file or directory.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../../models/utilities/timestamped.js';
import User from '../../../models/users/user.js';
import Items from '../../../collections/storage/items.js';
import ProgressDialogView from '../../../views/dialogs/monitoring/progress-dialog-view.js';
import FileUtils from '../../../utilities/files/file-utils.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		target: null,
		editable: null,
		message: "",
		limit: null,
		expiration_date: null
	},

	progressBarDelay: 1000,

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/links',

	//
	// querying methods
	//

	isProtected: function() {
		return this.has('password') && this.get('password') != '';
	},

	//
	// getting methods
	//

	getUrl: function() {
		return application.getUrl() + '#links/' + this.get('id');
	},

	getDownloadUrl: function() {
		return this.url() + '/download' + (this.isProtected()? '?password=' + this.get('password') : '');	
	},

	getDirname: function() {
		let path = this.get('path');
		return path? path.substring(0, path.length - 1) : '';
	},

	getPath: function() {
		return this.has('target')? this.get('target').get('path') : undefined;
	},

	getFilename: function() {
		return FileUtils.getFileName(this.getPath());
	},

	getDirectoryName: function() {
		return FileUtils.getDirectoryName(this.getPath());
	},

	getFileExtension: function() {
		return FileUtils.getFileExtension(this.getPath());
	},

	getFile: function() {
		let path = this.get('target').get('path');
		let ItemClass = Items.toItemClass(path);
		return new ItemClass(_.extend({}, this.get('target').attributes, {
			link: this
		}));
	},

	//
	// data getting methods
	//

	getData: function(data) {

		// set optional parameter defaults
		//
		if (!data) {
			data = {};
		}

		// add link uuid
		//
		if (this.has('id')) {
			data.link_id = this.get('id');
		}

		// add link's password
		//
		if (this.has('password')) {
			data.password = this.get('password');
		}

		return data;
	},
	
	getQueryString: function(queryString) {

		// set optional parameter defaults
		//
		if (!queryString) {
			queryString = '';
		}

		// add link uuid
		//
		if (this.has('id')) {
			if (queryString != '') {
				queryString += '&';
			}
			queryString += 'link_id=' + this.get('id');
		}

		// add link's password
		//
		if (this.has('password')) {
			if (queryString != '') {
				queryString += '&';
			}
			queryString += 'password=' + this.get('password');
		}

		return queryString;
	},
	
	//
	// downloading methods
	//

	download: function(options) {
		let self = this;
		let url = this.getDownloadUrl({
			password: this.has('password')? this.get('password') : null
		});
		let timeout, progressBar;
		let download;

		function showProgressBar() {
			progressBar = self.showProgressBar({
				title: options && options.title? options.title : "Downloading",
				icon: options && options.icon? options.icon : "fa-download",
				cancelable: true,

				// callbacks
				//
				cancel: function() {

					// abort upload
					//
					if (download) {
						download.abort();
					}
				}
			});
		}

		timeout = window.setTimeout(() => showProgressBar(), self.progressBarDelay);

		download = $.ajax(url, {
			type: 'GET',

			xhr: function () {
				let xhr = new window.XMLHttpRequest();

				// handle download progress
				//
				xhr.addEventListener("progress", function (event) {
					let percent = 0;
					let position = event.loaded || event.position;
					let total = event.total;
					if (event.lengthComputable) {
						percent = Math.ceil(position / total * 100);
					}

					// update progress bar
					//
					if (progressBar) {
						progressBar.setPercent(percent);
					}
				}, false);
				return xhr;
			},

			// callbacks
			//

			success: () => {

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
					
				// show in new page
				//
				application.showUrl(url);

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		});
	},

	//
	// rendering methods
	//

	showProgressBar: function(options) {
		return application.show(new ProgressDialogView(_.extend({
			icon: '<i class="fa fa-download"></i>',
			title: "Downloading",
			message: "Downloaded",
			percent: 0
		}, options)));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let json = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (json.user) {
			json.user = new User(json.user);
		}
		if (json.target) {
			json.target = Items.toItem(json.target);
		}
		if (json.expiration_date) {
			json.expiration_date = this.toDate(json.expiration_date);
		}

		return json;
	},
});