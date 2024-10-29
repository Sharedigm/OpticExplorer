/******************************************************************************\
|                                                                              |
|                             gesture-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying gestures.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'form-horizontal wide', 

	template: template(`
		<p style="text-align:center">What type of gesture would you like to send?</p>
		<br />
		
		<div class="gesture-kind form-group">
			<label class="control-label"><i class="fa fa-hand-pointer"></i>Gesture</label>
			<div class="controls">
				<select>
					<option class="poke">Poke</option>
					<option class="wink">Wink</option>
					<option class="wave">Wave</option>
					<option class="peace">Peace</option>
					<option class="live-long-and-prosper">Live Long and Prosper</option>
					<option class="hug">Hug</option>
					<option class="kiss">Kiss</option>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Gesture" data-content="This is the kind of gesture to send."></i>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'gesture_kind':
				return this.$el.find('.gesture-kind select').val();
		}
	},

	getValues: function() {
		return {
			gesture_kind: this.getValue('gesture_kind')
		};
	}
});
