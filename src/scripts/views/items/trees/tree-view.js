/******************************************************************************\
|                                                                              |
|                                 tree-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a recursive directory tree.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CollectionView from '../../../views/collections/collection-view.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import TreeContainable from '../../../views/behaviors/containers/tree-containable.js';
import Droppable from '../../../views/behaviors/drag-and-drop/droppable.js';
import TreeViewable from '../../../views/items/trees/tree-viewable.js';
import Browser from '../../../utilities/web/browser.js';

export default CollectionView.extend(_.extend({}, SelectableContainable, TreeContainable, Droppable, TreeViewable, {

	//
	// attributes
	//

	className: 'item-tree collapsable collapsed item',

	template: template(`
		<div class="info">
			
			<span class="expander">
				<button type="button" class="expand btn-sm">
					<i class="fa fa-caret-right"></i>	
				</button>
				<button type="button" class="collapse btn-sm">
					<i class="fa fa-caret-down"></i>
				</button>
			</span>
		
			<div class="icon">
				<%= icon %>
			</div>
			
			<div class="name" spellcheck="false"><%= name %></div>
		
			<div class="specifics">
				<span class="details"><%= details %></span>
			</div>
		</div>
		
		<ul class="hideable item-list"></ul>
	`),

	events: _.extend({}, TreeViewable.events, Droppable.events, {

		// mouse events
		//
		'mousedown': 'onMouseDownNotTarget',
		'click .expander': 'onClickExpander',
		
		// touch events
		//
		'tap': 'onTapNotTarget',
		'tap .expander': 'onTapExpander'
	}),

	modelEvents: {
		'change': 'onChange'
	},

	childViewContainer: '> .item-list',

	//
	// icon attributes
	//

	folderIcon: 'fa fa-folder',
	folderOpenIcon: 'fa fa-folder-open',
	emptyFolderIcon: 'far fa-folder',
	emptyFolderOpenIcon: 'far fa-folder-open',

	// item attributes
	//
	editable: true,

	// animation attributes
	//
	editingDelay: 500,
	duration: 300,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		CollectionView.prototype.initialize.call(this, options);

		// set top
		//
		if (this.isTop()) {
			this.options.top = this;
		}

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

	is: function(state) {
		return this.model.is(state);
	},

	isTop: function() {
		return !(this.parent instanceof this.constructor);
	},

	has: function(key) {
		return this.model.has(key);
	},

	//
	// getting methods
	//

	get: function(key) {
		return this.model.get(key);
	},

	getSelectedIndex: function() {
		for (let i = 0; i < this.children.length; i++) {
			if (this.children.findByIndex(i).isSelected()) {
				return i;
			}
		}
	},
	
	getChildView: function(which) {
		let index;
		switch (which) {
			case 'first':
				return this.children.findByIndex(0);
			case 'prev':
				index = this.getSelectedIndex();
				return index > 0? this.getChildViewAt(index - 1) : this.getChildView('last');
			case 'next':
				index = this.getSelectedIndex();
				return index < this.children.length - 1? this.getChildViewAt(index + 1) : this.getChildView('first');
			case 'last':
				return this.children.findByIndex(this.children.length - 1);
		}
	},

	getItemView: function(model, options) {

		// check root
		//
		if (this.model.is(model)) {
			return this;
		}

		// check children
		//
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (childView.model.is(model)) {
				return childView;
			} else if (options && options.recursive) {
				if (childView.model.contains && childView.model.contains(model, {
					recursive: true
				})) {
					return childView.getItemView(model, options);
				}
			}
		}
	},

	getItemViewByAttribute: function(key, value) {

		// check section
		//
		if (value == this.model.get(key)) {
			return this;
		} else {
			return this.getChildViewByAttribute(key, value);
		}
	},

	getChildViewByAttribute: function(key, value) {

		// check children
		//
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);

			if (child.getItemViewByAttribute) {
				let childView = child.getItemViewByAttribute(key, value);
				if (childView) {
					return childView;
				}

			// check leaf
			//
			} else if (child.model.get(key) == value) {
				return child;
			}
		}
	},

	//
	// selecting methods
	//

	selectItem: function(model, options) {

		// deselect previously selected items
		//
		this.deselectAll(null, {
			silent: true
		});

		// find selected child view
		//
		let itemView = this.getItemView(model, {
			recursive: true
		});

		// check if we found a child view
		//
		if (!itemView) {
			return;
		}

		// expand parent of child
		//
		if (!itemView.isTop()) {
			let directoryView = itemView.parent;
			if (directoryView) {
				directoryView.expand();
			}
		}

		// select child view
		//
		itemView.select(options);
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

	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,

			// state
			//
			selected: this.options.selected && this.options.selected.length > 0 && this.options.selected.contains(model),
			top: this.isTop()? this : this.options.top
		});
	},

	update: function() {

		// update item details
		//
		this.$el.find('> .info .icon').html(this.getIcon());
		this.$el.find('> .info .name').html(this.getName());
		this.$el.find('> .info .details').html(this.getDetails() || '');

		// update children
		//
		if (!this.isCollapsed()) {
			for (let i = 0; i < this.children.length; i++) {
				this.children.findByIndex(i).update();
			}
		}
	},

	updateIcon: function() {
		this.$el.find('> .info > .icon').empty();
		this.$el.find('> .info > .icon').html(this.getIcon());
	},

	//
	// expand / collapse methods
	//

	isCollapsed: function() {
		return this.$el.hasClass('collapsed');
	},

	expand: function() {

		// expand parent(s)
		//
		if (this.parent && this.parent.expand) {
			this.parent.expand();
		}

		// expand tree
		//
		if (this.isCollapsed()) {

			// uncollapse view
			//
			this.$el.removeClass('collapsed');

			// update folder icon
			//
			this.updateIcon();
		}
	},

	collapse: function() {
		if (!this.isCollapsed()) {

			// collapse view
			//
			this.$el.addClass('collapsed');

			// update folder icon
			//
			this.updateIcon();
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.updateIcon();
	},

	//
	// mouse event handling methods
	//

	onMouseDownNotTarget: function() {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		// deselect previously selected items
		//
		if (this.options.deselectable != false) {
			this.deselect();
			this.deselectAll(null, {
				silent: true
			});
		}

		this.onDeselect();
	},

	onClickExpander: function(event) {
		if (this.isCollapsed()) {
			this.expand();
		} else {
			this.collapse();
		}

		// block event from parent
		//
		this.block(event);
	},

	//
	// touch event handling methods
	//

	onTapNotTarget: function() {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}
		
		// deselect previously selected items
		//
		this.deselectAll(null, {
			silent: true
		});

		this.onDeselect();
	},

	onTapExpander: function(event) {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		if (this.isCollapsed()) {
			this.expand();
		} else {
			this.collapse();
		}

		// play tap sound
		//
		application.play('tap');

		// block event from parent
		//
		this.block(event);
	}
}));