/******************************************************************************\
|                                                                              |
|                            items-info-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a collection      |
|        of files or directories.                                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../models/storage/files/file.js';
import ImageFile from '../../../../../models/storage/media/image-file.js';
import Directory from '../../../../../models/storage/directories/directory.js';
import ItemInfoDialogView from '../../../../../views/apps/file-browser/dialogs/info/item-info-dialog-view.js';
import TabsView from '../../../../../views/apps/file-browser/forms/info/tabs/tabs-view.js';
import FileInfoView from '../../../../../views/apps/file-browser/forms/info/file-info-view.js';
import ImageFileInfoView from '../../../../../views/apps/file-browser/forms/info/image-file-info-view.js';
import DirectoryInfoView from '../../../../../views/apps/file-browser/forms/info/directory-info-view.js';

export default ItemInfoDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-info-circle"></i>
					</div>
					<div class="title">
						Info
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="tabs"></div>
					<div class="tab-content">
						<% for (let i = 0; i < items.length; i++) { %>
						<div role="tabpanel" id="tab-pane<%= index %>-<%= i %>" class="tab-pane<% if (i == 0) { %> active<% } %>">
						</div>
						<% } %>
					</div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button type="submit" class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
						<button class="save btn btn-primary" style="display:none" disabled>
							<i class="fa fa-save"></i>Save
						</button>
						<button class="new-link btn btn-primary" style="display:none">
							<i class="fa fa-link"></i>New Link
						</button>
						<button class="copy-link btn" style="display:none">
							<i class="fa fa-copy"></i>Copy Link
						</button>
						<button class="delete-links btn" style="display:none">
							<i class="fa fa-trash-alt"></i>Delete Links
						</button>
						<button class="cancel btn" data-dismiss="modal" style="display:none">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		tabs: '.tabs'
	},

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.small,

	//
	// constructor
	//

	initialize: function() {
		this.tab = this.options.tab;

		// call superclass constructor
		//
		ItemInfoDialogView.prototype.initialize.call(this);
		
		// index is used to create unique ids for multiple dialogs
		//
		this.index = this.constructor.count++;

		// this is the index to the current active region / view / tab
		//
		this.active = 0;
	},

	//
	// counting methods
	//

	numSelectedShareRequests: function() {
		return this.getActiveView().numSelectedShareRequests();
	},

	numSelectedLinks: function() {
		return this.getActiveView().numSelectedLinks();
	},

	//
	// getting methods
	//

	getChildViewAt: function(index) {
		return this.getChildView('tab_pane' + this.index + '-' + index);
	},

	getActiveIndex: function() {
		return this.getChildView('tabs').getActiveIndex();
	},

	getActiveView: function() {
		return this.getChildViewAt(this.getActiveIndex());
	},

	getItem: function() {
		return this.getActiveView().model;
	},

	getSelectedShareRequests: function() {
		return this.getActiveView().getSelectedShareRequests();
	},

	getSelectedLinks: function() {
		return this.getActiveView().getSelectedLinks();
	},

	getInfoFormViewClass: function(model) {
		if (model instanceof ImageFile) {
			return ImageFileInfoView;
		} else if (model instanceof Directory) {
			return DirectoryInfoView;
		} else if (model instanceof File) {
			return FileInfoView;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			index: this.index
		};
	},

	onRender: function() {

		// call superclass method
		//
		ItemInfoDialogView.prototype.onRender.call(this);

		// fetch collection models to get metadata
		//
		let count = 0;
		for (let i = 0; i < this.collection.length; i++) {
			this.collection.at(i).fetch({

				// callbacks
				//
				success: () => {
					count++;
					if (count == this.collection.length) {

						// show form
						//
						this.showForm();
					}
				}
			});
		}
	},

	showForm: function() {

		// show tabs
		//
		this.showTabs();
		this.showTabPanes();

		// set button visibility according to tabs
		//
		if (this.tab) {
			this.setButtonVisibility();
		}	
	},

	showTabs: function() {
		this.showChildView('tabs', new TabsView({
			collection: this.collection,

			// options
			//
			index: this.index,

			// callbacks
			//
			onclick: (index) => {

				// get currently selected tab name
				//
				let tabName = this.getChildViewAt(this.active).getActiveTabName();

				// set tab name of selected view
				//
				this.getChildViewAt(index).setActiveTabName(tabName);
			}
		}));
	},

	showInfoPane: function(model, index) {
		this.showChildView('tab_pane' + this.index + '-' + index, new (this.getInfoFormViewClass(model))({
			model: model,

			// options
			//
			index: index,

			// callbacks
			//
			onchange: () => this.update()
		}));
	},

	showTabPane: function(model, index) {

		// add new region
		//
		this.addRegion('tab_pane' + this.index + '-' + index, '#tab-pane' + this.index + '-' + index);

		// listen to model for changes
		//
		this.listenTo(model, 'change', this.onChange);

		// show child view
		//
		this.showInfoPane(model, index);
	},

	showTabPanes: function() {
		for (let i = 0; i < this.collection.length; i++) {
			this.showTabPane(this.collection.at(i), i);
		}	
	}
}, {
	
	//
	// static attributes
	//

	count: 0
});