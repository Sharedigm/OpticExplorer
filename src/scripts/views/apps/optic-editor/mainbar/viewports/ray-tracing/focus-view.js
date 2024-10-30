/******************************************************************************\
|                                                                              |
|                                  focus-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a view of a beam (array of paths).          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MarkerView from '../../../../../../views/svg/shapes/marker-view.js';
import Selectable from '../../../../../../views/behaviors/selection/selectable.js';
import SVGAnnotatable from '../../../../../../views/svg/behaviors/svg-annotatable.js';
import FocusAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/ray-tracing/focus-annotation-view.js';
import '../../../../../../utilities/web/css-utils.js';

export default MarkerView.extend(_.extend({}, Selectable, SVGAnnotatable, {

	//
	// attributes
	//

	className: 'focus ' + MarkerView.prototype.className,

	//
	// rendering attributes
	//

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<path d="M172.693,199.522l-40.508-67.336l67.464,40.584C189.064,179.905,179.909,188.997,172.693,199.522z
			 M314.155,174.019c9.228,6.516,17.312,14.54,23.898,23.715l41.761-65.547L314.155,174.019z M173.59,314.827l-41.404,64.988
			l64.88-41.336C187.997,331.946,180.055,323.948,173.59,314.827z M313.168,339.722l66.646,40.094l-40.168-66.771
			C332.564,323.505,323.569,332.561,313.168,339.722z M462,256.001l-141.77,31.426c-6.242,12.733-16.161,23.326-28.37,30.421L256,462
			l-35.861-144.153c-12.208-7.094-22.127-17.688-28.368-30.42L50,256.001l141.77-31.427c6.242-12.733,16.16-23.326,28.368-30.421
			L256,50l35.861,144.153c12.209,7.095,22.128,17.688,28.369,30.421L462,256.001z M288.01,256c0-17.678-14.331-32.01-32.01-32.01
			c-17.68,0-32.013,14.332-32.013,32.01c0,17.681,14.333,32.012,32.013,32.012C273.679,288.012,288.01,273.681,288.01,256z"/>
		</svg>
	`,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		MarkerView.prototype.initialize.call(this, options);

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// querying methods
	//

	title: function() {
		return 'Focus' + (this.options.index != undefined? (this.options.index + 1) : '');
	},

	//
	// getting methods
	//

	getAnnotation: function() {
		return new FocusAnnotationView({
			model: this.model,
			viewport: this.options.viewport,
			parent: this
		});
	},

	//
	// selecting methods
	//

	select: function() {

		// call mixin method
		//
		SVGAnnotatable.select.call(this);

		// update light
		//
		if (this.lightView) {
			this.lightView.select();
		}
	},

	deselect: function() {

		// call mixin method
		//
		SVGAnnotatable.deselect.call(this);

		// update light
		//
		if (this.lightView) {
			this.lightView.deselect();
		}
	},

	//
	// svg rendering methods
	//

	onRender: function() {

		// call mixin method
		//
		SVGAnnotatable.onRender.call(this);

		// get parent
		//
		this.lightView = this.getParentView('light');

		// add monochrome class
		//
		if (this.lightView.$el.hasClass('monochrome')) {
			this.$el.addClass('monochrome');
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	update: function() {

		// call superclass method
		//
		MarkerView.prototype.update.call(this);

		// add monochrome class
		//
		if (this.lightView.$el.hasClass('monochrome')) {
			this.$el.addClass('monochrome');
		} else {
			this.$el.removeClass('monochrome');
		}
	},

	//
	// hiding methods
	//

	hide: function() {
		this.$el.hide();
	},

	show: function() {
		this.$el.show();
	},

	//
	// event handling methods
	//

	onChange: function() {

		// call superclass method
		//
		MarkerView.prototype.onChange.call(this);

		// call mixin method
		//
		SVGAnnotatable.onChange.call(this);
	}
}));
