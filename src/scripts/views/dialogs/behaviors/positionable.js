/******************************************************************************\
|                                                                              |
|                               positionable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for positioning dialogs.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// querying methods
	//

	isFixed: function() {
		return this.$el.find('.modal-dialog').css('position') == 'absolute';
	},

	//
	// getting methods
	//

	getOffset: function() {
		return this.$el.find('.modal-dialog').offset();
	},

	//
	// setting methods
	//

	setPosition: function(position, offset) {

		// set dialog position
		//
		this.$el.find('.modal-dialog').css({
			position: position,
			left: offset.left,
			top: offset.top
		});
	},

	//
	// positioning methods
	//

	savePosition: function() {
		let element = this.$el.find('.modal-dialog');

		// save positioning
		//
		this.offset = element.offset();
		this.position = element.css('position');
		this.left = element.css('left');
		this.top = element.css('top');
	},

	fixPosition: function() {
		this.savePosition();
		this.setPosition('absolute', this.getOffset());
	},

	restorePosition: function() {

		// restore dialog position
		//
		if (this.left && this.top) {

			// restore flex centering on container
			//
			this.$el.css({
				display: 'flex'
			});

			// set position to saved position
			//
			this.setPosition(this.position, {
				left: this.left,
				top: this.top		
			});
		} else {

			// reset to centered
			//
			this.resetPosition();
		}
	},

	resetPosition: function() {

		// restore flex centering on container
		//
		this.$el.css({
			display: 'flex'
		});

		// reset dialog position
		//
		this.setPosition('relative', {
			left: '',
			top: '',	
		});

		// reset attributes
		//
		this.left = undefined;
		this.top = undefined;

		// reset centering
		//
		this.$el.find('.modal-dialog').css('margin', 'auto');
	}
};