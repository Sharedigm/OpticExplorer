/******************************************************************************\
|                                                                              |
|                          contact-info-panel-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a panel view of a contact's contact info.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import Expandable from '../../../../../../views/behaviors/expanders/expandable.js';
import ContainableSelectable from '../../../../../../views/behaviors/containers/containable-selectable.js';
import ContactInfoView from '../../../../../../views/apps/contact-editor/mainbar/contacts/info/contact-info-view.js';

export default BaseView.extend(_.extend({}, Expandable, ContainableSelectable, {

	//
	// attributes
	//

	tagName: 'form',
	className: 'expandable form-horizontal',

	template: template(`
		<div class="header info">
		
			<% if (heading) { %>
			<div class="heading"><% if (icon) { %><div class="icon"><%= icon %></div><% } %><%= heading %></div>
			<% } %>
			
			<% if (expandable || editable) { %>
			<div class="buttons">
				<% if (expandable) { %>
				<div class="expander">
					<button type="button" class="collapse btn-sm">
						<i class="fa fa-caret-up"></i>
					</button>
					<button type="button" class="expand btn-sm">
						<i class="fa fa-caret-down"></i>	
					</button>
				</div>
				<% } %>
		
				<% if (editable) { %>
				<button type="button" class="add success btn btn-sm" data-toggle="tooltip" title="Add Contact Info">
					<i class="fa fa-plus"></i>
				</button>
				<% } %>
			</div>
			<% } %>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		items: '.items'
	},

	events: {
		'click .heading': 'onClickHeading',
		'click .expander': 'onClickExpander',
		'click .add': 'onClickAdd'
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').each(callback, filter, options);
		}
	},
	
	//
	// adding methods
	//

	addItem: function() {
		import(
			'../../../../../../views/apps/contact-editor/dialogs/contacts/add/add-user-contact-dialog-view.js'
		).then((AddUserContactDialogView) => {
			
			// show add dialog
			//
			application.show(new AddUserContactDialogView.default({

				// callbacks
				//
				onadd: (model) => {
					this.collection.add(model);

					// update view
					//
					if (this.collection.length == 1) {
						this.render();
					}
				}
			}));
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: '<i class="fa fa-envelope"></i>',
			heading: this.options.heading,

			// capabilities
			//
			expandable: this.options.expandable,
			editable: this.options.editable
		};
	},

	onRender: function() {

		// show child views
		//
		this.showUserContacts();

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showUserContacts: function() {
		this.showChildView('items', new ContactInfoView({
			collection: this.collection,

			// options
			//
			multicolumn: this.options.multicolumn,
			countries: this.options.countries,
			empty: "No contact info.",

			// capabilities
			//
			expandable: this.options.expandable,
			selectable: this.options.selectable,
			editable: this.options.editable,
			draggable: this.options.draggable,
			droppable: this.options.droppable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchange: this.options.onchange,
			onadd: this.options.onadd,
			onremove: this.options.onremove
		}));
	},

	//
	// mouse event handling methods
	//

	onClickHeading: function() {
		if (this.hasChildView('items')) {
			this.getChildView('items').deselectAll();
		}
	},

	onClickExpander: function() {
		this.toggleCollapse({
			recursive: true
		});
	},

	onClickAdd: function() {
		this.addItem();
	}
}));