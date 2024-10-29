/******************************************************************************\
|                                                                              |
|                              volume-link-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show info about a link to a volume.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Volume from '../../../../../models/storage/directories/volume.js';
import LinkView from '../../../../../views/apps/file-browser/sharing/links/link-view.js';
import HtmlUtils from '../../../../../utilities/web/html-utils.js';

export default LinkView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-database"></i>Shared Volume</h1>
		
		<div class="content">
			<div class="user-profile-header"></div>
			<br />
		
			<% if (message) { %>
			<p><%= username.capitalized() %> has shared the volume '<%= dirname %>' with you along with the following message: </p>
			<div class="well"><%= message %></div>
			<% } else { %>
			<p><%= username.capitalized() %> has shared the volume '<%= dirname %>' with you. </p>
			<% } %>
		
			<div class="buttons">
				<button class="open-volume btn btn-primary btn-lg">
					<i class="fa fa-database"></i>Open Volume
				</button>
			</div>
		</div>
	`),

	events: {
		'click .open-volume': 'onClickOpenVolume'
	},

	//
	// rendering methods
	//

	templateContext: function() {			
		return {
			username: this.model.get('user').getName('short'),
			message: HtmlUtils.encode(this.model.get('message')),
			dirname: this.model.getDirectoryName()
		};
	},

	//
	// loading methods
	//

	loadVolume: function(options) {
		new Volume({
			link: this.model
		}).load({

			// callbacks
			//
			success: (model) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		LinkView.prototype.onRender.call(this);

		// load volume
		//
		this.loadVolume({

			// callbacks
			//
			success: (volume) => {
				this.onLoad(volume);
			}
		});
	},

	//
	// dialog rendering methods
	//

	showFileBrowser: function(volume) {

		// launch file browser
		//
		application.launch('file_browser', {
			model: volume,
			defaults: {
				show_sidebar: false
			}
		}, {
			maximized: true
		});
	},

	//
	// event handling methods
	//

	onLoad: function(volume) {
		this.volume = volume;
	},

	//
	// mouse event handling methods
	//

	onClickOpenVolume: function() {

		// show file browser
		//
		this.showFileBrowser(this.volume);
	}
});