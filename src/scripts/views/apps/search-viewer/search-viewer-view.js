/******************************************************************************\
|                                                                              |
|                            search-viewer-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing search results.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AppSplitView from '../../../views/apps/common/app-split-view.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import HeaderBarView from '../../../views/apps/search-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/search-viewer/sidebar/sidebar-view.js';
import SearchView from '../../../views/apps/search-viewer/mainbar/search-view.js';
import FooterBarView from '../../../views/apps/search-viewer/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/search-viewer/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, ItemOpenable, ItemInfoShowable, {

	//
	// attributes
	//

	name: 'search_viewer',

	//
	// querying methods
	//

	hasSelected: function() {
		return this.getChildView('content').hasSelected();
	},

	numResults: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').numResults();
		} else {
			return 0;
		}
	},

	//
	// getting methods
	//

	getOption: function(kind) {
		return this.getChildView('sidebar params').getValue(kind);
	},

	getSelectedModels: function() {
		return this.getChildView('content').getSelectedModels();
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
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

		// show footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}

		this.onLoad();
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			collection: this.collection,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) => this.getChildView('header menu').onChangeSelection(item),
			ondeselect: (item) => this.getChildView('header menu').onChangeSelection(item)
		});
	},

	getContentView: function() {
		return new SearchView({

			// options
			//
			preferences: this.preferences,
			multicolumn: true,

			// callbacks
			//
			onsearch: (query) => this.onSearch(query),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			onchange: () => this.onChange()
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	updateStatusBar: function() {
		this.getStatusBar().update();
	},

	//
	// dialog rendering methods
	//

	showInfoDialog: function(options) {
		let items = this.getSelectedModels();
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		window.setTimeout(() => {
			if (items.length > 0) {
				this.showItemsInfoDialog(items, options);
			} else {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-info-circle"></i>',
					title: "Show Info",
					message: "No items selected."
				});
			}
		}, delay);
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/search-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// event handling methods
	//

	onSearch: function() {
		this.getChildView('content').render();
		this.onChange();
	},

	onChange: function() {
		this.updateStatusBar();
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	//
	// static rendering methods
	//

	showSearch: function() {
		import(
			'../../../views/apps/search-viewer/mainbar/results/search-page-view.js'
		).then((SearchPageView) => {

			// show search page
			//
			application.showPage(new SearchPageView.default(), {
				nav: 'search'
			});
		});
	}
});