/******************************************************************************\
|                                                                              |
|                              about-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification dialog that is used to show a             |
|        modal about dialog box.                                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../views/dialogs/modal-view.js';
import DomUtils from '../../../utilities/web/dom-utils.js';

export default ModalView.extend({

	//
	// attributes
	//

	className: 'about modal',

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-info-circle"></i>
					</div>
					<div class="title">
						About <%= branding.name %>
					</div>
				</div>
			</div>
		
			<div class="modal-content welcome">
				<div class="modal-body">
					<div class="logo">
						<% if (branding.about && branding.about.logo) { %>
						<img src="<%= branding.about.logo.src %>" data-toggle="tooltip" title="<%= branding.about.logo.tooltip %>" />
						<% } else if (branding.welcome.splash.brand.logo) { %>
						<% if (branding.welcome.splash.brand.logo.href) { %>
						<a href="<%= branding.welcome.splash.brand.logo.href %>"><img src="<%= branding.welcome.splash.brand.logo.src %>" data-toggle="tooltip" title="<%= branding.welcome.splash.brand.logo.tooltip %>" /></a>
						<% } else { %>
						<img src="<%= branding.welcome.splash.brand.logo.src %>" data-toggle="tooltip" title="<%= branding.welcome.splash.brand.logo.tooltip %>" />
						<% } %>
						<% } %>
					</div>

					<div class="message">
						<% if (branding.welcome.splash.brand.logotype) { %>
						<h1 class="brand">
							<% if (branding.welcome.splash.brand.logotype.names) { %>
							<% let names = branding.welcome.splash.brand.logotype.names; %>
							<% let keys = Object.keys(names); %>
							<% for (let i = 0; i < keys.length; i++) { %><% let key = keys[i]; %><span><%= key.replace(' ', '&nbsp') %></span><% } %>
							<% } %>
						</h1>
						<% } %>
		
						<% if (branding.welcome.splash.tagline && branding.welcome.splash.tagline.text) { %>
						<div class="tagline"><%= branding.welcome.splash.tagline.text %></div>
						<% } %>
		
						<% if (branding.welcome.splash.description && branding.welcome.splash.description.text) { %>
						<div class="description"><%= branding.welcome.splash.description.text %></div>
						<% } %>
						
						<% if (branding.footer.copyright) { %>
						<div class="copyright">
							<span class="year">Copyright &copy; <%= branding.footer.copyright.year %></span>
							<span class="entity"><%= branding.footer.copyright.entity %></span>
						</div>
						<% } %>
					</div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, ModalView.prototype.events, {
		'click': 'onClick',
		'click .ok': 'onClickOk'
	}),

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.tiny,

	//
	// dialog methods
	//

	accept: function() {

		// perform callback
		//
		if (this.options.accept) {
			return this.options.accept();
		}
	},

	//
	// setting methods
	//

	setDialogStyles: function(styles) {
		if (styles.tagline) {
			DomUtils.setTextBlockStyles(this.$el.find('.tagline'), styles.tagline);
		}
		if (styles.description) {
			DomUtils.setTextStyles(this.$el.find('.description'), styles.description);
		}
	},

	setDialogLogoStyles: function(styles) {
		if (styles.logo) {
			this.setLogoStyles(styles.logo);
		}
		if (styles.logotype) {
			this.setLogoTypeStyles(styles.logotype);
		}
	},

	setLogoStyles: function(logo) {
		if (logo.border == 'round') {
			this.$el.find('.logo').addClass('round');
		}
		if (logo.border == 'rounded') {
			this.$el.find('.logo').addClass('rounded');
		}
		if (logo.background) {
			this.$el.find('.logo').css({
				background: logo.background
			});
		}
		if (logo.rendering == "pixelated") {
			this.$el.find('.logo img').addClass('pixelated');
		}
	},

	setLogoTypeStyles: function(logotype) {

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

	setDescriptionStyles: function(description) {
		if (description.font) {
			this.$el.find('.tagline').css({
				'font-family': config.fonts[description.font]['font-family']
			});
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			defaults: config.defaults,
			branding: config.branding
		};
	},

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// set styles
		//
		this.setDialogStyles(config.branding.welcome.splash);
		this.setDialogLogoStyles(config.branding.welcome.splash.brand);
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.accept();
	}
});