/******************************************************************************\
|                                                                              |
|                                  welcome-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the initial welcome view of the application.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ImageFile from '../../models/storage/media/image-file.js';
import VideoFile from '../../models/storage/media/video-file.js';
import Directory from '../../models/storage/directories/directory.js';
import UserPreferences from '../../models/preferences/user-preferences.js';
import BaseView from '../../views/base-view.js';
import CrawlerView from '../../views/welcome/crawler-view.js';
import ScrollerView from '../../views/welcome/scroller-view.js';
import DomUtils from '../../utilities/web/dom-utils.js';
import Browser from '../../utilities/web/browser.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="masthead">
			<div class="full-size overlay"></div>

			<div class="carousel">
				<div class="carousel-cell">
					<div class="background"></div>
					<div class="full-size overlay"></div>

					<div class="splash">
						<svg class="defs">
							<defs>
								<%= filters %>
							</defs>
						</svg>
				
						<% if (branding.welcome.splash.brand.logo) { %>
						<div class="logo">
							<% if (branding.welcome.splash.brand.logo.href) { %><a href="<%= branding.welcome.splash.brand.logo.href %>"><% } %><img src="<%= branding.welcome.splash.brand.logo.src %>"<% if (branding.welcome.splash.brand.logo.tooltip) { %> data-toggle="tooltip" title="<%= branding.welcome.splash.brand.logo.tooltip %>"<% } %> /><% if (branding.welcome.splash.brand.logo.href) { %></a><% } %>
						</div>
						<% } %>
						
						<% if (branding.welcome.splash.greeting && branding.welcome.splash.greeting.text) { %>
						<div class="greeting"><%= branding.welcome.splash.greeting.text %></div>
						<% } %>
				
						<% if (branding.welcome.splash.brand.logotype) { %>
						<% if (branding.welcome.splash.brand.logotype.href) { %><a href="<%= branding.welcome.splash.brand.logotype.href %>"><% } %>
						<div class="logotype">
							<% if (branding.welcome.splash.brand.logotype.names) { %>
							<% let names = branding.welcome.splash.brand.logotype.names; %>
							<% let keys = Object.keys(names); %>
							<% for (let i = 0; i < keys.length; i++) { %><% let key = keys[i]; %><span><%= key.replace(/ /g, '&nbsp') %></span><% } %>
							<% } %>
						</div>
						<% if (branding.welcome.splash.brand.logotype.href) { %></a><% } %>
						<% } %>

						<% if (branding.welcome.splash.tagline && branding.welcome.splash.tagline.text) { %>
						<div class="tagline"><%= branding.welcome.splash.tagline.text %></div>
						<% } %>

						<% if (branding.welcome.splash.description && branding.welcome.splash.description.text) { %>
						<div class="description"><%= branding.welcome.splash.description.text %></div>
						<% } %>

						<% if (branding.links) { %>
						<div class="links">
							<% for (let i=0; i < branding.links.length; i++) { %>
							<div class="link"<% if (branding.links[i].font && defaults.fonts[branding.links[i].font]) { %>style="font-family:<%= defaults.fonts[branding.links[i].font]['font-family'] %>"<% } %>>
								<% if (branding.links[i].image) { %>
								<a href="<%= branding.links[i].url %>"><img class="pixelated" src="<%= branding.links[i].image %>" /></a>
								<% } %>
								<a href="<%= branding.links[i].url %>"><%= branding.links[i].text %></a>
							</div>
							<% } %>
						</div>
						<% } %>

						<% if (config.defaults.search && !config.defaults.search.hidden) { %>
						<div class="search row">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="<%= config.defaults.search.placeholder || 'Search' %>">
								<div class="input-group-addon btn" data-toggle="tooltip" title="Search <%= application.name %>">
									<i class="active fa fa-search"></i>
								</div>
							</div>
						</div>
						<% } %>

						<div class="buttons">
							<% if (show_video) { %>
							<button class="show-video btn btn-lg desktop-only">
								<i class="fa fa-video"></i>View Video
							</button>
							<% } %>
							<div class="visible-xs">
								<% if (show_sign_in) { %>
								<button class="sign-in btn btn-primary btn-lg">
									<i class="fa fa-chevron-right"></i>Sign In
								</button>
								<% } %>
								<% if (show_sign_up) { %>
								<button class="sign-up btn btn-lg">
									<i class="fa fa-pencil-alt"></i>Sign Up!
								</button>
								<% } %>
							</div>
						</div>
					</div>
				</div>

				<div class="carousel-cells"></div>
			</div>
		</div>

		<div class="details"></div>
	`),

	regions: {
		background: '.background',
		masthead: {
			el: '.masthead > .overlay',
			replaceElement: true
		},
		carousel: {
			el: '.carousel .overlay',
			replaceElement: true
		},
		cells: {
			el: '.carousel-cells',
			replaceElement: true
		},
		details: {
			el: '.details',
			replaceElement: true
		}
	},

	events: {
		'click .logo': 'onClickLogo',
		'click .show-video': 'onClickShowVideo',
		'click .sign-in': 'onClickSignIn',
		'click .sign-up': 'onClickSignUp',
		'click .search .btn': 'onClickSearch'
	},

	//
	// constructor
	//

	initialize: function() {

		// load required fonts
		//
		if (config.branding.welcome) {
			this.loadFonts(config.branding.welcome);
		}
		if (config.branding.links) {
			for (let i = 0; i < config.branding.links.length; i++) {
				if (config.branding.links[i].font) {
					application.loadFont(config.branding.links[i].font);
				}
			}
		}
	},

	loadFonts: function(welcome) {
		if (welcome.splash && welcome.splash.brand && welcome.splash.brand.logotype) {
			this.loadLogoTypeFonts(welcome.splash.brand.logotype);
		}
		if (welcome.splash && welcome.splash.tagline && welcome.splash.tagline.font) {
			application.loadFont(welcome.splash.tagline.font);
		}
		if (welcome.splash && welcome.splash.description && welcome.splash.description.font) {
			application.loadFont(welcome.splash.description.font);
		}
	},

	loadLogoTypeFonts: function(logotype) {
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
	// getting methods
	//

	getImageUrls: function(paths) {
		let urls = [];
		for (let i = 0; i < paths.length; i++) {
			urls.push(new ImageFile({
				path: paths[i]
			}).getUrl());
		}
		return urls;
	},

	getLogoTypeLength: function(logotype) {
		let length = 0;

		if (logotype.names) {
			let keys = Object.keys(logotype.names);
			for (let i = 0; i < keys.length; i++) {
				let name = keys[i];
				if (name && !name.startsWith('.')) {
					length += name.length;
				}
			}
		}

		return length;
	},

	//
	// logo style setting methods
	//

	setLogoStyles: function(element, attributes) {
		if (!attributes) {
			return;
		}
		if (attributes.class) {
			$(element).addClass(attributes.class);
		}
		if (attributes.size) {
			$(element).addClass(attributes.size);
		}
		if (attributes.background) {
			$(element).css('background', attributes.background);
		}
		if (attributes.transform) {
			$(element).css('transform', attributes.transform);
		}
		if (attributes.margin) {
			$(element).css('margin', attributes.margin);
		}
		if (attributes.margin_bottom) {
			$(element).css('margin-bottom', attributes.margin_bottom);
		}

		// set logo styles
		//
		DomUtils.setBorderStyles($(element), attributes);
		DomUtils.setImageStyles($(element).find('img'), attributes);
	},

	setLogoTypeStyles: function(element, attributes) {
		if ((this.getLogoTypeLength(attributes) < 8 || attributes.short) && attributes.short != false) {
			$(element).addClass('short');
		}
		if (this.getLogoTypeLength(attributes) > 15 || attributes.long) {
			$(element).addClass('long');
		}
		if (attributes.color) {
			$(element).css('color', attributes.color);
		}

		// set logotype text styles
		//
		DomUtils.setTextBlockStyles(element, attributes);

		// set logotype name text styles
		//
		if (attributes.names) {
			let elements = $(element).find('> span');
			let keys = Object.keys(attributes.names);
			for (let i = 0; i < keys.length; i++) {
				DomUtils.setTextBlockStyles($(elements[i]), attributes.names[keys[i]]);
			}
		}
	},

	//
	// splash style setting methods
	//

	setSplashStyles: function(splash) {

		// set splash styles
		//
		if (splash.width) {
			this.$el.find('.splash').css('min-width', splash.width);
		}
		if (splash.brand) {
			this.setSplashBrandStyles(splash.brand);
		}
		if (splash) {
			DomUtils.setBackgroundStyles(this.$el.find('.splash'), splash);
		}

		// set splash text styles
		//
		if (splash.greeting) {
			DomUtils.setTextBlockStyles(this.$el.find('.splash .greeting'), splash.greeting);
		}
		if (splash.tagline) {
			DomUtils.setTextBlockStyles(this.$el.find('.splash .tagline'), splash.tagline);
		}
		if (splash.description) {
			DomUtils.setTextBlockStyles(this.$el.find('.splash .description'), splash.description);
		}
	},

	setSplashBrandStyles: function(brand) {

		// set splash logo styles
		//
		if (brand.logo) {
			this.setLogoStyles(this.$el.find('.splash .logo'), brand.logo);
		}

		// set splash logotype styles
		//
		if (brand.logotype) {
			this.setLogoTypeStyles(this.$el.find('.logotype'), brand.logotype);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			defaults: config.defaults,
			branding: config.branding,
			filters: this.options.filters,
			show_video: config.branding.welcome.video != undefined,
			show_sign_in: application.session.has('config'),
			show_sign_up: application.session.has('config')? application.session.get('config').sign_up_enabled : false
		};
	},

	onRender: function() {

		// show dialogs
		//
		if (this.options.signIn) {
			application.signIn();
		} else if (this.options.signUp) {
			application.signUp();
		}

		// show child views
		//
		if (config.branding.welcome) {

			// set splash styles
			//
			if (config.branding.welcome.splash) {
				this.setSplashStyles(config.branding.welcome.splash);
			}

			// set background styles
			//
			if (config.branding.welcome) {
				DomUtils.setBackgroundStyles(this.$el.find('.masthead'), config.branding.welcome);
			}
			if (config.branding.welcome.masthead) {
				DomUtils.setBackgroundStyles(this.$el.find('.carousel-cell')[0], config.branding.welcome.masthead);
			}
			if (config.branding.welcome.overlay) {
				DomUtils.setBackgroundStyles(this.$el.find('.masthead > .overlay'), config.branding.welcome.overlay);
			}

			// show splash carousel
			//
			window.setTimeout(() => {
				this.showSplashCarousel();
			}, 500);

			// show details
			//
			if (config.branding.welcome.template) {
				this.showDetails(config.branding.welcome.template, () => {
					this.onLoad();
				});
			} else {
				this.onLoad();
			}
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	onAttach: function() {
		if (config.branding.welcome) {
			this.showWelcome(config.branding.welcome);
		}
	},

	showWelcome: function(welcome) {
		if (!welcome.template) {
			this.$el.parent().addClass('full-size');
		}
		if (welcome.crawler) {
			this.showCrawler(welcome.crawler);
		}
		if (welcome.overlay && welcome.overlay.scroller && Browser.device != 'phone') {
			this.showOverlayScroller(welcome.overlay.scroller);
		}
		if (welcome.carousel && welcome.carousel.scroller && Browser.device != 'phone') {
			this.showCarouselScroller(welcome.carousel.scroller);
		}
		if (welcome.overlay) {
			this.showOverlay(this.$el.find('.masthead > .overlay'), welcome.overlay);
		}
	},

	showCrawler: function(options) {
		if (typeof options.images == 'string') {

			// load list of images
			//
			new Directory({
				path: options.images
			}).load({

				// callbacks
				//
				success: (model) => {
					this.showChildView('background', new CrawlerView(_.extend(options, {
						images: this.getImageUrls(model.getPaths((path) => {
							return path.endsWith('png') || path.endsWith('.jpg');
						}))
					})));
				}
			});
		} else {
			this.showChildView('background', new CrawlerView(options));
		}
	},

	showOverlayScroller: function(options) {
		this.showChildView('masthead', new ScrollerView(options));
	},

	showCarouselScroller: function(options) {
		this.showChildView('carousel', new ScrollerView(options));
	},

	showOverlay: function(element, overlay) {

		// add overlay colors
		//
		if (overlay.far_color && overlay.near_color) {
			$(element).css('background', 'linear-gradient(to bottom, ' + overlay.far_color + ' 0%, ' + overlay.near_color + ' 100%)');
		} else if (overlay.background) {
			$(element).css('background', overlay.background);
		} else if (overlay.background_color) {
			$(element).css('background-color', overlay.background_color);
		} else if (overlay.background_image) {
			$(element).css('background-image', 'url("' + overlay.background_image + '")');
		}

		// set overlay opacity
		//
		if (overlay.opacity) {
			$(element).css('opacity', overlay.opacity);
		}
	},

	showDetails: function(address, done) {
		fetch(address).then((response) => response.text()).then((text) => {

			// display details
			//
			this.showChildView('details', new BaseView({
				className: 'details content',
				template: template(text)
			}));

			// show details carousels
			//
			this.$el.find('.details .carousel').flickity({
				autoPlay: 1000,
				wrapAround: true,
				pageDots: false,
				prevNextButtons: false,
				pauseAutoPlayOnHover: false
			});

			done();
		});
	},

	showCarouselCells: function(carousel, done) {
		fetch(carousel.template).then((response) => response.text()).then((text) => {

			// apply template
			//
			text = template(text)(config.defaults);

			// show carousel content
			//
			this.$el.find('.carousel-cells').replaceWith($(text));

			// apply carousel
			//
			this.$el.find('.masthead .carousel').flickity({
				wrapAround: true,
				pageDots: true,
				prevNextButtons: true,
				pauseAutoPlayOnHover: false
			});

			// set carousel cell styles
			//
			if (carousel.background || carousel.color) {
				let cells = this.$el.find('.masthead .carousel-cell');
				for (let i = 1; i < cells.length; i++) {
					let cell = $(cells[i]);

					// set carousel cell background
					//
					if (carousel.background) {
						cell.css('background', carousel.background);
					}

					// set carousel cell background color
					//
					if (carousel.background_color) {
						cell.css('background-color', carousel.background_color);
					}

					// set carousel text attributes
					//
					DomUtils.setTextBlockStyles(cell, carousel);
				}
			}

			done();
		});
	},

	showSplashCarousel: function(done) {

		// show top masthead carousel
		//
		if (config.branding.welcome.carousel && Browser.device == 'desktop') {

			// temporarily remove scrollbars
			//
			this.$el.css('overflow', 'hidden');

			this.showCarouselCells(config.branding.welcome.carousel, () => {

				// restore scrollbars
				//
				this.$el.css('overflow', '');

				if (done) {
					done();
				}
			});
		} else {
			if (done) {
				done();
			}
		}
	},

	showVideoFile: function(file, options) {
		application.launch('video_player', {
			model: file,
			preferences: UserPreferences.create('video_player', {
				show_sidebar: false
			}),
			autoplay: true
		}, options);
	},

	showVideo: function(path) {

		// load video file
		//
		new VideoFile({
			path: path
		}).fetch({

			// callbacks
			//
			success: (file) => {
				this.showVideoFile(file, {
					maximized: true,
					full_screen: false
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: 'Video not found.'
				});
			}
		});
	},

	//
	// event handling methods
	//
	
	onLoad: function() {

		// add lightbox for details
		//
		this.parent.addLightBox();

		// call page onload
		//
		this.parent.onLoad();
	},

	//
	// mouse event handling methods
	//

	onClickLogo: function() {
		if (config.branding.welcome.splash.brand.logo.sound) {
			application.play(config.branding.welcome.splash.brand.logo.sound);
		}
	},

	onClickShowVideo: function() {
		this.showVideo(config.welcome.options.view_video.path);
	},

	onClickSignIn: function() {
		application.signIn();
	},

	onClickSignUp: function() {
		application.signUp();
	},

	onClickSearch: function() {
		let search = this.$el.find('.search input').val();
		if (search && search != '') {
			application.navigate('#search?query=' + encodeURIComponent(search), {
				trigger: true
			});
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (event.keyCode == 13) {
			this.onClickSearch();
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {

		// unify heights of carousel cells
		//
		let carouselCells = this.$el.find('.carousel-cell');
		let height = $(carouselCells[0]).height();
		for (let i = 1; i < carouselCells.length; i++) {
			$(carouselCells[i]).css('height', height);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		$(window).off("resize", this.onResize);
	}
});