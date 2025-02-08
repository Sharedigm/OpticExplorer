/******************************************************************************\
|                                                                              |
|                            account-manager-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for browsing and finding people.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Users from '../../../collections/users/users.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ConnectionShareable from '../../../views/apps/common/behaviors/sharing/connection-shareable.js';
import GoogleContactsImportable from '../../../views/apps/common/behaviors/importing/google-contacts-importable.js';
import HeaderBarView from '../../../views/apps/account-manager/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/account-manager/sidebar/sidebar-view.js';
import AccountsView from '../../../views/apps/account-manager/mainbar/accounts/accounts-view.js';
import FooterBarView from '../../../views/apps/account-manager/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/account-manager/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, SelectableContainable, MultiSelectable, ConnectionShareable, GoogleContactsImportable, {

	//
	// attributes
	//

	name: 'account_manager',

	events: {
		'click > .body': 'onClick',
		'contextmenu > .body': 'onContextMenu'
	},

	//
	// constructor
	//

	initialize: function() {
	
		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);
		
		// set attributes
		//
		this.collection = new Users();
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('content')) {
			this.getChildView('content').each(callback, filter, options);
		}
	},

	//
	// counting methods
	//

	numSelected: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').numSelected();
		}
	},

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setUsers: function(users) {

		// set attributes
		//
		this.collection.reset(users);
		this.search = null;

		// update main bar
		//
		if (this.collection.length == 0) {
			this.showMessage("No people found.", {
				icon: '<i class="far fa-user"></i>'
			});
		} else {
			this.hideMessage();	
		}

		// update
		//
		this.onChange();
	},

	clear: function() {
		this.collection.reset();

		// update
		//
		this.onChange();
	},

	//
	// loading methods
	//

	searchFor: function(search) {

		// perform search
		//
		this.collection.fetchAll({

			// options
			//
			data: {
				name: search
			},

			// callbacks
			//
			success: (collection) => {

				// update attributes
				//
				this.search = search;

				// update views
				//
				this.setUsers(collection.models);

				// update menubar
				//
				this.onLoad();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find people.",
					response: response
				});
			}
		});
	},

	//
	// selecting methods
	//

	openSelected: function() {
		application.showUsers(this.getSelectedModels());
	},

	showInfo: function() {
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// show info for each selected person after delay
		//
		window.setTimeout(() => {
			let selected = this.getSelected();
			for (let i = 0; i < selected.length; i++) {
				this.onOpen(selected[i]);
			}
		}, delay);
	},

	clearSearch: function() {

		// clear search bar
		//
		if (this.hasChildView('header search')) {
			this.getChildView('header search').remove();
		}

		// clear navigation
		//
		this.getChildView('header nav').reset();

		// clear view
		//
		this.hideMessage();
	},

	//
	// deleting methods
	//

	deleteSelected: function() {

		// delete currently selected items
		//
		this.showDeleteDialog(this.getSelectedModels());
	},

	deleteAccounts: function(accounts, options) {
		let count = accounts.length;

		function deleteAccount(account) {
			account.delete({

				// callbacks
				//
				success: (model) => {

					// check if we are finished
					//
					count--;
					if (count == 0) {

						// perform callback
						//
						if (options && options.success) {
							options.success(model);
						}
					}
				},

				error: (model, response) => {

					// perform callback
					//
					if (options && options.error) {
						options.error(model, response);
					}
				}
			});
		}

		// destroy items individually
		//
		for (let i = 0; i < count; i++) {
			deleteAccount(accounts[i]);
		}
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

		// show / hide footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}

		this.searchFor();
	},

	onShow: function() {

		// set focus
		//
		this.$el.find('.search-bar input').focus();
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

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			hidden: this.options.hidden
		});
	},

	getContentView: function() {
		return new AccountsView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			selected: this.getSelectedModels(),
			multicolumn: true,

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: true,
			droppable: false,

			// callbacks
			//
			onselect: (items) => this.onSelect(items),
			ondeselect: (items) => this.onDeselect(items),
			onopen: (item) => this.onOpen(item),
			ondropon: (items, item) => this.onDropOn(items, item)
		});
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
			'../../../views/apps/account-manager/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showDeleteDialog: function(items) {

		// confirm delete
		//
		application.confirm({
			icon: '<i class="fa fa-trash-alt"></i>',
			title: "Delete",
			message: "Are you sure you want to delete " + (items.length == 1? items[0].getName() + "'s account" : "these " + items.length + " accounts") + "?",

			// callbacks
			//
			accept: () => {

				// show loading spinner
				//
				// this.showSpinner();

				// delete file
				//
				this.deleteAccounts(items, {

					// callbacks
					//
					success: () => {

						// hide loading spinner
						//
						// this.hideSpinner();

						// update view
						//
						for (let i = 0; i < items.length; i++) {
							this.collection.remove(items[i]);
						}

						// play delete sound
						//
						application.play('delete');

						// show notification message
						//
						application.notify({
							icon: '<i class="fa fa-trash-alt"></i>',
							title: items.length == 1? 'Account Deleted' : 'Accounts Deleted',
							message: (items.length == 1? items[0].getName() + "'s account has been" : "These " + items.length + " accounts have been") + " deleted."
						});
					}
				});
			}
		});
	},

	//
	// event handling methods
	//

	onOpen: function(item) {

		// open selected profile
		//
		if (!this.options.onopen) {
			application.showUser(item.model);
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});