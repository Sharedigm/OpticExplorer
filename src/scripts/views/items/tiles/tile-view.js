/******************************************************************************\
|                                                                              |
|                                 tile-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a single generic tile.                    |
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
import MultiDraggable from '../../../views/behaviors/drag-and-drop/multi-draggable.js';
import CssUtils from '../../../utilities/web/css-utils.js';

export default ItemView.extend(_.extend({}, MultiDraggable, {

	//
	// attributes
	//
	

	template: template(`
		<div class="tile">
			<div class="icon">
				<%= icon %>
			</div>
			<div class="name" spellcheck="false"><%= name %></div>
		</div>
		
		<% if (typeof details != 'undefined') { %>
		<div class="specifics">
			<span class="details"><%= details %></span>
		</div>
		<% } %>
	`),

	// image attributes
	//
	thumbnailSize: 100,

	//
	// getting methods
	//

	getTileColorById: function(id) {

		// set color of tile from svg def
		//
		let svg = $('#' + id);
		let style = $(svg).attr('style');
		if (style) {
			let styles = CssUtils.parse(style);
			if (styles.background) {
				return styles.background;
			}
		}	
	},

	getTileColor: function() {
		return this.hasThumbnail()? '' : this.getTileColorById(this.id);
	},

	getEffectElement: function() {
		return this.$el.find('.tile');
	},

	//
	// selecting methods
	//

	select: function(options) {

		// call superclass method
		//
		ItemView.prototype.select.call(this, options);

		// make tile draggable
		//
		if (this.options.draggable) {
			this.enableDragging();
		}
	},

	deselect: function(options) {

		// call superclass method
		//
		ItemView.prototype.deselect.call(this, options);

		// make tile non draggable
		//
		if (this.options.draggable) {
			this.disableDragging();
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

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			details: this.getDetails()
		};
	},

	setTileColor: function(color) {
		this.$el.find('.tile .icon').css('background-color', color || '');
	},

	setTileColors: function(id, color) {
		let tiles = this.parent.getChildren((child) => child.id == id);
		for (let i = 0; i < tiles.length; i++) {
			tiles[i].setTileColor(color);
		}
	},

	getSvg: function(path, id) {

		// create directory of existing svgs
		//
		if (!this.parent.svgs) {
			this.parent.svgs = {};
		}

		// add item to defs
		//
		if (!this.parent.svgs[id]) {

			// create new svg
			//
			this.parent.svgs[id] = $('svg');

			// add svg to defs
			//
			let defs = this.parent.$el.find('defs');
			let def = defs.find('#' + id)[0];
			if (!def) {

				// fetch svg
				//
				this.fetchSvg(path, {

					// callbacks
					//
					success: (data) => {
						if (!data.childNodes) {
							return;
						}

						// add svg to defs
						//
						let svg = $(data.childNodes[0]);
						let style = $(data.documentElement).attr('style');
						svg.attr('id', id);
						svg.attr('style', style);
						defs.append(svg);

						// set color of all tiles using this svg def
						//
						if (style) {
							let styles = CssUtils.parse(style);
							if (styles.background) {
								this.setTileColors(id, styles.background);
							}
						}
					}
				});
			}
		} else {
			this.setTileColor(this.getTileColorById(id));
		}

		// create reference to defs
		//
		return '<svg viewBox="0 0 512 512"><use href="#' + id + '"></use></svg>';
	},

	setIcon: function(icon) {
		this.$el.find('.icon').html($(icon));
		this.setTileColor(this.getTileColor());
	},

	update: function() {

		// update item details
		//
		this.setIcon(this.getIcon());
		this.$el.find('.name').html(this.getName());
		this.$el.find('.details').html(this.getDetails() || '');
	},

	//
	// drag and drop event handling methods
	//

	onDragStart: function(event) {

		// cancel name editing
		//
		this.clearEditNameDelay();

		// call superclass method
		//
		ItemView.prototype.onDragStart.call(this, event);

		// store handle to dragged items
		//
		this.setDragged(this.parent.getSelected());
	}
}));