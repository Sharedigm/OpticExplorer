/******************************************************************************\
|                                                                              |
|                               tree-viewable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a mixin for a single generic tree item.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Selectable from '../../../views/behaviors/selection/selectable.js';
import DragSelectable from '../../../views/behaviors/selection/drag-selectable.js';
import Highlightable from '../../../views/behaviors/selection/highlightable.js';
import Draggable from '../../../views/behaviors/drag-and-drop/draggable.js';
import MultiDraggable from '../../../views/behaviors/drag-and-drop/multi-draggable.js';
import Renamable from '../../../views/items/behaviors/renamable.js';
import Animatable from '../../../views/items/behaviors/animatable.js';
import Timeable from '../../../views/behaviors/effects/timeable.js';
import FileUtils from '../../../utilities/files/file-utils.js';

export default _.extend({}, Selectable, DragSelectable, Highlightable, Draggable, MultiDraggable, Renamable, Animatable, Timeable, {

	//
	// attributes
	//

	nameSelector: '> .info .name',

	events: _.extend({}, Draggable.events, {

		// mouse events
		//
		'mousedown > .info .icon': 'onMouseDown',
		'mousedown > .info .name:not([contenteditable="true"])': 'onMouseDownNonEditableName',
		'mousedown > .info .name[contenteditable="true"]': 'onMouseDownEditableName',
		'blur > .info .name[contenteditable="true"]': 'onBlurEditableName',
		'dblclick > .info .icon, .name': 'onDoubleClick',

		// keyboard events
		//
		'keypress > .info .name[contenteditable="true"]': 'onKeyPressEditableName',	

		// touch events
		//
		'tap > .info .icon': 'onTap',
		'tap > .info .name': 'onTap',
		'doubletap > .info .icon, .name': 'onDoubleTap',
	}),

	tooltips: {
		placement: 'left'
	},

	//
	// querying methods
	//

	tagName: function() {
		/*
		if (this.isTop()) {
			return 'div';
		} else {
			return 'li';
		}
		*/
		return 'div';
	},

	isLoading: function() {
		return this.$el.hasClass('loading');
	},

	isTop: function() {
		return this.$el.hasClass('top');
	},

	isHidden: function() {
		return FileUtils.getItemName(this.model.get('path')).startsWith('.');
	},

	isEditable: function() {
		if (this.isTop()) {
			return this.editable != false;
		} else {
			return this.parent.isEditable();
		}
	},

	hasParent: function() {
		return this.parent != null;
	},
	
	hasTop: function() {
		return this.getTop() != null;
	},
	
	//
	// getting methods
	//

	getTop: function() {
		let node = this;
		while (node && !node.isTop()) {
			node = node.parent;
		}
		return node;
	},

	getDetails: function() {
		let kind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		if (!this.isTop() && kind) {
			return this.model.getAttribute(kind, this.options.preferences);
		}
	},

	getBoundingElement: function() {
		return this.$el.find('.info')[0];
	},

	getDragImage: function() {
		let elements = this.getTop().cloneSelectedElements({
			position: true
		});

		// create new drag image
		//
		let dragImage = $('<div class="drag-image"></div>');

		// add selected views to drag image
		//
		dragImage.append(elements);
		
		// set class and add count for multiple items
		//
		if (elements.length > 1) {
			dragImage.addClass('multiple');
			dragImage.append('<div class="warning count badge">' + this.parent.numSelectedElements() + '</div>');
		}

		// set drag image bounds
		//
		let selected = this.parent.getVisibleElements('.selected');
		let left = 0;
		let right = 0;
		for (let i = 0; i < selected.length; i++) {
			let item = $(selected[i]);
			let name = $(item).find('.name');
			let itemLeft = name.position().left;
			let itemWidth = name.outerWidth();
			let itemRight = itemLeft + itemWidth;

			if (i == 0) {
				left = itemLeft;
				right = itemRight;
			} else {
				if (itemLeft < left) {
					left = itemLeft;
				}
				if (itemRight > right) {
					right = itemRight;
				}
			}
		}
		
		let rect = this.parent.getSelectedElementRect();
		dragImage.css({
			top: rect.top,
			left: rect.left,
			width: right - rect.left + 5,
			height: rect.height
		});

		return dragImage;
	},

	//
	// setting methods
	//

	setEditable: function() {
		this.select();
		this.editName();
	},

	//
	// expand / collapse methods
	//

	expandParents: function() {

		// expand parents
		//
		let parent = this.parent;
		while (parent && parent.expand) {
			parent.expand();
			parent = parent.parent;
		}
	},

	//
	// opening methods
	//

	open: function() {
		let effect = application.settings.theme.get('icon_open_effect');

		// apply effect
		//
		if (effect) {
			this.showEffect(effect);
		}

		// clear delayed name editing
		//
		this.clearEditNameDelay();
		
		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(this);
		}
	},

	//
	// loading methods
	//

	startLoading: function(delay) {

		// set optional parameter defaults
		//
		if (delay == undefined) {
			delay = 500;
		}

		// add loading spinner after a slight delay
		//
		this.setTimeout(() => {
					
			// add loading spinner
			//
			this.$el.addClass('loading');
		}, delay);
	},

	stopLoading: function() {
		this.$el.removeClass('loading');

		// clear loading timeout
		//
		this.clearTimeout();
	},

	//
	// selecting methods
	//

	select: function(options) {

		// call superclass method
		//
		Selectable.select.call(this, options);

		// make tree node draggable
		//
		this.enableDragging();
	},

	deselect: function(options) {

		// call superclass method
		//
		Selectable.deselect.call(this, options);

		// also deselect children
		//
		if (this.deselectAll) {
			this.deselectAll();
		}

		// update view
		//
		this.unhighlight();

		// stop editing
		//
		if (this.isEditing()) {
			this.deselectName();
		}

		// make tree node non draggable
		//
		this.disableDragging();
		let parent = this.parent;
		while (parent && parent.disableDragging) {
			parent.disableDragging();
			parent = parent.parent;
		}

		// free drag selected behavior
		//
		if (this.dragSelectedBehavior) {
			this.dragSelectedBehavior.off();
			this.dragSelectedBehavior = null;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// when rendering sub folders, wait until
		// they are opened to show folder contents
		//
		if (this.isTop()) {
			this.$el.addClass('top');
			this.$el.removeClass('collapsed');

			if (this.options.show_root) {
				this.$el.addClass('show-root');
			}
		}
		
		// set inital selection
		//
		/*
		if (this.options.selected) {
			if (this.options.selected.contains) {

				// selected item is a tree
				//
				if (this.options.selected.contains(this.model)) {
					this.select({
						silent: true
					});
				}
			} else if (this.options.selected.is(this.model)) {

				// selected item is a leaf
				//
				this.select({
					silent: true
				});
			}
		}
		*/

		// set inital selection
		//
		if (this.options.selected) {
			if (this.options.selected == true || this.model.is(this.options.selected)) {
				this.select({
					silent: true
				});
			}
		}

		// show badges, if applicable
		//
		if (this.showBadges) {
			this.showBadges();
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// mouse event handling methods
	//

	onMouseDownEditableName: function(event) {

		// block event from parent
		//
		this.block(event);
	},
	
	onBlurEditableName: function() {
		this.editable = false;
	},

	onDoubleClick: function(event) {

		// open item
		//
		if (!this.isLoading() && event.target.contentEditable != 'true') {
			this.open();

			// block event from parent
			//
			this.block(event);
		}
	},

	//
	// touch event handling methods
	//

	onDoubleTap: function(event) {
		this.onDoubleClick(event);
	},

	//
	// drag event handling methods
	//

	onDragStart: function(event) {

		// cancel name editing
		//
		this.clearEditNameDelay();

		// call mixin method
		//
		Draggable.onDragStart.call(this, event);

		// store handle to dragged items
		//
		this.setDragged(this.parent.getSelected());
	},

	onDragEnd: function(event) {

		// call mixin method
		//
		Draggable.onDragEnd.call(this, event);
	}
});