/******************************************************************************\
|                                                                              |
|                        selectable-collection-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a set of selectable list items.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CollectionView from '../../views/collections/collection-view.js';
import Containable from '../../views/behaviors/containers/containable.js';
import SelectableContainable from '../../views/behaviors/containers/selectable-containable.js';

export default CollectionView.extend(_.extend({}, Containable, SelectableContainable, {

	//
	// filtering methods
	//

	viewFilter: function (child, index, children) {
		if (child.parent && child.parent.options.filter) {
			return child.parent.options.filter(child, index, children);
		} else {
			return true;
		}
	},

	//
	// querying methods
	//

	isEditable: function() {
		return this.editable || this.options.editable;
	},
	
	//
	// getting methods
	//

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
	
	//
	// rendering methods
	//

	update: function() {
		this.options.selected = this.getSelectedModels();

		// update children
		//
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			child.options.selected = this.options.selected;
			child.update();
		}
	}
}));