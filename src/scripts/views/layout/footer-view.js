/******************************************************************************\
|                                                                              |
|                                 footer-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application footer and associated content.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'footer',

	template: template(`
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

					<span class="footer-item">
						<a href="#policies/privacy-policy" class="hidden-xxs">
							<i class="fa fa-file-alt"></i>Privacy
						</a>
					</span>
					<span class="footer-item">
						<a href="#policies/terms-of-use" class="hidden-xxs">
							<i class="fa fa-file-alt"></i>Terms of Use
						</a>
					</span>
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
	// setting methods
	//

	setFooterStyles: function(element, attributes) {
		if (attributes.color) {
			$(element).find('.branding .content, .branding .content a').css({
				color: attributes.color
			});
		}
		if (attributes.background) {
			$(element).find('.branding').css({
				background: attributes.background
			});		
		}
		if (attributes.font) {
			$(element).find('.branding').css({
				'font-family': config.fonts[attributes.font]['font-family']
			});	
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

		// set styles
		//
		if (config.branding.footer) {
			this.setFooterStyles(this.$el, config.branding.footer);
		}
	}
});