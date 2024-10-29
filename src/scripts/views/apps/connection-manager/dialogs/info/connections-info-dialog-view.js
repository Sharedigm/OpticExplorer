/******************************************************************************\
|                                                                              |
|                         connections-info-dialog-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a collection      |
|        of connections.                                                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ConnectionInfoDialogView from '../../../../../views/apps/connection-manager/dialogs/info/connection-info-dialog-view.js';
import TabsView from '../../../../../views/apps/connection-manager/forms/info/tabs/tabs-view.js';
import ConnectionInfoFormView from '../../../../../views/apps/connection-manager/forms/info/connection-info-form-view.js';

export default ConnectionInfoDialogView.extend({

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
						Connection Info
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
		
						<!-- general buttons -->
						<button type="submit" class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
		
						<!-- sharing buttons -->
						<button class="delete-shares btn" style="display:none" disabled>
							<i class="fa fa-trash-alt"></i>Delete Shares
						</button>
		
						<!--  cancel / close button -->
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
	// constructor
	//

	initialize: function() {
		this.tab = this.options.tab;

		// call superclass constructor
		//
		ConnectionInfoDialogView.prototype.initialize.call(this);
		
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

	getSelectedShareRequests: function() {
		return this.getActiveView().getSelectedShareRequests();
	},

	getSelectedLinks: function() {
		return this.getActiveView().getSelectedLinks();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			index: this.index
		};
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

	showTabPane: function(model, index) {

		// add new region
		//
		this.addRegion('tab_pane' + this.index + '-' + index, '#tab-pane' + this.index + '-' + index);

		// listen to model for changes
		//
		this.listenTo(model, 'change', this.onChange);

		// show child view
		//
		this.showChildView('tab_pane' + this.index + '-' + index, new ConnectionInfoFormView({
			model: model,

			// options
			//
			index: index,

			// callbacks
			//
			onchange: () => this.update(),
			onselect: () => this.update(),
			ondeselect: () => this.update()
		}));
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
