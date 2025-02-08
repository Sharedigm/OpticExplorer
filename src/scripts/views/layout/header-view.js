/******************************************************************************\
|                                                                              |
|                                 header-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application header and associated content.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../vendor/bootstrap/js/collapse.js';
import BaseView from '../../views/base-view.js';
import DomUtils from '../../utilities/web/dom-utils.js';
import Browser from '../../utilities/web/browser.js';

export default BaseView.extend({

	//
	// attributes
	//

	id: 'header',

	template: template(`
		<div class="navbar navbar-fixed-top navbar-inverse">
			<div class="collapse navbar-collapse">
		
				<div class="navbar-brand">
					<div class="active brand">
						<% if (branding.header.brand.logo) { %>
						<img class="logo" src="<%= branding.header.brand.logo.src %>" />
						<% } %>
		
						<% if (branding.header.brand.logotype) { %>
						<div class="logotype">
							<% if (branding.header.brand.logotype.names) { %>
							<% let keys = Object.keys(branding.header.brand.logotype.names); %>
							<% for (let i = 0; i < keys.length; i++) { %><% let key = keys[i]; %><span><%= key.replace(/ /g, '&nbsp') %></span><% } %>
							<% } %>
						</div>
						<% } %>
					</div>
				</div>

				<!-- standard navbar -->
				<% if (branding.header.nav) { %>
				<ul class="nav heading navbar-nav">
					<% let keys = Object.keys(branding.header.nav) %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<% let nav_item = branding.header.nav[key]; %>
					<% let nav_name = nav_item.href.replace('#', ''); %>
					<% let className = ''; %>
					<% if (nav == nav_name) { %>
					<% className += " active"; %>
					<% } %>
					<% if (nav_item.platform) { %>
					<% className += " " + nav_item.platform; %>
					<% } %>
					<li<% if (className != '') {%> class="<%= className %>" <% } %>><a class="<%= nav_name %>" href="<%= nav_item.href %>"<% if (nav_item.color) { %> style="color:<%= nav_item.color %>"<% } %>><i class="<%= nav_item.icon %>"></i><label><%= key %></label></a></li>
					<% } %>
				</ul>
				<% } %>

				<ul class="navbar-nav navbar-right hidden-xs">
					<div class="navbar-form">
						<div class="buttons">
							<% let buttons = branding.header.buttons; %>
							<% let keys = Object.keys(buttons); %>

							<% if (show_sign_in) { %>
							<button class="sign-in btn btn-lg btn-primary">
								<i class="<%= buttons[keys[0]].icon %>"></i><%= keys[0] %>
							</button>
							<% } %>

							<% if (show_sign_up) { %>
							<button class="sign-up btn btn-lg">
								<i class="<%= buttons[keys[1]].icon %>"></i><%= keys[1] %>
							</button>
							<% } %>
						</div>
					</div>
				</ul>
			</div>
		</div>
	`),

	events: {
		'click .brand': 'onClickBrand',
		'click .sign-in': 'onClickSignIn',
		'click .sign-up': 'onClickSignUp',
	},

	//
	// constructor
	//

	initialize: function() {

		// load required fonts
		//
		if (config.branding.header.brand && config.branding.header.brand.logotype) {
			this.loadFonts(config.branding.header.brand.logotype);
		}
	},

	loadFonts: function(logotype) {
		if (logotype.font) {
			application.loadFont(logotype.font);
		}

		// load fonts for logotype names
		//
		if (logotype.names) {
			let keys = Object.keys(logotype.names);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				if (logotype.names[key].font) {
					application.loadFont(logotype.names[key].font);
				}
			}
		}
	},

	//
	// setting methods
	//

	setNav: function(nav) {
		this.$el.find('ul.nav > li.active').removeClass('active');
		if (nav) {
			this.$el.find('ul.nav > li > a.' + nav).closest('li').addClass('active');
		}
	},

	setStyles: function(header) {
		if (!header) {
			return;
		}
		if (header.background == 'transparent') {
			this.$el.find('.navbar').css('background', header.background);
		}
		if (header.background && header.background != 'transparent') {
			this.$el.find('.navbar').addClass('colored').css('background', header.background);
		}
		if (header.font) {
			this.$el.find('.navbar').css('font-family', config.fonts[header.font]['font-family']);
		}
		if (header.background == 'transparent') {
			this.$el.find('.navbar').removeClass('navbar-inverse');
		}
		if (header.height) {
			this.$el.css('min-height', header.height);
		}
	},

	setLogoStyles: function(logo) {
		if (!logo) {
			return;
		}
		if (logo.height) {
			this.$el.find('.logo').css('height', logo.height);
		}
		if (logo.padding) {
			this.$el.find('.logo').css('padding', logo.padding);
		}
		if (logo.background) {
			this.$el.find('.brand img').css('background', logo.background);
		}
		if (logo.border == 'round') {
			this.$el.find('.brand img').addClass('round');
		}
		if (logo.border == 'rounded') {
			this.$el.find('.brand img').addClass('rounded');
		}
		if (logo.rendering == "pixelated") {
			this.$el.find('.brand img').addClass('pixelated');
		}
	},

	setLogoTypeStyles: function(logotype) {
		if (!logotype) {
			return;
		}

		// set logotype styles
		//
		DomUtils.setTextBlockStyles(this.$el.find('.logotype'), logotype);

		// set logotype name styles
		//
		if (logotype.names) {
			let elements = this.$el.find('.brand .logotype span');
			let keys = Object.keys(logotype.names);
			for (let i = 0; i < keys.length; i++) {
				DomUtils.setTextBlockStyles($(elements[i]), logotype.names[keys[i]]);
			}
		}
	},

	setBrandStyles: function(attributes) {
		if (attributes.logo) {
			this.setLogoStyles(attributes.logo);
		}
		if (attributes.logotype) {
			this.setLogoTypeStyles(attributes.logotype);
		}
	},

	setNavBarStyles: function(header) {
		if (header.color) {
			this.$el.find('.navbar .navbar-nav li a').css('color', header.color).addClass('colored');
		}
		if (header.nav) {
			this.setNavStyles(header.nav);
		}
	},

	setNavStyles: function(nav) {
		if (nav.color) {
			this.$el.find('.navbar-nav').css({
				'color': nav.color,
				'font-family': nav.font
			});
		}
	},

	setButtonStyles: function(buttons) {
		let keys = Object.keys(buttons);
		if (buttons[keys[0]]) {
			this.setSignInStyles(buttons[keys[0]]);
		}
		if (buttons[keys[1]]) {
			this.setSignUpStyles(buttons[keys[1]]);
		}
	},

	setSignInStyles: function(signin) {
		if (signin.background) {
			this.$el.find('.buttons .sign-in').css({
				'color': signin.color,
				'background': signin.background,
				'border-color': signin.background
			});
		}
		if (signin.color) {
			this.$el.find('.buttons .sign-in').css('color', signin.color);
		}
		if (signin.font) {
			this.$el.find('.buttons .sign-in').css('font-family', config.fonts[signin.font]['font-family']);
		}
	},

	setSignUpStyles: function(signup) {
		if (signup.background) {
			this.$el.find('.buttons .sign-up').css({
				'color': signup.color,
				'background': signup.background,
				'border-color': signup.background
			});
		}
		if (signup.color) {
			this.$el.find('.buttons .sign-up').css('color', signup.color);
		}
		if (signup.font) {
			this.$el.find('.buttons .sign-up').css('font-family', config.fonts[signup.font]['font-family']);
		}
	},

	setHeaderStyles: function(attributes) {
		this.setStyles(attributes);
		this.setNavBarStyles(attributes);
		this.setBrandStyles(attributes.brand);
		this.setButtonStyles(attributes.buttons);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			defaults: config.defaults,
			branding: config.branding,
			nav: this.options.nav,
			show_sign_in: application.session.has('config'),
			show_sign_up: application.session.has('config')? application.session.get('config').sign_up_enabled : false,
			is_mobile: Browser.is_mobile
		};
	},

	onRender: function() {

		// apply custom styles
		//
		if (config.branding.header) {
			this.setHeaderStyles(config.branding.header);
		}
	},

	//
	// mouse event handling methods
	//

	onClickBrand: function() {
		application.navigate('#', {
			reset: true
		});
	},

	onClickSignIn: function() {
		application.signIn();
	},

	onClickSignUp: function() {
		application.signUp();
	},

	//
	// cleanup method
	//

	onBeforeDestroy: function() {
		$('.tooltip').remove();
	}
});