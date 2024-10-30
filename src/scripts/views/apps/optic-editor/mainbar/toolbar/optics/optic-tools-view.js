/******************************************************************************\
|                                                                              |
|                              optic-tools-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import AddElementButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/optics/buttons/add-element-button-view.js';
import AddStopButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/optics/buttons/add-stop-button-view.js';
import AddSensorButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/optics/buttons/add-sensor-button-view.js';
import AddCameraButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/optics/buttons/add-camera-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="add-element" data-toggle="tooltip" title="Add Element"></div>
		<div id="add-stop" data-toggle="tooltip" title="Add Stop"></div>
		<div id="add-sensor" data-toggle="tooltip" title="Add Sensor"></div>
		<div id="add-camera" data-toggle="tooltip" title="Add Camera"></div>
	`),

	regions: {
		add_element: '#add-element',
		add_stop: '#add-stop',
		add_sensor: '#add-sensor',
		add_camera: '#add-camera'
	},

	tooltips: {
		placement: 'top'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ButtonGroupView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('add_element', new AddElementButtonView({
			parent: this
		}));
		this.showChildView('add_stop', new AddStopButtonView({
			parent: this
		}));
		this.showChildView('add_sensor', new AddSensorButtonView({
			parent: this
		}));
		this.showChildView('add_camera', new AddCameraButtonView({
			parent: this
		}));
	},

	update: function() {
		this.app = this.getParentView('app');
		this.getChildView('add_sensor').update();
		this.getChildView('add_camera').update();
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.update();
	},

	onLoad: function() {
		this.update();
	},

	onChange: function() {
		this.update();
	}
});