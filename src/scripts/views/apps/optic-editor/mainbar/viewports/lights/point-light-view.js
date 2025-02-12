/******************************************************************************\
|                                                                              |
|                               point-light-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a positional (point) light source.             |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LightView from '../../../../../../views/apps/optic-editor/mainbar/viewports/lights/light-view.js';
import PointLightAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/lights/point-light-annotation-view.js';

export default LightView.extend({

	//
	// attributes
	//

	className: 'point ' + LightView.prototype.className,
	title: 'Point Light',

	//
	// rendering attributes
	//

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<path d="M214.786,437.981h82.428C274.446,458.277,272.366,462,263.924,462h-16.636
			C238.651,462,236.423,457.983,214.786,437.981z M297.785,401.497h-83.57c-6.138,0-11.114,4.976-11.114,11.113
			c0,6.137,4.976,11.112,11.114,11.112h83.571c6.137,0,11.112-4.976,11.112-11.112C308.898,406.473,303.923,401.497,297.785,401.497z
			 M299.785,364.496h-87.57c-6.138,0-11.114,4.976-11.114,11.113c0,6.137,4.976,11.112,11.114,11.112h87.571
			c6.137,0,11.112-4.976,11.112-11.112C310.898,369.472,305.923,364.496,299.785,364.496z M382.51,171.709
			c0,75.243-66.71,117.411-66.71,176.788H196.2c0-59.377-66.709-101.545-66.709-176.788C129.49,93.207,192.698,50,255.93,50
			C319.208,50,382.51,93.266,382.51,171.709z M259.78,107.398l-4.536-24.588c-50.718,11.047-78.053,48.055-85.782,90.884l24.448,5.225
			C199.936,150.724,214.621,120.192,259.78,107.398z"/>
		</svg>
	`,

	//
	// getting methods
	//

	getAnnotation: function() {
		return new PointLightAnnotationView({
			model: this.model,

			// options
			//
			parent: this,
			viewport: this.options.viewport
		});
	},

	//
	// setting methods
	//

	setLocation(location) {
		this.model.set({
			location: location,
			direction: location
		});
	},

	//
	// editing methods
	//

	edit: function() {
		this.showEditPointLightDialogView();
	},

	//
	// dialog rendering methods
	//

	showEditPointLightDialogView: function() {
		import(
			'../../../../../../views/apps/optic-editor/dialogs/lights/edit-point-light-dialog-view.js'
		).then((EditPointLightDialogView) => {
			this.options.viewport.getParentView('app').show(new EditPointLightDialogView.default({
				model: this.model,

				// options
				//
				viewport: this.options.viewport
			}));
		});
	}
});