/******************************************************************************\
|                                                                              |
|                            chats-info-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a collection      |
|        of topics.                                                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import InfoDialogView from '../../../../../views/apps/common/dialogs/info/info-dialog-view.js';
import TabsView from '../../../../../views/apps/chat-browser/forms/info/tabs/tabs-view.js';
import ChatInfoFormView from '../../../../../views/apps/chat-browser/forms/info/chat-info-form-view.js';

export default InfoDialogView.extend({

	//
	// attributes
	//
	

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-comments"></i>
					</div>
					<div class="title">
						Chats Info
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
		InfoDialogView.prototype.initialize.call(this);
		
		// index is used to create unique ids for multiple dialogs
		//
		this.index = this.constructor.count++;

		// this is the index to the current active region / view / tab
		//
		this.active = 0;
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

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection,
			index: this.index
		};
	},

	showForm: function() {

		// show tabs
		//
		this.showTabs();
		this.showTabPanes();
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
		this.showChildView('tab_pane' + this.index + '-' + index, new ChatInfoFormView({
			model: model,

			// options
			//
			index: index
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
