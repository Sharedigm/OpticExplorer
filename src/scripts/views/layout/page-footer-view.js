/******************************************************************************\
|                                                                              |
|                             page-footer-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a page footer and associated content.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FooterView from '../../views/layout/footer-view.js';
import DomUtils from '../../utilities/web/dom-utils.js';

export default FooterView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="info">
			<div class="full-size overlay"></div>

			<div class="content">

				<% if (branding.page && branding.page.footer && branding.page.footer.brand) { %>
				<div class="brand">
					<% if (branding.page.footer.brand.logo) { %>
					<a href="<%= branding.page.footer.brand.logo.href || '#' %>">
						<div class="logo">
							<img class="icon" src="<%= branding.page.footer.brand.logo.src %>" />
						</div>
					</a>
					<% } %>

					<% if (branding.page.footer.brand.logotype) { %>
					<div class="logotype">
						<% if (branding.page.footer.brand.logotype.names) { %>
						<% let names = branding.page.footer.brand.logotype.names; %>
						<% let keys = Object.keys(names); %>
						<% for (let i = 0; i < keys.length; i++) { %><% let key = keys[i]; %><span><%= key.replace(/ /g, '&nbsp') %></span><% } %>
						<% } %>
					</div>
					<% } %>

					<% if (branding.page.footer.tagline && branding.page.footer.tagline.text) { %>
					<div class="tagline"><%= branding.page.footer.tagline.text %></div>
					<% } %>
				</div>
				<% } %>

				<% if (branding.page && branding.page.footer && branding.page.footer.info) { %>
				<div class="links">
					<div class="row">
						<% let keys = Object.keys(branding.page.footer.info); %>
						<% for (let i = 0; i < keys.length; i++) { %>
						<% let key = keys[i]; %>
						<% let info = branding.page.footer.info[key]; %>
						<div class="column">
							<div class="heading">
								<i class="<%= info.icon %>"></i>
								<%= key %>
							</div>
							<% let keys2 = Object.keys(info.links); %>
							<% for (let j = 0; j < keys2.length; j++) { %>
								<% let key2 = keys2[j]; %>
								<% let link = info.links[key2]; %>
								<a href="<%= link.href %>"<% if (link.color || config.branding.page.footer.color) { %> style="color:<%= link.color || config.branding.page.footer.color %>"<% } %>>
									<i class="<%= link.icon %>"></i>
									<%= key2 %>
								</a>
							<% } %>
						</div>
						<% } %>
					</div>
				</div>
				<% } %>
			</div>
		</div>

		<div class="branding">
			<div class="content">
				<% if (branding.footer.copyright) { %>
				<div class="fineprint copyright">
					<% if (branding.footer.copyright.url) { %><a href="<%= branding.footer.copyright.url %>"><% } %>
					<span class="year">Copyright &copy; <%= branding.footer.copyright.year %></span>

					<% if (branding.footer.copyright.logo) { %>
					<img class="desktop-only pixelated logo" src="<%= branding.footer.copyright.logo %>" />
					<% } %>

					<span class="entity"><%= branding.footer.copyright.entity %></span>
					<% if (branding.footer.copyright.url) { %></a><% } %>
				</div>
				<% } %>

				<div class="fineprint trademark">
					<% if (branding.footer.copyright.entity != 'Sharedigm') { %>powered by
					<a class="brand" href="http://www.sharedigm.com" target="blank"><img class="logo" src="images/logos/sharedigm.svg" />Sharedigm</a><% } else { %>
					<a class="company" href="http://www.megahedlabs.com" target="_blank">
						<img class="logo" src="images/logos/beanie@2x.png" height="20px" style="margin-right:5px; margin-top:-5px" />Megahed Labs</a>
					<% } %>
				</div>
			</div>
		</div>
	`),

	//
	// logo style setting methods
	//

	setLogoStyles: function(element, attributes) {
		if (attributes.background) {
			$(element).css('background', attributes.background);
		}

		DomUtils.setBorderStyles(element, attributes);
		DomUtils.setImageStyles(element, attributes);

		// allow image clipping
		//
		if (attributes.width && attributes.height) {
			$(element).find('img').css('width', attributes.width);
			$(element).find('img').css('height', 'auto');
		}
	},

	setLogoTypeStyles: function(element, attributes) {
		if (attributes.color) {
			$(element).css('color', attributes.color);
		}

		// set font styles
		//
		DomUtils.setTextBlockStyles(element, attributes);

		// set logotype name styles
		//
		if (attributes.names) {
			let elements = $(element).find('span');
			let keys = Object.keys(attributes.names);
			for (let i = 0; i < keys.length; i++) {
				DomUtils.setTextBlockStyles($(elements[i]), attributes.names[keys[i]]);
			}
		}
	},

	//
	// footer style setting methods
	//

	setBrandStyles: function(element, attributes) {

		// set logo styles
		//
		if (attributes.logo) {
			this.setLogoStyles($(element).find('.logo'), attributes.logo);
		}

		// set logotype styles
		//
		if (attributes.logotype) {
			this.setLogoTypeStyles($(element).find('.logotype'), attributes.logotype);
		}
	},

	setHeadingStyles: function(elements, attributes) {
		let keys = Object.keys(attributes);
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			let key = keys[i];
			DomUtils.setTextBlockStyles(element, attributes[key]);
		}
	},

	setPageFooterStyles: function(element, attributes) {
		if (attributes) {
			DomUtils.setBackgroundStyles(element, attributes);
		}

		// set heading link styles
		//
		DomUtils.setTextBlockStyles($(element), attributes);
		this.setHeadingStyles($(element).find('.heading'), attributes.info);

		// set brand styles
		//
		if (attributes.brand) {
			this.setBrandStyles($(element).find('.brand'), attributes.brand);
		}

		// set tagline styles
		//
		if (attributes.tagline) {
			DomUtils.setTextBlockStyles($(element).find('.tagline'), attributes.tagline);
			DomUtils.setBackgroundStyles($(element).find('.tagline'), attributes.tagline);
			DomUtils.setBorderStyles($(element).find('.tagline'), attributes.tagline);
		}

		// set description styles
		//
		if (attributes.description) {
			DomUtils.setTextBlockStyles($(element).find('.description'), attributes.description);
			DomUtils.setBackgroundStyles($(element).find('.description'), attributes.description);
			DomUtils.setBorderStyles($(element).find('.tagline'), attributes.description);
		}

		// set overlay styles
		//
		if (attributes.overlay) {
			DomUtils.setBackgroundStyles($(element).find('.overlay'), attributes.overlay);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			branding: config.branding
		};
	},

	onRender: function() {
		if (config.branding.page.footer) {
			this.setPageFooterStyles(this.$el.find('.info'), config.branding.page.footer);
		}
		if (config.branding.footer) {
			this.setFooterStyles(this.$el, config.branding.footer);
		}
	}
});