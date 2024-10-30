/******************************************************************************\
|                                                                              |
|                                   light-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directional (infinity) light source.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MarkerView from '../../../../../../views/svg/shapes/marker-view.js';
import SVGAnnotatable from '../../../../../../views/svg/behaviors/svg-annotatable.js';
import Beam from '../../../../../../models/optics/ray-tracing/beam.js';
import BeamView from '../../../../../../views/apps/optic-editor/mainbar/viewports/ray-tracing/beam-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import Bounds2 from '../../../../../../utilities/bounds/bounds2.js';
import SpectralLines from '../../../../../../utilities/optics/spectral-lines.js';
import '../../../../../../utilities/web/css-utils.js';

export default MarkerView.extend(_.extend({}, SVGAnnotatable, {

	//
	// attributes
	//

	className: 'light ' + MarkerView.prototype.className,
	beamName: 'light',
	unscaled: true,
	editable: true,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		MarkerView.prototype.initialize.call(this);

		// listen to model
		//
		this.listenTo(this.model, 'select', this.select);
		this.listenTo(this.model, 'deselect', this.deselect);
		this.listenTo(this.options.viewport, 'change:scale', () => {
			this.onChange('scale');
		});
	},

	//
	// querying methods
	//

	hasFocus: function() {
		return this.beamViews && this.beamViews[0].focus != null;
	},

	//
	// getting methods
	//

	getFocus: function() {
		return this.beamViews? this.beamViews[0].focus.get('location') : undefined;
	},

	getBounds: function() {
		let location = this.model.get('location');
		let width = this.width / this.options.viewport.pixelsPerMillimeter;
		let height = this.height / this.options.viewport.pixelsPerMillimeter;
		let xmin = location.x - width / 2;
		let xmax = xmin + width;
		let ymin = location.y - height / 2;
		let ymax = ymin + height;
		return new Bounds2(new Vector2(xmin, ymin), new Vector2(xmax, ymax));
	},

	getBeamView: function(options) {
		return new BeamView(options);
	},

	//
	// selecting methods
	//

	select: function() {
		if (this.isSelected()) {
			return;
		}

		// call mixin method
		//
		SVGAnnotatable.select.call(this);

		// select children
		//
		if (this.beamViews && this.beamViews.length > 0) {
			this.beamViews[this.beamViews.length - 1].select();
		}
	},

	deselect: function() {
		if (!this.isSelected()) {
			return;
		}

		// call mixin method
		//
		SVGAnnotatable.deselect.call(this);

		// select children
		//
		if (this.beamViews && this.beamViews.length > 0) {
			this.beamViews[this.beamViews.length - 1].deselect();
		}
	},

	//
	// adding methods
	//

	addListeners: function() {
		let viewport = this.options.viewport;
		if (viewport) {

			// get elements from viewport
			//
			let elementsView = viewport.elementsView;
			if (elementsView) {
				let elements = elementsView.collection;

				// listen to elements
				//
				this.listenTo(elements, 'add remove change reorder enable disable', () => {

					// update beam view
					//
					if (!this.beamViews) {
						this.addBeamViews();
					} else {
						this.updateBeamViews();
					}
				});
			}
		}
	},

	addBeamViews: function() {
		let beamViews = [];
		let viewport = this.options.viewport;

		if (viewport) {

			// get elements from viewport
			//
			let elementsView = viewport.elementsView;
			if (elementsView) {
				let optics = elementsView.model;
				let elements = elementsView.collection;
				let light = this.model;
				let numberOfRays = light.get('number_of_rays');

				// get spectral attributes
				//
				let spectrum = light.get('spectrum');
				let wavelengths = spectrum? spectrum.get('wavelengths') : undefined;
				let colors = spectrum? spectrum.getRgbaColors() : undefined;

				// check if wavelengths are defined
				//
				if (!wavelengths) {
					wavelengths = [SpectralLines.sodium.D];
				}

				// trace rays for each wavelength
				//
				light.beams = [];
				for (let i = 0; i < wavelengths.length; i++) {
					let wavelength = wavelengths[i];
					let color = light.has('color')? light.get('color') : (colors? colors[i] : undefined);

					// create beam
					//
					light.beams[i] = new Beam({
						paths: optics.traceRays(light.getRays(elements.getPoints(numberOfRays)), {
							wavelength: wavelength,
							viewport: viewport
						}),
						color: color
					});

					// create light beam view
					//
					beamViews[i] = this.getBeamView({
						model: light.beams[i],

						// options
						//
						className: (light.isMultispectral()? 'multispectral ' : '') + this.beamName + ' beam',
						viewport: viewport,
						optics: optics,
						selected: this.isSelected(),
						parent: this,

						// callbacks
						//
						ondoubleclick: (event) => {
							this.onDoubleClick(event);
						}
					});

					// render beam
					//
					viewport.show(beamViews[i]);
				}

				this.beamViews = beamViews;
			}
		}
	},

	//
	// removing methods
	//

	removeBeamViews: function() {

		// remove view
		//
		if (this.beamViews) {
			for (let i = 0; i < this.beamViews.length; i++) {
				this.beamViews[i].destroy();	
			}
			this.beamViews = null;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		MarkerView.prototype.onRender.call(this);

		// set color from spectrum
		//
		if (this.model.has('spectrum')) {
			this.setColor(this.model.get('spectrum').getColor());
		}

		// call mixin method
		//
		SVGAnnotatable.onRender.call(this);

		// add subviews
		//
		this.addBeamViews();

		// set initial state
		//
		if (this.options.selected) {
			this.select();
		}
		
		// add listening callbacks
		//
		this.addListeners();

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// updating methods
	//

	updateBeamViews: function() {
		let viewport = this.options.viewport;
		let elementsView = viewport.elementsView;
		let elements = elementsView.collection;
		let optics = elementsView.model;
		let light = this.model;
		let numberOfRays = light.get('number_of_rays');

		// get spectral attributes
		//
		let spectrum = light.get('spectrum');
		let wavelengths = spectrum? spectrum.get('wavelengths') : undefined;
		let colors = spectrum? spectrum.getRgbaColors() : undefined;

		// check if wavelengths are defined
		//
		if (!wavelengths) {
			wavelengths = [SpectralLines.sodium.D];
		}

		// check of beam has changed
		//
		if (wavelengths.length != light.beams.length) {
			this.removeBeamViews();
			this.addBeamViews();
		}

		// turn on / off beam
		//
		if (this.beamViews) {
			for (let i = 0; i < this.beamViews.length; i++) {
				if (this.model.get('off')) {
					this.beamViews[i].hide();
				} else {
					this.beamViews[i].show();
				}
			}
		}

		// trace rays for each wavelength
		//
		for (let i = 0; i < wavelengths.length; i++) {
			let wavelength = wavelengths[i];
			let color = light.has('color')? light.get('color') : (colors? colors[i] : undefined);
			let points = elements.getPoints(numberOfRays);
			let paths = optics.traceRays(light.getRays(points), {
				wavelength: wavelength,
				viewport: viewport
			});

			// trace rays
			//
			light.beams[i].set({
				paths: paths,
				color: color
			});
		}
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {

		// call superclass method
		//
		MarkerView.prototype.onChange.call(this);

		// on color change
		//
		if (this.model.hasChanged('spectrum')) {
			this.setColor(this.model.getColor());
		}

		// update
		//
		this.updateBeamViews();

		// perform callback
		//
		if (attribute != 'scale' && this.options.onchange) {
			this.options.onchange('light');
		}
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {

		// show edit dialog
		//
		if (this.editable) {
			this.edit();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// call mixin method
		//
		SVGAnnotatable.onBeforeDestroy.call(this);

		// destroy subviews
		//
		this.removeBeamViews();
	}
}));