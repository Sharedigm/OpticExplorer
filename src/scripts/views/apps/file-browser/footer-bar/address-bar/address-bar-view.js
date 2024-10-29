/******************************************************************************\
|                                                                              |
|                             address-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of directory tree structure address bar.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import Url from '../../../../../utilities/web/url.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'address-bar',

	template: template(`
		<ol class="inline breadcrumb">
			<% let url = ''; %>
			<% for (let i = 0; i < address.length; i++) { %>
		
				<% if (i > 0) { %>
				<% url += (i > 1? '/' : '') + address[i]; %>
				<% } %>
		
				<% if (address[i]) { %>
					<% if (address[i] == '~') { %>
					<li value="0"><i class="fa fa-home" data-toggle="tooltip" title="Location" data-placement="top"></i></li>
					<% } else if (i < address.length - 1) { %>
					<li value="<%= i %>"><i class="fa fa-folder"></i><span><%= address[i] %></span></li>
					<% } else { %>
					<% if (address[i].includes('.')) { %>
					<li value="<%= i %>"><i class="fa fa-database"></i><span><%= address[i] %></span></li>
					<% } else { %>
					<li><i class="fa fa-folder"></i><span><%= address[i] %></span></li>
					<% } %>
					<% } %>
				<% } %>
			<% } %>
		</ol>
	`),

	events: {
		'click li': 'onClickLink'
	},

	//
	// querying methods
	//

	hasDirectory: function() {
		return this.app && this.app.hasActiveModel? this.app.hasActiveModel() : false;
	},

	getAddress: function(directory) {
		let path;

		if (!directory) {
			return [];
		}

		if (directory.has('path')) {
			path = directory.get('path');
			if (!path.startsWith('/') && !path.startsWith('~')) {
				path = '~/' + directory.get('path');
			}
		} else if (directory.has('link')) {
			path = directory.get('link').getDirname();
		} else {
			path = '~';
		}

		// remove trailing slash
		//
		if (path.endsWith('/')) {
			path = path.substr(0, path.length - 1);
		}

		return path.split('/');
	},

	getDirectory: function() {
		return this.hasDirectory()? this.app.getActiveModel() : this.model;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			address: this.getAddress(this.getDirectory()),
			Url: Url
		};
	},

	onRender: function() {
		this.app = this.parent.parent;

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// event handling methods
	//

	onLoad: function() {
		if (this.hasDirectory()) {
			this.update();
		}
	},

	onChange: function() {
		if (this.hasDirectory()) {
			this.update();
		}
	},
	
	onClickLink: function(event) {
		let index = parseInt($(event.target).closest('li').attr('value'));
		let address = this.getAddress(this.getDirectory());
		let path = '';

		// assemble path
		//
		for (let i = 1; i <= index; i++) {
			path += address[i] + '/';
		}

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(path);
		}

		// block event from parent
		//
		this.block(event);
	}
});