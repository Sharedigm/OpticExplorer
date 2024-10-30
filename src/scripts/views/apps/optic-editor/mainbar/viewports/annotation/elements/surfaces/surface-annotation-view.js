/******************************************************************************\
|                                                                              |
|                            surface-annotation-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying annotations of optical elements.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AnnotationView from '../../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/annotation-view.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'surface annotation',

	//
	// getting methods
	//

	getXOffset: function() {
		let offset = this.options.parent.options.parent.options.offset? this.options.parent.options.parent.options.offset.x : 0;
		if (this.model.getSide() == 'back' && this.model.parent.thickness) {
			offset += this.model.parent.thickness;
		}
		return offset;
	},

	//
	// event handling methods
	//

	onSnap: function() {

		// play tap sound
		//
		application.play('tap');
	}
});