/******************************************************************************\
|                                                                              |
|                                 item-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a single generic item.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModelView from '../../views/items/model-view.js';
import Selectable from '../../views/behaviors/selection/selectable.js';
import DragSelectable from '../../views/behaviors/selection/drag-selectable.js';
import Highlightable from '../../views/behaviors/selection/highlightable.js';
import Draggable from '../../views/behaviors/drag-and-drop/draggable.js';
import Renamable from '../../views/items/behaviors/renamable.js';
import Animatable from '../../views/items/behaviors/animatable.js';
import Timeable from '../../views/behaviors/effects/timeable.js';
import FileUtils from '../../utilities/files/file-utils.js';
import Browser from '../../utilities/web/browser.js';

export default ModelView.extend(_.extend({}, Selectable, DragSelectable, Highlightable, Draggable, Renamable, Animatable, Timeable, {

	//
	// attributes
	//

	className: 'item',

	events: _.extend({}, Selectable.events, Draggable.events, Renamable.events, {

		// mouse events
		//
		'dblclick': 'onDoubleClick',
		// 'click .owner': 'onClickOwner',

		// touch events
		//
		'doubletap': 'onDoubleTap'
	}),

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.selectable != undefined) {
			this.selectable = this.options.selectable;
		}
		if (this.options.editable != undefined) {
			this.editable = this.options.editable;
		}
		this.parent = this.options.parent;

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', this.onChange, this);
	},

	//
	// ajax methods
	//

	fetchSvg: function(path, options) {
		$.ajax(_.extend({}, options, {
			url: path,
			type: 'GET'
		}));
	},

	//
	// querying methods
	//

	isLoading: function() {
		return this.$el.hasClass('loading');
	},

	isHidden: function() {
		return FileUtils.getItemName(this.model.get('path')).startsWith('.');
	},

	hasThumbnail: function() {
		return false;
	},

	hasDetails: function() {
		let kind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		return kind && this.model.hasAttribute(kind, this.options.preferences);
	},

	canShowThumbnail: function() {
		return false;
	},

	//
	// getting methods
	//

	getDetails: function() {
		let kind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		if (kind) {
			return this.model.getAttribute(kind, this.options.preferences);
		}
	},

	getName: function() {
		return this.model.getName? this.model.getName() : this.model.get('name');
	},

	getImageIcon: function() {
		return '<img src="' + this.getIconUrl() + '" />';
	},

	getDefs: function() {
		return this.parent.$el.find('defs')[0] || $('defs')[0];
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
			let defs = this.getDefs();
			let def = $(defs).find('#' + id)[0];
			if (!def) {
				this.fetchSvg(path, {

					// callbacks
					//
					success: (data) => {
						if (!data.childNodes) {
							return;
						}
						
						// create new svg
						//
						let svg = $(data.childNodes[0]);
						svg.attr('id', id);

						// add shadowing
						//
						if (Browser.is_explorer || Browser.is_edge) {
							svg.attr('filter', 'url(#shadowed)');
						}

						// add svg to defs
						//
						$(defs).append(svg);
					}
				});
			}
		}

		// create reference to defs
		//
		return '<svg viewBox="0 0 512 512"><use href="#' + id + '"></use></svg>';
	},

	getSvgIcon: function() {
		return this.getSvg(this.getIconUrl(), this.getIconId());
	},

	getIcon: function() {
		if (this.hasThumbnail() && this.canShowThumbnail() != false) {

			// get thumbnail icon
			//
			return this.getThumbnail();
		} else if (this.constructor.use_svg_icons) {

			// get svg icon
			//
			return this.getSvgIcon();
		} else {

			// get image icon
			//
			return this.getImageIcon();	
		}
	},
	
	//
	// setting methods
	//

	setIcon: function(icon) {
		this.$el.find('.info .icon:not(.status)').html($(icon));
	},

	setEditable: function() {
		this.select();
		this.editName();
	},

	//
	// highlighting methods
	//

	highlight: function(options) {
		if (this.isHighlighted()) {
			return;
		}

		// call superclass method
		//
		Highlightable.highlight.call(this, options);

		// apply effect
		//
		if (!options || options.animated != false) {
			this.showEffect(application.settings.theme.get('icon_highlight_effect'));
		}
	},

	unhighlight: function(options) {
		if (!this.isHighlighted()) {
			return;
		}

		// call superclass method
		//
		Highlightable.unhighlight.call(this, options);

		// apply effect
		//
		if (!options || options.animated != false) {
			this.showEffect(application.settings.theme.get('icon_unhighlight_effect'));
		}
	},

	//
	// selecting methods
	//

	select: function(options) {
		if (this.isSelected()) {
			return;
		}

		// call superclass method
		//
		Selectable.select.call(this, options);

		// apply effect
		//
		if (!options || options.animated != false) {
			this.showEffect(application.settings.theme.get('icon_select_effect'));
		}
	},

	deselect: function(options) {
		if (!this.isSelected()) {
			return;
		}

		// call superclass method
		//
		Selectable.deselect.call(this, options);

		// update view
		//
		this.unhighlight();

		// stop editing
		//
		if (this.isEditing()) {
			this.deselectName();
		}

		// apply effect
		//
		if (!options || options.animated != false) {
			this.showEffect(application.settings.theme.get('icon_deselect_effect'));
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

		// show loading spinner after a delay
		//
		this.setTimeout(() => {

			// add loading spinner
			//
			this.$el.addClass('loading');
		}, delay);
	},

	stopLoading: function() {

		// remove loading spinner
		//
		this.$el.removeClass('loading');

		// clear loading timeout
		//
		this.clearTimeout();
	},

	//
	// positioning method
	//

	placeAt: function(position) {
		this.el.style.left = Math.round(position.left) + 'px';
		this.el.style.top = Math.round(position.top) + 'px';
	},
	
	//
	// rendering methods
	//

	onRender: function() {

		// set inital selection
		//
		if (this.options.selected) {
			if (this.options.selected == true || this.is(this.options.selected)) {
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
		this.addTooltips({
			container: this.parent.parent.el
		});
	},

	//
	// updating methods
	//

	update: function() {
		
		// update item details
		//
		this.$el.find('.icon').html(this.getIcon());
		this.$el.find('.name').html(this.getName());
		this.$el.find('.details').html(this.getDetails() || '');
	},

	//
	// event handling methods
	//

	onChange: function(event) {

		// update view
		//
		this.render();
		
		// peform callback
		//
		if (this.options.onchange) {
			this.options.onchange(event);
		}
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function(event) {

		// open item
		//
		if (!this.isLoading()) {

			// check if item is being renamed
			//
			if (!this.isEditing || !this.isEditing()) {
				this.open();
			}

			// block event from parent
			//
			this.block(event);
		}	
	},

	onClickOwner: function() {
		application.showUser(this.getOwner());
	},

	//
	// touch event handling methods
	//

	onDoubleTap: function(event) {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}
		
		this.onDoubleClick(event);
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.stopLoading();
	}
}), {

	//
	// static attributes
	//

	use_svg_icons: true
});