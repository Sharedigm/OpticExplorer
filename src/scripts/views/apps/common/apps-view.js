/******************************************************************************\
|                                                                              |
|                                 apps-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an icon bar that allows selection of an app.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'apps',

	template: template(`
		<% for (let i = 0; i < apps.length; i++) { %>
		<button name="<%= apps[i] %>" class="btn btn-sm<% if (typeof colors != 'undefined') { %> colored <%= colors[i] %><% } %>" data-toggle="tooltip" title="<%= names[i] %>" data-container="body"><i class="<%= icons[i] %>"></i></button>
		<% } %>
	`),

	events: {
		'click button': 'onClickButton'
	},

	//
	// getting methods
	//

	getAppIcons: function(apps) {
		let icons = [];
		for (let i = 0; i < apps.length; i++) {
			let app = config.apps[apps[i]];
			if (app) {
				icons.push(app.icon);
			}
		}
		return icons;
	},

	getAppImages: function(apps) {
		let images = [];
		for (let i = 0; i < apps.length; i++) {
			let app = config.apps[apps[i]];
			if (app) {
				images.push(app.image);
			}
		}
		return images;
	},

	getAppNames: function(apps) {
		let names = [];
		let keys = Object.keys(apps);
		for (let i = 0; i < apps.length; i++) {
			let app = config.apps[apps[i]];
			if (app) {
				names.push(keys[i] || app.alias);
			}
		}
		return names;
	},

	getAppAliases: function(apps) {
		let aliases = [];
		for (let i = 0; i < apps.length; i++) {
			let app = config.apps[apps[i]];
			if (app) {
				aliases.push(app.alias || app.name);
			}
		}
		return aliases;
	},

	getAppColors: function(apps) {
		let colors = [];
		for (let i = 0; i < apps.length; i++) {
			let app = config.apps[apps[i]];
			if (app) {
				colors.push(app.color);
			}
		}
		return colors;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			apps: this.options.apps,
			icons: this.getAppIcons(this.options.apps),
			images: this.getAppImages(this.options.apps),
			names: this.getAppAliases(this.options.apps),
			colors: this.getAppColors(this.options.apps),
		};
	},

	onRender: function() {

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// mouse event handling methods
	//

	onClickButton: function(event) {
		let name = $(event.target).attr('name');

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(name);
		}
	}
});