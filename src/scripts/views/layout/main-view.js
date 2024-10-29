/******************************************************************************\
|                                                                              |
|                                 main-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the main single column outer container view.             |
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
import HeaderView from '../../views/layout/header-view.js';
import ModalsView from '../../views/dialogs/modals-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'body',

	template: template(`
		<svg>
			<defs>
				<%= filters %>
				<%= markers %>
				<%= gradients %>
			</defs>
		</svg>
		
		<div id="header"></div>
		<div id="main">
			<div class="loading">
				<i class="spinner"></i>
			</div>
		</div>
		<div id="modals"></div>
	`),

	filters: `
		<!-- shadow filters -->

		<filter id="shadowed" filterUnits="userSpaceOnUse" x="-25%" y="-25%" width="150%" height="150%">

			<!-- umbra -->
			<feGaussianBlur in="SourceAlpha" result="umbra" stdDeviation="1" />
			<feColorMatrix type="matrix" in="umbra" result="umbra" values=
				"1  0  0  0  0
				 0  1  0  0  0
				 0  0  1  0  0
				 0  0  0 .25  0" />
			<feOffset in="umbra" result="umbra" dx="1" dy="1"></feOffset>

			<!-- penumbra -->
			<feGaussianBlur in="SourceAlpha" result="penumbra" stdDeviation="4" />
			<feColorMatrix type="matrix" in="penumbra" result="penumbra" values=
				"1  0  0  0  0
				 0  1  0  0  0
				 0  0  1  0  0
				 0  0  0 .25  0" />
			<feOffset in="penumbra" result="penumbra" dx="2" dy="2"></feOffset>

			<feMerge>
				<feMergeNode in="umbra" /> 
				<feMergeNode in="penumbra" />
				<feMergeNode in="SourceGraphic" /> 
			</feMerge>
		</filter>

		<!-- glow effect filters -->

		<filter id="glowing" x="-400%" y="-400%" width="800%" height="800%" primitiveUnits="objectBoundingBox">
			<feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"/>
			<feColorMatrix type="matrix" in="blur" result="blur" values=
				"1.5  0  0  0  0
				 0  1.5  0  0  0
				 0  0  1.5  0  0
				 0  0  0  1.5  0"/>
			<feMerge> 
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/> 
			</feMerge>
		</filter>
	`,

	gradients: `
		<!-- monochrome file gradients -->

		<linearGradient id="mono-file-body-gradient" x1="0" y1="0" x2="0" y2="1" >
			<stop stop-color="white" offset="0" />
			<stop stop-color="lightgrey" offset="1" />
		</linearGradient>

		<linearGradient id="mono-file-corner-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="white" offset="0" />
			<stop stop-color="lightgrey" offset="1" />
		</linearGradient>

		<!-- monochrome folder gradients -->

		<linearGradient id="mono-folder-top-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="#ccccdd" offset="0" />
			<stop stop-color="#8f8fb4" offset="1" />
		</linearGradient>

		<linearGradient id="mono-folder-body-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="#ebebf1" offset="0" />
			<stop stop-color="#ccccdd" offset="1" />
		</linearGradient>

		<linearGradient id="mono-clipboard-handle-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="darkgrey" offset="0" />
			<stop stop-color="white" offset="0.5" />
			<stop stop-color="darkgrey" offset="1" />
		</linearGradient>

		<linearGradient id="mono-clipboard-body-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="lightgrey" offset="0" />
			<stop stop-color="darkgrey" offset="1" />
		</linearGradient>

		<linearGradient id="mono-clipboard-paper-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="whitesmoke" offset="0" />
			<stop stop-color="#ece8d8" offset="1" />
		</linearGradient>

		<linearGradient id="mono-trash-body-gradient">
			<stop stop-color="darkgrey" offset="0" />
			<stop stop-color="white" offset="0.33" />
			<stop stop-color="darkgrey" offset="1" />
		</linearGradient>

		<linearGradient id="mono-file-body-gradient" x1="0" y1="0" x2="0" y2="1" >
			<stop stop-color="whitesmoke" offset="0" />
			<stop stop-color="lightgrey" offset="1" />
		</linearGradient>

		<linearGradient id="mono-file-corner-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="whitesmoke" offset="0" />
			<stop stop-color="lightgrey" offset="1" />
		</linearGradient>

		<!-- monochrome volume gradients -->

		<linearGradient id="mono-volume-body-gradient">
			<stop stop-color="darkgrey" offset="0" />
			<stop stop-color="white" offset="0.33" />
			<stop stop-color="darkgrey" offset="1" />
		</linearGradient>

		<!-- colored file gradients -->

		<linearGradient id="file-body-gradient" x1="0" y1="0" x2="0" y2="1" >
			<stop stop-color="ivory" offset="0" />
			<stop stop-color="lightgrey" offset="1" />
		</linearGradient>

		<linearGradient id="file-corner-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="ivory" offset="0" />
			<stop stop-color="lightgrey" offset="1" />
		</linearGradient>

		<!-- colored folder gradients -->

		<linearGradient id="folder-top-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="navajowhite" offset="0" />
			<stop stop-color="tan" offset="1" />
		</linearGradient>

		<linearGradient id="folder-body-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="blanchedalmond" offset="0" />
			<stop stop-color="navajowhite" offset="1" />
		</linearGradient>

		<linearGradient id="clipboard-handle-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="darkgrey" offset="0" />
			<stop stop-color="white" offset="0.5" />
			<stop stop-color="darkgrey" offset="1" />
		</linearGradient>

		<linearGradient id="clipboard-body-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="burlywood" offset="0" />
			<stop stop-color="#9e7860" offset="1" />
		</linearGradient>

		<linearGradient id="clipboard-paper-gradient" x1="0" y1="0" x2="0" y2="1">
			<stop stop-color="ivory" offset="0" />
			<stop stop-color="#ece8d8" offset="1" />
		</linearGradient>

		<linearGradient id="trash-body-gradient">
			<stop stop-color="darkgrey" offset="0" />
			<stop stop-color="white" offset="0.33" />
			<stop stop-color="darkgrey" offset="1" />
		</linearGradient>

		<linearGradient id="volume-body-gradient">
			<stop stop-color="darkgrey" offset="0" />
			<stop stop-color="white" offset="0.33" />
			<stop stop-color="darkgrey" offset="1" />
		</linearGradient>

		<!-- colored volume gradients -->

		<linearGradient id="volume-body-gradient">
			<stop stop-color="darkgrey" offset="0" />
			<stop stop-color="white" offset="0.33" />
			<stop stop-color="darkgrey" offset="1" />
		</linearGradient>
	`,

	regions: {
		header: {
			el: '#header',
			replaceElement: true
		},
		main: {
			el: '#main',
			replaceElement: false
		},
		modals: {
			el: '#modals',
			replaceElement: true
		},
		desktop_modals: {
			el: '#desktop-modals',
			replaceElement: true
		}
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.show_header == undefined && !application.isEmbedded()) {
			this.options.show_header = true;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			filters: this.filters,
			markers: this.markers,
			gradients: this.gradients
		};
	},

	onRender: function() {

		// show header view
		//
		if (this.options.show_header) {
			this.showHeader(this.model);
		}

		// show content view
		//
		if (this.options.contentView) {
			this.show(this.options.contentView);
		}

		// show modals view
		//
		this.showModals();

		// intercept touchend events
		//
		this.disableDoubleTapZoom();
	},

	showHeader: function() {
		this.showChildView('header', new HeaderView({
			nav: this.options.nav
		}));
	},

	showUserHeader: function(user) {
		import(
			'../../views/layout/user-header-view.js'
		).then((UserHeaderView) => {
			this.showChildView('header', new UserHeaderView.default({
				model: user,
				nav: this.options.nav
			}));
		});
	},

	showMain: function(view) {
		this.showChildView('main', view);
	},

	showModals: function() {
		this.showChildView('modals', new ModalsView());
	},

	disableDoubleTapZoom: function() {

		// disable double tap to zoom
		//
		let lastTouchEnd = 0;
		this.el.addEventListener('touchend', function (event) {
			let now = (new Date()).getTime();
			if (now - lastTouchEnd <= 300) {

				// prevent default touch behavior
				//
				event.preventDefault();
			}
			lastTouchEnd = now;
		}, false);
	},

	//
	// context menu event handling methods
	//

	onContextMenu: function(event) {

		// do not handle context menu in debug mode
		//
		if (config.debug) {
			return;
		}

		// block event from parent
		//
		this.block(event);
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// delegate key events to main subview
		//
		let view = this.getChildView('main');
		if (view && view.onKeyDown) {
			return view.onKeyDown(event);
		}
	},

	onKeyPress: function(event) {

		// delegate key events to main subview
		//
		let view = this.getChildView('main');
		if (view && view.onKeyPress) {
			return view.onKeyPress(event);
		}
	},

	onKeyUp: function(event) {

		// delegate key events to main subview
		//
		let view = this.getChildView('main');
		if (view && view.onKeyUp) {
			return view.onKeyUp(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {

		// delegate key events to main subview
		//
		let view = this.getChildView('main');
		if (view && view.onResize) {
			return view.onResize(event);
		}
	}
});