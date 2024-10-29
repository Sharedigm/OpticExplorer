/******************************************************************************\
|                                                                              |
|                                 leaf-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a single generic tree leaf item.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemView from '../../../views/items/item-view.js';
import TreeViewable from '../../../views/items/trees/tree-viewable.js';

export default ItemView.extend(_.extend({}, TreeViewable, {

	//
	// attributes
	//

	template: template(`
		<div class="info">
		
			<div class="icon">
				<%= icon %>
			</div>
			
			<div class="name" spellcheck="false"><%= name %></div>
		
			<div class="specifics">
				<span class="details"><%= details %></span>
			</div>
		</div>
	`),

	// image attributes
	//
	thumbnailSize: 25,
	
	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.editable && this.options.editable != undefined) {
			this.editable = this.options.editable;
		}
		this.parent = this.options.parent;
	},

	//
	// querying methods
	//

	isTop: function() {
		return false;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			details: this.getDetails()
		};
	},

	onRender: function() {

		// call mixin method
		//
		TreeViewable.onRender.call(this);
	},

	//
	// event handling methods
	//

	onChange: function() {

		// wait until after model change is complete to change icon
		//
		if (this.getName() == this.getCurrentName()) {
			this.render();
		}
	}
}));