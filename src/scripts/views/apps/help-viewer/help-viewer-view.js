/******************************************************************************\
|                                                                              |
|                               help-viewer-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for browsing the web.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Page from '../../../models/indices/page.js';
import Section from '../../../models/indices/section.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import LinkShareable from '../../../views/apps/common/behaviors/sharing/link-shareable.js';
import HeaderBarView from '../../../views/apps/help-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/help-viewer/sidebar/sidebar-view.js';
import PageIndexView from '../../../views/apps/help-viewer/sidebar/indices/page-index-view.js';
import SectionIndexView from '../../../views/apps/help-viewer/sidebar/indices/section-index-view.js';
import HelpCoverView from '../../../views/apps/help-viewer/mainbar/help-cover-view.js';
import HelpPageView from '../../../views/apps/help-viewer/mainbar/help-page-view.js';
import HelpSectionView from '../../../views/apps/help-viewer/mainbar/help-section-view.js';
import FooterBarView from '../../../views/apps/help-viewer/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/help-viewer/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/browser.js';
import AddressBar from '../../../utilities/web/address-bar.js';

export default AppSplitView.extend(_.extend({}, LinkShareable, {

	//
	// attributes
	//

	name: 'help_viewer',

	//
	// constructor
	//

	initialize: function() {
	
		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set attributes
		//
		this.index = [];
		this.model = new Section({
			url: '#help',
			top: true,
			items: Section.parse(config.help.items, '#help', this.index)
		});
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelected();
		}
	},

	hasShareable: function() {
		return true;
	},

	//
	// counting methods
	//

	numPages: function() {
		return this.index.length;
	},

	numSections: function() {
		return this.model.get('items').length;
	},

	//
	// getting methods
	//

	getCurrent: function() {
		return this.getSelected().model;
	},

	getPageIndex: function(model) {
		for (let i = 0; i < this.index.length; i++) {
			if (this.index[i] == model) {
				return i + 1;
			}
		}
	},

	getPageNumber: function(which, options) {
		switch (which) {
			case 'first':
				return 1;
			case 'prev': {
				let pageNumber = this.getPageNumber();
				if (pageNumber > 1) {
					return pageNumber - 1;
				} else if (options && options.wraparound) {
					return this.numPages();
				} else {
					return 1;
				}
			}
			case 'next': {
				let pageNumber = this.getPageNumber();
				if (pageNumber < this.numPages()) {
					return pageNumber + 1;
				} else if (options && options.wraparound) {
					return 1;
				} else {
					return this.numPages();
				}
			}
			case 'last':
				return this.numPages();
			default: {
				let selected = this.getSelected()[0];
				if (selected) {
					return this.getPageIndex(selected.model);
				}
			}
		}
	},

	getSelected: function() {
		if (this.getChildView('sidebar')) {
			return this.getChildView('sidebar').getSelected();
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setPageNumber: function(pageNumber) {
		this.setAddress(this.index[pageNumber - 1].get('url'));
	},

	setPageIndex: function(pageIndex) {
		if (this.hasChildView('header page')) {
			this.getChildView('header page').setPageNumber(pageIndex);
		}
		if (this.hasChildView('footer page')) {
			this.getChildView('footer page').setPageNumber(pageIndex);
		}
	},

	setAddress: function(url, options) {
		let itemView;

		// update attributes
		//
		this.url = url || '#help';

		// get item with url from tree view
		//
		itemView = this.getChildView('sidebar').getItemViewByAttribute('url', url);
		
		// show help page or section
		//
		if (itemView) {
			this.setItemView(itemView, options);

		// show page or section
		//
		} else if (this.url.startsWith('#')) {

			// show page in mainbar
			//
			this.getChildView('content').showChildView('container', new HelpPageView({
				model: new Page({
					url: this.url.replace('#help/apps', '#apps')
				})
			}));

			// add address to history
			//
			if (this.hasChildView('header nav')) {
				this.getChildView('header nav').push(url);
			}

			// deselect sidebar items
			//
			this.getChildView('sidebar').deselectAll();
		} else {

			// open link in new tab
			//
			window.open(this.url);
		}

		// update address bar
		//
		if (!application.desktop) {
			AddressBar.set(AddressBar.get('base') + this.url.replace('#apps', '#help/apps'));
		}
	},

	setItemView: function(itemView, options) {

		// collapse parent of previously selected item
		//
		if (this.itemView && this.itemView.parent) {
			if (itemView.parent != this.itemView.parent) {
				if (this.itemView.parent.isTop && !this.itemView.parent.isTop()) {
					this.itemView.parent.collapse();
				}
			}
		}
		
		// set attributes
		//
		this.itemView = itemView;

		// show current selection
		//
		this.showItemView(itemView, options);
		
		// set sidebar to current selection
		//
		this.getChildView('sidebar').setItemView(itemView, options);
	},

	//
	// selecting methods
	//

	select: function(which) {
		this.setPageNumber(this.getPageNumber(which, {
			wraparound: true
		}));
	},

	//
	// dialog methods
	//

	newWindow: function() {
		this.showHelp({
			new_window: true
		});
	},

	shareByLink: function() {
		this.showShareByLinkDialog(application.getUrl() + (this.url || '#help'));
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);
		
		// show child views
		//
		this.showHeaderBar();
		this.showContents();

		// show or hide footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}

		// set initial page
		//
		if (this.options.url) {
			this.setAddress(this.options.url);
		}

		// add address to history
		//
		if (this.hasChildView('header nav')) {
			this.getChildView('header nav').push(null);
		}

		// initialize menus
		//
		this.onLoad();
	},

	showHelp: function(options) {
		application.launch(this.name, {
			url: this.url
		}, options);
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// content rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			model: this.model,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (itemView) => {
				if (itemView) {
					this.showItemView(itemView);
				} else {
					this.setAddress('#help');
				}
			}
		});
	},

	getContentView: function() {
		return new HelpCoverView();
	},

	showItemView: function(itemView, options) {

		// update history
		//
		if (!options || !options.silent) {

			// add address to history
			//
			if (this.hasChildView('header nav')) {
				this.getChildView('header nav').push(itemView.model.get('url'));
			}
		}

		// expand sections in sidebar
		//
		if (itemView.expandParents) {
			itemView.expandParents();
		}

		// show item in mainbar
		//
		if (itemView.model.get('top')) {

			// show cover in mainbar
			//
			this.showCover(itemView);
		} else if (itemView instanceof SectionIndexView) {

			// show section in mainbar
			//
			this.showSection(itemView);
		} else if (itemView instanceof PageIndexView) {

			// show page in mainbar
			//
			this.showPage(itemView);
		}

		// update current url
		//
		this.url = itemView.model.get('url') || '';

		// set page number in footer bar
		//
		this.setPageIndex(itemView.model.get('index'));

		// update address bar
		//
		if (!application.desktop) {
			AddressBar.set(AddressBar.get('base') + this.url.replace('#apps', '#help/apps'));
		}
	},

	showCover: function(coverIndexView) {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// show cover in mainbar
		//
		this.showChildView('content', new HelpCoverView({
			model: coverIndexView.model,

			// callbacks
			//
			onclicklink: (url) => this.onClickLink(url)
		}));
	},

	showSection: function(sectionIndexView) {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// show section in mainbar
		//
		this.getChildView('content').showChildView('container', new HelpSectionView({
			model: sectionIndexView.model,

			// callbacks
			//
			onclicklink: (url) => this.onClickLink(url)
		}));
	},

	showPage: function(pageIndexView) {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// show page in mainbar
		//
		this.getChildView('content').showChildView('container', new HelpPageView({
			model: pageIndexView.model,

			// callbacks
			//
			onclicklink: (url) => this.onClickLink(url)
		}));
	},

	showBrowser: function(url) {
		application.launch('web_browser', {
			url: url
		});
	},

	showUrl: function(url) {
		if (url.startsWith('#')) {

			// internal links
			//
			this.setAddress(url);
		} else {

			// external links
			//
			this.showBrowser(url)
		}
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},
	
	//
	// dialog rendering methods
	//

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/help-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickLink: function(url) {
		this.showUrl(url);
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});