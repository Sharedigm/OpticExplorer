/******************************************************************************\
|                                                                              |
|                            distant-object-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a light emitting distant object.               |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Beam from '../../../../../../models/optics/ray-tracing/beam.js';
import ObjectView from '../../../../../../views/apps/optic-editor/mainbar/viewports/objects/object-view.js';
import DistantObjectAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/objects/distant-object-annotation-view.js';
import ObjectImageView from '../../../../../../views/apps/optic-editor/mainbar/viewports/objects/object-image-view.js';
import BeamView from '../../../../../../views/apps/optic-editor/mainbar/viewports/ray-tracing/beam-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import Bounds2 from '../../../../../../utilities/bounds/bounds2.js';

export default ObjectView.extend({

	//
	// attributes
	//

	className: 'distant object marker',
	unscaled: true,

	//
	// querying methods
	//

	hasIcon: function() {
		return true;
	},

	//
	// getting methods
	//

	getIcon: function() {
		return this.constructor.getIcon(this.model.get('kind'));
	},

	getHeight: function() {
		return this.height;
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

	getAnnotation: function() {
		return new DistantObjectAnnotationView({
			model: this.model,
			parent: this,
			viewport: this.options.viewport
		});
	},

	//
	// setting methods
	//

	setIconAttributes: function(icon) {
		icon.attr({
			id: 'object' + this.index,
		});
	},

	//
	// adding methods
	//

	addBeamView: function(direction) {
		let beamView;
		let viewport = this.options.viewport;

		if (viewport) {

			// get elements from viewport
			//
			let elementsView = viewport.elementsView;
			if (elementsView) {
				let optics = elementsView.model;
				let elements = elementsView.collection;

				// if there are optics and elements
				//
				if (optics && elements.length > 0) {
					let numberOfRays = 50;

					// create beam
					//
					let beam = new Beam({
						paths: optics.traceRays(this.model.getRays(direction, elements.getPoints(numberOfRays))),
						color: this.model.get('color')
					})

					// create light beam view
					//
					beamView = new BeamView({
						model: beam,
						className: 'object beam',

						// options
						//
						show_focus: false,
						viewport: viewport,
						optics: optics,
						selected: this.isSelected(),
						parent: this
					});

					// render beam
					//
					viewport.show(beamView);
				}
			}
		}

		return beamView;
	},

	addBeams: function() {
		let height = this.model.get('height').in('deg');
		let direction1 = this.model.get('location').rotatedBy(height / 2);
		let direction2 = this.model.get('location').rotatedBy(-height / 2);
		this.beamView1 = this.addBeamView(direction1);
		this.beamView2 = this.addBeamView(direction2);
	},

	addImage: function() {
		let viewport = this.options.viewport;

		if (this.beamView1 && this.beamView2 && 
			this.beamView1.hasFocus() && this.beamView2.hasFocus()) {
			if (!this.imageView) {
				this.imageView = new ObjectImageView({
					model: this.model,
					parent: this
				});

				// render image
				//
				viewport.show(this.imageView);
			}
		}
	},

	//
	// editing methods
	//

	edit: function() {
		this.showEditDistantObjectDialogView();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ObjectView.prototype.onRender.call(this);

		// set icon size
		//
		this.setIconAttributes(this.$el.find('.icon'));

		// set image scale
		//
		if (this.imageView) {
			let magnification = this.imageView.getMagnification() * this.options.viewport.pixelsPerMillimeter;
			this.imageView.setScale(this.options.viewport.scale * magnification);
		}
	},

	showBeams: function() {
		if (this.beamView1) {
			this.beamView1.show();
		}
		if (this.beamView2) {
			this.beamView2.show();
		}
	},

	hideBeams: function() {
		if (this.beamView1) {
			this.beamView1.hide();
		}
		if (this.beamView2) {
			this.beamView2.hide();
		}
	},

	showImage: function() {
		if (this.imageView) {
			this.imageView.show();
		}
	},

	hideImage: function() {
		if (this.imageView) {
			this.imageView.hide();
		}
	},

	//
	// updating methods
	//

	updateBeam: function(direction, beam) {
		let viewport = this.options.viewport;
		let elementsView = viewport.elementsView;
		let elements = elementsView.collection;
		let optics = elementsView.model;
		let numberOfRays = 50;

		// check if there are elements
		//
		if (elements.length > 0) {

			// trace rays
			//
			beam.set({
				paths: optics.traceRays(this.model.getRays(direction, elements.getPoints(numberOfRays)))
			});
		}
	},

	updateBeams: function() {
		let height = this.model.get('height').in('deg');
		let direction1 = this.model.get('location').rotatedBy(height / 2);
		let direction2 = this.model.get('location').rotatedBy(-height / 2);
		
		if (this.beamView1) {
			this.updateBeam(direction1, this.beamView1.model);
		}
		if (this.beamView2) {
			this.updateBeam(direction2, this.beamView2.model);
		}
	},

	updateImage: function() {
		if (this.beamView1 && this.beamView2) {
			if (this.beamView1.hasFocus() && this.beamView2.hasFocus()) {
				this.imageView.update();
			} else {
				this.removeImage();
			}
		}

		// set image scale
		//
		if (this.imageView) {
			let magnification = this.imageView.getMagnification() * this.options.viewport.pixelsPerMillimeter;
			this.imageView.setScale(this.options.viewport.scale * magnification);
		}
	},

	//
	// dialog rendering methods
	//

	showEditDistantObjectDialogView: function() {
		import(
			'../../../../../../views/apps/optic-editor/dialogs/objects/edit-distant-object-dialog-view.js'
		).then((EditDistantObjectDialogView) => {
			this.options.viewport.getParentView('app').show(new EditDistantObjectDialogView.default({
				model: this.model,

				// options
				//
				viewport: this.options.viewport
			}));
		});
	},

	//
	// event handling methos
	//

	onChangeScale: function() {

		// call superclass method
		//
		ObjectView.prototype.onChangeScale.call(this);

		// set image scale
		//
		if (this.imageView) {
			let magnification = this.imageView.getMagnification() * this.options.viewport.pixelsPerMillimeter;
			this.imageView.setScale(this.options.viewport.scale * magnification);
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
	}
}, {

	//
	// object icons
	//

	icons: {
		object: `
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 100 100">
				<path d="M 50 0 L 70 20 L 55 20 L 55 100 L 45 100 L 45 20 L 30 20 L 50 0 Z" />
			</svg>
		`,

		moon: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 472.064 472.064">
			<path d="M236.032,0C105.888,0,0.006,105.88,0.006,236.024c0,130.151,105.882,236.039,236.026,236.039
				s236.025-105.888,236.025-236.039C472.057,105.88,366.176,0,236.032,0z M46.854,236.024c0-101.664,80.681-184.632,181.354-188.781
				C160.713,82.86,114.527,153.43,114.527,235.048c0,83.304,48.084,155.116,117.845,189.985
				C129.761,423.051,46.854,339.107,46.854,236.024z"/>
			</svg>
		`,

		planet: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490.069 490.069">
				<g transform="translate(250,250) scale(0.75) translate(-250,-250)">
					<path d="M386.077,250.852c-1.171-36.599-15.705-72.849-43.642-100.785c-27.762-27.762-63.733-42.296-100.1-43.622
						C161.987,40.12,86.481,0,41.648,0C28.782,0,18.444,3.304,11.241,10.239c-30.588,29.451,4.236,115.896,79.855,212.837
						c-10.73,48.198,2.645,100.683,40.146,138.183c37.613,37.613,90.293,50.959,138.605,40.055
						c71.918,55.699,137.884,88.756,178.574,88.756c12.867,0,23.203-3.303,30.406-10.238
						C511.105,448.749,470.544,354.216,386.077,250.852z M378.027,382.012c-5.224,5.029-14.669,11.024-30.004,11.024
						c-10.477,0-22.563-2.777-36.123-8.238c-11.704-4.715-24.503-11.422-38.354-20.147c-28.026-17.655-57.805-42.017-86.117-70.45
						c-28.185-28.305-52.256-57.979-69.611-85.814c-4.964-7.961-9.243-15.564-12.877-22.818c-9.941-19.844-14.91-37.002-14.762-51.179
						c0.165-15.708,6.614-25.182,11.996-30.364c5.223-5.028,14.668-11.023,30.004-11.025h0.007h0.001c16.37,0,36.647,6.742,60.394,20.019
						c-8.341,2.58-16.5,5.905-24.373,9.98c-14.071-6.498-26.388-10-36.026-9.999c-6.823,0.001-12.313,1.754-16.134,5.433
						c-8.664,8.343-7.437,25.305,1.693,47.129c13.276,31.736,43.265,73.759,83.86,114.528c47.756,47.959,97.57,81.509,130.579,90.514
						c5.839,1.594,11.162,2.434,15.844,2.434c6.823,0,12.312-1.753,16.132-5.432c7.304-7.034,7.579-20.192,2.016-37.225
						c4.639-8.018,8.476-16.371,11.5-24.949c8.331,17.751,12.488,33.233,12.352,46.215C389.858,367.353,383.41,376.827,378.027,382.012z" />
				</g>
			</svg>
		`,

		stars: `
			<svg width="512" height="512" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
				<g transform="translate(2 0)"><path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937z" /></g>
				<g><path d="M3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162z" /></g>
			</svg>
		`,

		galaxy: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 501.761 501.761">
				<g transform="translate(250,250) scale(0.75) translate(-250,-250)">
					<path d="M477.729,22.02c-56.681-56.681-205.096-0.162-331.494,126.237
						C301.69,26.208,386.373,32.094,420.799,45.168c6.279,2.178,11.918,5.232,16.835,9.192c0.077,0.062,0.151,0.128,0.228,0.191
						c0.615,0.501,1.227,1.008,1.819,1.538c0.699,0.623,1.382,1.265,2.047,1.93c0,0,0.001,0.001,0.001,0.001v0h0
						c20.678,20.678,21.853,57.311,7.044,101.105c-1.819,5.378-3.892,10.87-6.187,16.448c-0.493,1.198-0.995,2.4-1.51,3.607
						c-20.626,48.373-58.534,103.284-109.584,154.334c-1.906,1.906-3.819,3.788-5.735,5.658c-0.585,0.571-1.172,1.134-1.758,1.701
						c-1.355,1.312-2.712,2.616-4.072,3.91c-0.66,0.628-1.32,1.253-1.982,1.877c-1.362,1.285-2.727,2.558-4.093,3.824
						c-0.588,0.545-1.175,1.093-1.763,1.634c-3.875,3.563-7.764,7.05-11.663,10.46c-0.582,0.509-1.164,1.01-1.746,1.515
						c-1.39,1.206-2.781,2.404-4.174,3.591c-0.661,0.563-1.321,1.123-1.982,1.681c-1.393,1.176-2.786,2.341-4.18,3.497
						c-0.583,0.484-1.167,0.971-1.75,1.452c-3.925,3.23-7.855,6.379-11.785,9.446c-0.568,0.443-1.135,0.878-1.702,1.318
						c-1.417,1.097-2.834,2.186-4.251,3.262c-0.648,0.492-1.295,0.981-1.943,1.469c-1.414,1.063-2.826,2.115-4.239,3.156
						c-0.57,0.421-1.141,0.845-1.711,1.262c-3.937,2.88-7.869,5.676-11.792,8.385c-0.539,0.372-1.078,0.737-1.617,1.106
						c-1.435,0.983-2.868,1.956-4.301,2.915c-0.628,0.421-1.256,0.839-1.884,1.256c-1.421,0.943-2.841,1.873-4.259,2.792
						c-0.547,0.355-1.095,0.714-1.641,1.065c-1.937,1.246-3.872,2.475-5.802,3.677c94.887-57.2,214.697-151.023,258.415-267.47
						C505.886,93.897,503.887,48.178,477.729,22.02z" />
					<path d="M42.234,366.992c0.031-0.148,0.062-0.296,0.094-0.443c0.232-1.092,0.474-2.19,0.73-3.295
						c0.06-0.258,0.122-0.517,0.183-0.775c0.244-1.034,0.494-2.07,0.758-3.114c0.083-0.326,0.171-0.655,0.255-0.983
						c0.26-1.004,0.522-2.01,0.8-3.023c0.089-0.323,0.185-0.65,0.276-0.974c0.656-2.342,1.35-4.703,2.104-7.093l0-0.004
						c0.005-0.016,0.01-0.032,0.015-0.048c0.051-0.161,0.105-0.323,0.156-0.483c0.356-1.171,0.744-2.354,1.162-3.549
						c17.77-52.968,59.005-116.492,117.465-174.951c39.73-39.73,81.799-71.501,121.305-93.363
						C35.723,211.774-36.148,423.606,19.997,479.751c47.452,47.452,159.198,15.527,268.495-70.28
						c-184.956,94.549-232.601,54.07-244.957,14.421C37.86,408.438,37.614,389.008,42.234,366.992z" />
					<path d="M237.11,410.68c1.418-0.92,2.837-1.849,4.259-2.792c0.628-0.417,1.256-0.835,1.884-1.256
						c1.432-0.96,2.866-1.932,4.301-2.915c0.539-0.369,1.078-0.734,1.617-1.106c3.923-2.709,7.855-5.505,11.792-8.385
						c0.57-0.417,1.14-0.841,1.711-1.262c1.413-1.042,2.826-2.093,4.239-3.156c0.648-0.487,1.295-0.977,1.943-1.469
						c1.417-1.076,2.834-2.164,4.251-3.262c0.568-0.439,1.135-0.875,1.702-1.318c3.93-3.067,7.86-6.216,11.785-9.446
						c0.584-0.48,1.167-0.968,1.75-1.452c1.394-1.156,2.788-2.321,4.18-3.497c0.661-0.558,1.321-1.119,1.982-1.681
						c1.392-1.186,2.783-2.384,4.174-3.591c0.582-0.505,1.164-1.006,1.746-1.515c3.899-3.409,7.788-6.896,11.663-10.46
						c0.589-0.541,1.176-1.09,1.763-1.634c1.366-1.266,2.73-2.539,4.093-3.824c0.661-0.623,1.322-1.249,1.982-1.877
						c1.36-1.293,2.717-2.598,4.072-3.91c0.586-0.567,1.173-1.131,1.758-1.701c1.916-1.869,3.829-3.752,5.735-5.658
						c51.05-51.05,88.958-105.961,109.584-154.334c0.515-1.207,1.017-2.409,1.51-3.607c2.294-5.578,4.368-11.07,6.187-16.448
						c14.809-43.793,13.635-80.427-7.044-101.105v0c0,0-0.001-0.001-0.001-0.001c-0.665-0.665-1.35-1.305-2.047-1.93
						c-0.592-0.53-1.203-1.036-1.819-1.538c-0.077-0.063-0.151-0.129-0.228-0.191c-4.917-3.96-10.556-7.014-16.835-9.192
						c-31.924-11.076-80.285,0.41-133.26,29.725c-39.506,21.862-81.575,53.633-121.305,93.363
						C107.775,226.715,66.54,290.24,48.769,343.208c-0.399,1.188-0.787,2.371-1.162,3.549c-0.051,0.161-0.105,0.323-0.156,0.483
						c-0.005,0.017-0.01,0.035-0.016,0.052c-0.755,2.389-1.448,4.75-2.104,7.093c-0.091,0.324-0.187,0.651-0.276,0.974
						c-0.279,1.013-0.541,2.019-0.8,3.023c-0.085,0.327-0.173,0.656-0.255,0.983c-0.265,1.044-0.514,2.081-0.758,3.114
						c-0.061,0.258-0.123,0.517-0.183,0.775c-0.256,1.105-0.498,2.203-0.73,3.295c-0.031,0.148-0.063,0.296-0.094,0.443
						c-4.621,22.017-4.374,41.446,1.301,56.9c2.808,7.646,6.931,14.328,12.462,19.859c31.385,31.385,99.526,17.84,173.67-28.329
						c1.93-1.202,3.865-2.432,5.802-3.677C236.016,411.394,236.563,411.035,237.11,410.68z M91.997,407.751
						c-32.38-32.38,11.602-128.86,98.237-215.495S373.349,61.64,405.729,94.019s-11.602,128.86-98.237,215.495
						C220.857,396.149,124.377,440.131,91.997,407.751z" />
					<path d="M405.729,94.019c-32.38-32.38-128.86,11.602-215.495,98.237S59.617,375.371,91.997,407.751
						c32.38,32.38,128.86-11.602,215.495-98.237C394.126,222.879,438.108,126.399,405.729,94.019z M138.296,361.452
						c-20.355-20.355,12.647-86.358,73.711-147.423s127.068-94.066,147.423-73.711c20.355,20.355-12.647,86.358-73.711,147.423
						C224.654,348.805,158.651,381.807,138.296,361.452z" />
					<path d="M359.43,140.318c-20.355-20.355-86.358,12.647-147.423,73.711s-94.066,127.068-73.711,147.423
						c20.355,20.355,86.358-12.647,147.423-73.711C346.783,226.676,379.785,160.673,359.43,140.318z M263.605,265.628
						c-32.568,32.568-65.569,52.369-73.711,44.227c-8.142-8.142-0.354-53.157,32.214-85.725c32.568-32.568,77.583-40.356,85.725-32.214
						C315.974,200.058,296.173,233.06,263.605,265.628z" />
				</g>
			</svg>
		`
	},

	//
	// static methods
	//

	getIcon: function(kind) {
		return this.icons[kind || 'object'];
	}
});