/******************************************************************************\
|                                                                              |
|                              help-cover-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing help pages.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import HelpPageView from '../../../../views/apps/help-viewer/mainbar/help-page-view.js';
import DomUtils from '../../../../utilities/web/dom-utils.js';

export default HelpPageView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="contents container">
			<div class="center aligned cover content">

				<div class="logo">
					<img src="<%= logo %>" />
				</div>

				<% if (logotype) { %>
				<h1 class="brand">
					<% if (logotype.names) { %>
					<% let names = logotype.names; %>
					<% let keys = Object.keys(names); %>
					<% for (let i = 0; i < keys.length; i++) { %><% let key = keys[i]; %><span><%= key.replace(/ /g, '&nbsp') %></span><% } %>
					<% } %>
				</h1>
				<% } %>

				<h2 class="name"><%= name %></h2>

				<div>
					<p>Version <%= version %></p>
				</div>
			</div>
		</div>
	`),

	className: 'page',

	regions: {
		container: '.container'
	},

	events: {
		'click .title-icon': 'onClickTitleIcon'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			logo: config.help.logo.src,
			logotype: config.branding.welcome.splash.brand.logotype,
			name: config.help.name,
			version: config.help.version
		};
	},

	onRender: function() {

		// set logo styles
		//
		DomUtils.setBackgroundStyles(this.$el.find('.logo'), config.help.logo);
		DomUtils.setBorderStyles(this.$el.find('.logo'), config.help.logo);

		// set logo image styles
		//
		if (config.help.logo.rendering == 'pixelated') {
			this.$el.find('img').addClass('pixelated');
		}

		// set logotype styles
		//
		if (config.branding.welcome.splash.brand) {
			if (config.branding.welcome.splash.brand.logotype &&
				config.branding.welcome.splash.brand.logotype.font) {
				application.loadFont(config.branding.welcome.splash.brand.logotype.font);
			}
			this.setLogoTypeStyles(config.branding.welcome.splash.brand.logotype);
		}
	},

	setLogoTypeStyles: function(logotype) {
		if (!logotype) {
			return;
		}

		// set font styles
		//
		DomUtils.setTitleStyles(this.$el.find('.brand'), logotype);

		// set logotype name styles
		//
		if (logotype.names) {
			let elements = this.$el.find('.brand > span');
			let keys = Object.keys(logotype.names);
			for (let i = 0; i < keys.length; i++) {
				DomUtils.setTitleStyles($(elements[i]), logotype.names[keys[i]]);
			}
		}
	},

	//
	// mouse event handling methods
	//

	onClickTitleIcon: function() {
		this.parent.parent.setAddress('#help');
	}
});