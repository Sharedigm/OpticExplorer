/******************************************************************************\
|                                                                              |
|                                 page-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the main single column page container view.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ThemeSettings from '../../models/settings/theme-settings.js';
import BaseView from '../../views/base-view.js';
import Wallpaperable from '../../views/behaviors/effects/wallpaperable.js';
import PageFooterView from '../../views/layout/page-footer-view.js';
import Browser from '../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, Wallpaperable, {

	//
	// attributes
	//

	className: 'page',

	template: template(`
		<div class="contents container"></div>
		<div class="footer"></div>
	`),

	regions: {
		contents: {
			el: '.contents',
			replaceElement: true 
		},
		footer: {
			el: '.footer',
			replaceElement: true
		}
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.showFooter == undefined) {
			this.options.showFooter = true;
		}

		// set contents view parent
		//
		if (this.options.contentsView) {
			this.options.contentsView.parent = this;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show contents view
		//
		this.showContents();

		// show footer view
		//
		if (this.options.showFooter) {
			this.showFooter();
		}
	},

	onAttach: function() {
		if (this.options && this.options.alignment == 'middle') {
			this.$el.find('> .contents').addClass('middle aligned');
		}

		// listen for resize events
		//
		$(window).resize((event) => {
			this.onResize(event);
		});

		// init carousels
		//
		this.showSectionCarousels();

		// loaded
		//
		this.onLoad();
	},

	showSectionCarousels: function() {
		this.$el.find('.section .carousel').flickity({
			autoPlay: 1000,
			wrapAround: true,
			pageDots: false,
			prevNextButtons: false,
			pauseAutoPlayOnHover: false
		});
	},

	showContents: function() {
		this.showChildView('contents', this.options.contentsView);
		if (this.options.nav != 'welcome page') {
			this.getChildView('contents').$el.addClass('contents');
		}
	},

	showFooter: function() {
		this.showChildView('footer', new PageFooterView());
	},

	setPageStyles: function(page) {

		// if user not logged in then set page styles
		//
		if (!application.session.user) {
			if (page.background) {
				this.$el.css('background', page.background);
			}
			if (page.theme) {
				this.$el.addClass(page.theme);
				ThemeSettings.loadTheme(page.theme);	
			}
		}

		if (page.font) {
			this.setFontStyles(page.font);
		}
	},

	setFontStyles: function(font) {
		application.loadFont(font);
		if (config.fonts[font]) {
			this.$el.find('p').css('font-family', config.fonts[font]['font-family']);	
		} else {
			this.$el.find('p').css('font-family', font);	
		}
	},

	setHeadingStyles: function(page) {
		if (page.heading1) {
			this.setHeading1Styles(page.heading1);
		}
		if (page.heading2) {
			this.setHeading2Styles(page.heading2);
		}
		if (page.heading3) {
			this.setHeading3Styles(page.heading3);
		}
	},

	setHeading1Styles: function(heading1) {
		if (heading1.font && config.fonts[heading1.font]) {
			application.loadFont(heading1.font);
			this.$el.find('h1').css('font-family', config.fonts[heading1.font]['font-family']);
		}
		if (heading1.font_weight) {
			this.$el.find('h1').css('font-weight', heading1.font_weight);
		}
		if (heading1.size && !Browser.is_mobile) {
			this.$el.find('h1').css('font-size', heading1.size);
		}
		if (heading1.color) {
			this.$el.find('h1').css('color', heading1.color);
		}
		if (heading1.icon && heading1.icon.color) {
			this.$el.find('h1 i').css('color', heading1.icon.color);
		}
	},

	setHeading2Styles: function(heading2) {
		if (heading2.font && config.fonts[heading2.font]) {
			application.loadFont(heading2.font);
			this.$el.find('h2').css('font-family', config.fonts[heading2.font]['font-family']);
		}
		if (heading2.font_weight) {
			this.$el.find('h2').css('font-weight', heading2.font_weight);
		}
		if (heading2.size && !Browser.is_mobile) {
			this.$el.find('h2').css('font-size', heading2.size);
		}
		if (heading2.color) {
			this.$el.find('h2').css('color', heading2.color);
		}
		if (heading2.icon && heading2.icon.color) {
			this.$el.find('h2 i').css('color', heading2.icon.color);
		}
	},

	setHeading3Styles: function(heading3) {
		if (heading3.font && config.fonts[heading3.font]) {
			application.loadFont(heading3.font);
			this.$el.find('h3').css('font-family', config.fonts[heading3.font]['font-family']);
		}
		if (heading3.font_weight) {
			this.$el.find('h3').css('font-weight', heading3.font_weight);
		}
		if (heading3.size && !Browser.is_mobile) {
			this.$el.find('h3').css('font-size', heading3.size);
		}
		if (heading3.color) {
			this.$el.find('h3').css('color', heading3.color);
		}
		if (heading3.icon && heading3.icon.color) {
			this.$el.find('h3 i').css('color', heading3.icon.color);
		}
	},

	//
	// lightbox methods
	//

	addLightBox: function() {
		import(
			'../../../vendor/jquery/fancybox/jquery.fancybox.js'
		).then(() => {
			this.$el.find('.lightbox').fancybox({

				// options
				//
				padding: 0,
				margin: 20,
				openEffect: 'elastic',
				closeEffect: 'elastic',
				type : "image",

				// callbacks
				//
				afterShow: function() {

					// make image draggable
					//
					this.wrap.draggable();
					this.wrap.closest('.fancybox-overlay').css({
						'overflow-x': 'hidden',
						'overflow-y': 'hidden'
					});
				}
			});
		});
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// set styles
		//
		if (config.branding.page) {
			this.setPageStyles(config.branding.page);
			this.setHeadingStyles(config.branding.page);
		}

		// add lightbox triggers
		//
		this.addLightBox();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// delegate key events to contents subview
		//
		let view = this.getChildView('contents');
		if (view && view.onKeyDown) {
			return view.onKeyDown(event);
		}
	},

	onKeyPress: function(event) {

		// delegate key events to contents subview
		//
		let view = this.getChildView('contents');
		if (view && view.onKeyPress) {
			return view.onKeyPress(event);
		}
	},

	onKeyUp: function(event) {

		// delegate key events to content subview
		//
		let view = this.getChildView('contents');
		if (view && view.onKeyUp) {
			return view.onKeyUp(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		if (this.hasChildView('contents') && this.getChildView('contents').onResize) {
			this.getChildView('contents').onResize(event);
		}
	}
}));