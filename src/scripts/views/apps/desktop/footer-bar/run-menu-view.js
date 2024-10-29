/******************************************************************************\
|                                                                              |
|                                 run-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for navigating and manipulating files.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import Timeable from '../../../../views/behaviors/effects/timeable.js';
import AppsView from '../../../../views/apps/common/items/apps-view.js';
import '../../../../../vendor/bootstrap/js/dropdown.js';

export default BaseView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	className: 'unflickable menu-bar',

	template: template(`
		<ul class="nav nav-menus" role="tablist">
			<li class="dropup">
				<a class="dropdown-toggle" data-toggle="dropdown">
					<% if (typeof(branding) != 'undefined' && branding.header.logo) { %>
					<img class="logo<% if (branding.brand.logo.border == 'round') { %> round<% } %><% if (branding.brand.logo.border == 'rounded') { %> rounded<% } %><% if (branding.brand.logo.rendering == "pixelated") { %> pixelated<% } %>" src="<%= branding.header.logo %>" />
					<% } else { %>
					<i class="fa fa-play"></i>
					<% } %>
					<span class="dropdown-title">Run</span>
				</a>
				<div class="icons"></div>
				<div class="cards"></div>
				<div class="list"></div>
			</li>
		</ul>
	`),

	regions: {
		icons: {
			el: '.icons',
			replaceElement: true
		},
		cards: {
			el: '.cards',
			replaceElement: true
		},
		list: {
			el: '.list',
			replaceElement: true
		}
	},

	// app opening delay
	//
	delay: 300,

	//
	// querying methods
	//

	isAutohide: function() {
		return this.getDesktopView().settings.get('run_menu_autohide');
	},

	isOpen: function() {
		let $dropup = this.$el.find('.dropup');
		return $dropup.hasClass('open');
	},

	isOpening: function() {
		return this.opening == true;
	},

	//
	// getting methods
	//

	getDesktopWidth: function() {
		return this.getDesktopView().$el.width();
	},

	getDesktopHeight: function() {
		let desktopView = this.getParentView('desktop');
		let contentsView = desktopView.getChildView('body contents');
		let height;

		if (contentsView) {
			height = contentsView.$el.height();
		} else {
			height = desktopView.$el.height();
		}

		return height;
	},

	getDesktopView: function() {
		return this.getParentView('desktop').parent.parent;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			// branding: config.branding
		};
	},

	showAppIcons: function() {
		this.showChildView('icons', new AppsView({
			collection: this.collection,
			view_kind: 'icons',

			// options
			//
			show_dividers: false,

			// callbacks
			//
			onclick: (item) => this.onClick(item)
		}));

		// add menu styling
		//
		this.$el.find('.icon-grid').addClass('menu-content');
	},

	showAppCards: function() {
		this.showChildView('cards', new AppsView({
			collection: this.collection,
			view_kind: 'cards',

			// options
			//
			show_dividers: true,

			// callbacks
			//
			onclick: (item) => this.onClick(item)
		}));

		// add menu styling
		//
		this.$el.find('.card-grid').addClass('menu-content');
	},

	showAppsList: function() {
		this.showChildView('list', new AppsView({
			collection: this.collection,
			view_kind: 'menus',

			// options
			//
			show_dividers: true,

			// callbacks
			//
			onclick: (item) => this.onClick(item)
		}));
	},

	open: function() {
		let $dropup = this.$el.find('.dropup');
		if (!this.isOpen()) {
			let $items = this.$el.find('.items');

			// show menu
			//
			$dropup.addClass('open');

			// set run menu height
			//
			$items.css('left', -this.$el.offset().left + 'px');
			$items.css('width', this.getDesktopWidth() + 'px');
			$items.css('height', this.getDesktopHeight() + 'px');

			// animate
			//
			this.opening = true;
			let effect = application.settings.desktop.get('launcher_open_effect');

			switch (effect) {
				case 'slide':
					$items.addClass('sliding-from-bottom');
					break;
				case 'zoom':
					$items.addClass('growing-in');
					break;
				case 'fade':
					$items.addClass('fading-in');
					break;
			}

			// unanimate
			//
			this.setTimeout(() => {
				switch (effect) {
					case 'slide':
						$items.removeClass('sliding-from-bottom');
						break;
					case 'zoom':
						$items.removeClass('growing-in');
						break;
					case 'fade':
						$items.removeClass('fading-in');
						break;
				}

				this.opening = false;
			}, this.delay);
		}
	},

	close: function() {
		let $dropup = this.$el.find('.dropup');
		if ($dropup.hasClass('open')) {
			let $items = this.$el.find('.items');
			this.opening = false;

			// animate
			//
			let effect = application.settings.desktop.get('launcher_close_effect');

			switch (effect) {
				case 'slide':
					$items.addClass('sliding-to-bottom');
					break;
				case 'zoom':
					$items.addClass('shrinking-out');
					break;
				case 'fade':
					$items.addClass('fading-out');
					break;
			}

			this.setTimeout(() => {

				// animate
				//
				switch (effect) {
					case 'slide':
						$items.removeClass('sliding-to-bottom');
						break;
					case 'zoom':
						$items.removeClass('shrinking-out');
						break;
					case 'fade':
						$items.removeClass('fading-out');
						break;
				}

				// hide menu
				//
				$dropup.removeClass('open');
			}, this.delay);
		}
	},

	onRender: function() {

		// show child views
		//
		this.showAppIcons();
		this.showAppCards();
		this.showAppsList();

		this.$el.find('.apps-list').addClass('dropdown-menu');

		// unhide menus on hover
		//
		this.$el.find('.dropdown-toggle').hover((event) => {
			$(event.target).trigger('open');
		});

		// hide menus on leave
		//
		this.getChildView('icons').$el.mouseleave(() => {
			if (this.isOpen() && this.isAutohide()) {
				this.close();
			}
		});
		this.getChildView('list').$el.find('.dropdown-menu').mouseleave((event) => {
			if (this.isOpen() && event.target.className == 'dropdown-menu' && this.isAutohide()) {
				this.close();
			}
		});
		this.getChildView('cards').$el.mouseleave(() => {
			if (this.isOpen() && this.isAutohide()) {
				this.close();
			}
		});

		// set open / close triggers
		//
		this.$el.find('.dropdown-toggle').on('open', (event) => {
			this.open();
			this.block(event);
		});
		this.$el.find('.dropdown-toggle').on('tap', (event) => {
			this.open();
			this.block(event);
		});
		this.$el.on('hide.bs.dropdown', (event) => {
			if (!this.isOpen() && !this.isOpening()) {
				this.close();
				this.block(event);
			}
		});
	},

	//
	// mouse event handling methods
	//

	onClick: function(item) {

		// play launch sound
		//
		application.play('launch');

		// hide launcher after delay
		//
		window.setTimeout(() => {
			this.close();

			// perform callback
			//
			if (this.options.onclick) {
				this.options.onclick(item);
			}
		}, this.delay);
	}
}));