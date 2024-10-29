/******************************************************************************\
|                                                                              |
|                              file-link-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show info about a link to a file.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LinkView from '../../../../../views/apps/file-browser/sharing/links/link-view.js';
import HtmlUtils from '../../../../../utilities/web/html-utils.js';
import Url from '../../../../../utilities/web/url.js';

export default LinkView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-file"></i>Shared File</h1>
		
		<div class="content">
			<div class="user-profile-header"></div>
			<br />
		
			<% if (message) { %>
			<p><%= username.capitalized() %> has shared the <%= target.getSize() %> file '<%= filename %>' with you along with the following message: </p>
			<div class="well"><%= message %></div>
			<% } else { %>
			<p><%= username.capitalized() %> has shared the <%= target.getSize() %> file '<%= filename %>' with you. </p>
			<% } %>
		
			<div class="buttons">
				<% if (appName) { %>
				<button class="open-file btn btn-primary btn-lg">
					<i class="fa fa-file"></i>Open File
				</button>
				<% } %>

				<button class="download-file btn btn-primary btn-lg">
					<i class="fa fa-cloud-download-alt"></i>Download File
				</button>
			</div>

			<div class="figure"></div>
		</div>
	`),

	events: {
		'click .open-file': 'onClickOpenFile',
		'click .download-file': 'onClickDownloadFile'
	},

	//
	// getting methods
	//

	getAppName: function() {
		let extension = this.model.getFileExtension().toLowerCase();
		return application.settings.associations.get(extension);
	},

	getTheme: function() {
		if (this.parent.options && this.parent.options.theme) {
			return this.parent.options.theme;
		} else if ($('body').hasClass('dark')) {
			return 'dark';
		} else if ($('body').hasClass('light')) {
			return 'light';
		}
	},

	//
	// downloading methods
	//

	openFile: function(link) {
		application.launch(this.getAppName(), {
			model: link.getFile()
		});
	},

	downloadFile: function(link, options) {

		// download file
		//
		link.download({
			icon: options && options.icon? options.icon : '<i class="fa fa-cloud-download"></i>',
			title: options && options.title? options.title : "Downloading File",

			// callbacks
			//
			success: () => {

				// go to file downloaded view
				//
				application.navigate('links/downloaded?file=' + Url.encode(link.getFilename()), {
					trigger: true
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let appName = this.getAppName();

		return {
			username: this.model.get('user').getName('short'),
			message: HtmlUtils.encode(this.model.get('message')),
			filename: this.model.getFilename(),
			appName: appName? config.apps[appName].name : undefined,
		};
	},

	onAttach: function() {
		let appName = this.getAppName();

		application.loadAppView(appName, (AppView) => {
			let queryString = '';
			let theme = this.getTheme();

			// set theme of iframe
			//
			if (theme) {
				queryString = '?theme=' + theme;
			}

			// show app inline
			//
			if (AppView) {
				if (AppView) {
					this.$el.find('.figure').append($('<iframe src="' + this.model.getUrl() + queryString + '"></iframe>'));
				}
			}
		});
	},

	//
	// mouse event handling methods
	//

	onClickOpenFile: function() {
		this.openFile(this.model);
	},

	onClickDownloadFile: function() {
		this.downloadFile(this.model);
	}
});