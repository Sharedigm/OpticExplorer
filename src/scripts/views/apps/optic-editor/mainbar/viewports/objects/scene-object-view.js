/******************************************************************************\
|                                                                              |
|                             scene-object-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a light emitting scene object.                 |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Beam from '../../../../../../models/optics/ray-tracing/beam.js';
import ObjectView from '../../../../../../views/apps/optic-editor/mainbar/viewports/objects/object-view.js';
import SceneObjectAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/objects/scene-object-annotation-view.js';
import ObjectImageView from '../../../../../../views/apps/optic-editor/mainbar/viewports/objects/object-image-view.js';
import BeamView from '../../../../../../views/apps/optic-editor/mainbar/viewports/ray-tracing/beam-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import Bounds2 from '../../../../../../utilities/bounds/bounds2.js';

export default ObjectView.extend({

	//
	// attributes
	//

	className: 'scene object marker',
	unscaled: false,

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
		return this.model.get('height').in('mm');
	},

	getBounds: function() {
		let location = this.model.get('location');
		let height = this.getHeight();
		let width = height;
		let xmin = location.x - width / 2;
		let xmax = xmin + width;
		let ymin = location.y - height / 2;
		let ymax = ymin + height;
		return new Bounds2(new Vector2(xmin, ymin), new Vector2(xmax, ymax));
	},

	getAnnotation: function() {
		return new SceneObjectAnnotationView({
			model: this.model,
			parent: this,
			viewport: this.options.viewport
		});
	},

	//
	// setting methods
	//

	setIconAttributes: function(icon) {
		let height = this.model.get('height').in('mm');
		icon.attr({
			id: 'object' + this.index,
			class: 'icon',
			width: height + 'mm',
			height: height + 'mm',
			x: -height / 2 + 'mm',
			y: -height / 2 + 'mm'
		});
	},

	setElementColor: function(element, color) {
		if (color) {
			element.addClass('colored');
			element.attr('fill', color);
			element.attr('stroke', color);
		} else {
			element.removeClass('colored');
			element.removeAttr('fill');
			element.removeAttr('stroke');
		}
	},

	//
	// adding methods
	//

	addBeamView: function(point) {
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
						paths: optics.traceRays(this.model.getRays(point, elements.getPoints(numberOfRays))),
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
		let height = this.model.get('height').in('mm');
		let point1 = this.model.get('location').plus(new Vector2(0, height / 2));
		let point2 = this.model.get('location').plus(new Vector2(0, -height / 2));
		this.beamView1 = this.addBeamView(point1);
		this.beamView2 = this.addBeamView(point2);
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
		this.showEditSceneObjectDialogView();
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

	updateBeam: function(point, beam) {
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
				paths: optics.traceRays(this.model.getRays(point, elements.getPoints(numberOfRays)))
			});
		}
	},

	updateBeams: function() {
		let height = this.model.get('height').in('mm');
		let point1 = this.model.get('location').plus(new Vector2(0, height / 2));
		let point2 = this.model.get('location').plus(new Vector2(0, -height / 2));
		
		if (this.beamView1) {
			this.updateBeam(point1, this.beamView1.model);
		}
		if (this.beamView2) {
			this.updateBeam(point2, this.beamView2.model);
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
	},

	//
	// dialog rendering methods
	//

	showEditSceneObjectDialogView: function() {
		import(
			'../../../../../../views/apps/optic-editor/dialogs/objects/edit-scene-object-dialog-view.js'
		).then((EditSceneObjectDialogView) => {
			this.options.viewport.getParentView('app').show(new EditSceneObjectDialogView.default({
				model: this.model,

				// options
				//
				viewport: this.options.viewport
			}));
		});
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update icon
		//
		if (this.model.changed.kind) {
			this.setIcon(this.getIcon(this.model.get('kind')));
		}
		if (this.model.changed.height) {
			this.setIconAttributes(this.$el.find('.icon'));
		}

		// call superclass method
		//
		ObjectView.prototype.onChange.call(this);
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

		flower: `
			<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 36 36">
				<path fill="#77B255" stroke="#77B255" d="M28.938 27.441c-2.554-.89-8.111-.429-9.938 1.331V17a1 1 0 1 0-2 0v11.772c-1.827-1.76-7.384-2.221-9.938-1.331c-.741.259 5.264 8.749 9.507 4.507c.168-.168.306-.33.431-.49V35a1 1 0 1 0 2 0v-3.542c.125.16.263.322.431.49c4.243 4.242 10.248-4.248 9.507-4.507z"></path>
				<path d="M12.562 25.65c-.619-.266-1.107-.837-1.378-1.513l-1.266-3.306l-3.258-1.393c-1.336-.574-1.876-1.922-1.304-3.259l1.362-3.181l-1.364-3.269c-.541-1.35.15-2.868 1.5-3.408l3.272-1.281l1.449-3.384C12.148.32 13.496-.22 14.833.352l3.258 1.396L21.358.382c.675-.271 1.411-.276 2.03-.011c.619.265 1.114.819 1.385 1.494l1.274 3.29l3.309 1.417c1.336.572 1.875 1.921 1.305 3.258l-1.451 3.384l1.365 3.267c.541 1.35-.15 2.866-1.5 3.407l-3.271 1.281l-1.363 3.183c-.572 1.336-1.922 1.877-3.258 1.305l-3.308-1.417l-3.267 1.364c-.676.271-1.427.311-2.046.046z"></path>
				<path d="M29.356 6.572l-3.309-1.417l-.055-.143c-1.565 1.337-5.215 4.354-5.215 4.354l.007.123A4.46 4.46 0 0 0 18 8.5V1.709L14.833.353c-1.337-.572-2.685-.032-3.258 1.304l-1.449 3.384l-.061.024l4.753 4.754A4.482 4.482 0 0 0 13.5 13H6.717l-1.361 3.178c-.572 1.337-.032 2.686 1.304 3.259l3.258 1.394l.002.006l4.496-5.142A4.48 4.48 0 0 0 18 17.5h.005c.006 1.979.015 5.273.012 6.801l3.164 1.356c1.336.572 2.686.031 3.258-1.305l1.362-3.18l-5.192-4.517a4.487 4.487 0 0 0 1.89-3.654c0-.071-.018-.137-.021-.208c1.802.182 4.951.472 6.822.642l-.092-.22L30.66 9.83c.571-1.337.031-2.686-1.304-3.258z"></path>
				<circle stroke="orange" fill="orange" fill-opacity="0.5" cx="18" cy="13" r="5"></circle>
			</svg>
		`,

		insect: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
				 viewBox="0 0 512 512">
				<g><path d="M448,246.857h-34.039l-43.538-26.121c-1.426-0.859-3.045-1.307-4.709-1.307h-55.963c0.722-2.953,1.106-6.016,1.106-9.143
					c0-3.611-0.558-7.113-1.518-10.487l39.881-7.982c2.377-0.466,4.471-1.874,5.815-3.886l36.571-54.857
					c0.997-1.499,1.536-3.273,1.536-5.074V57.627l16.75-25.125c2.807-4.206,1.673-9.883-2.533-12.681
					c-4.215-2.807-9.883-1.673-12.681,2.533l-18.286,27.429c-0.997,1.499-1.536,3.273-1.536,5.074v70.373l-32.942,49.408
					l-41.975,8.393c-2.295-2.56-4.891-4.91-7.762-7.022c16.576-9.253,27.822-26.953,27.822-47.25v-19.803
					c0-16.247-7.232-30.802-18.606-40.731C312.448,61.925,320,50.176,320,36.571C320,16.402,303.598,0,283.429,0
					c-5.056,0-9.143,4.096-9.143,9.143c0,5.047,4.087,9.143,9.143,9.143c10.085,0,18.286,8.201,18.286,18.286
					c0,10.085-8.201,18.286-18.286,18.286c-1.81,0-3.401,0.658-4.818,1.573c-4.087-0.997-8.32-1.573-12.699-1.573h-19.822
					c-4.379,0-8.613,0.576-12.699,1.573c-1.417-0.914-3.008-1.573-4.818-1.573c-10.085,0-18.286-8.201-18.286-18.286
					c0-10.085,8.201-18.286,18.286-18.286c5.056,0,9.143-4.096,9.143-9.143c0-5.047-4.087-9.143-9.143-9.143
					C208.402,0,192,16.402,192,36.571c0,13.605,7.552,25.353,18.606,31.653C199.232,78.153,192,92.709,192,108.955v19.803
					c0,20.297,11.246,37.998,27.822,47.25c-2.871,2.112-5.467,4.462-7.762,7.022l-41.975-8.393l-32.942-49.408V54.857
					c0-1.801-0.539-3.575-1.536-5.074l-18.286-27.429c-2.798-4.206-8.466-5.339-12.681-2.533c-4.206,2.798-5.339,8.475-2.533,12.681
					l16.75,25.125V128c0,1.801,0.539,3.575,1.536,5.074l36.571,54.857c1.344,2.011,3.438,3.419,5.815,3.886l39.881,7.982
					c-0.96,3.374-1.518,6.875-1.518,10.487c0,3.127,0.384,6.19,1.106,9.143h-55.963c-1.664,0-3.282,0.448-4.709,1.307l-43.538,26.121
					H64c-5.056,0-9.143,4.096-9.143,9.143s4.087,9.143,9.143,9.143h36.571c1.664,0,3.282-0.448,4.709-1.307l43.538-26.121h61.467
					c0.585,0,1.088-0.229,1.637-0.329c4.471,5.029,10.121,9.271,16.649,12.425v10.313l-96.338,61.303
					c-2.139,1.362-3.611,3.538-4.069,6.034l-26.917,143.506l-25.426,25.426c-3.575,3.575-3.575,9.353,0,12.928
					c1.783,1.783,4.123,2.679,6.464,2.679s4.681-0.896,6.464-2.679l27.429-27.429c1.307-1.307,2.176-2.971,2.514-4.782l26.706-142.382
					l83.173-52.928v25.298c-26.77,10.88-45.714,37.129-45.714,67.758v36.571c0,40.329,32.814,73.143,73.143,73.143
					s73.143-32.814,73.143-73.143v-36.571c0-30.629-18.944-56.878-45.714-67.758v-25.298l83.173,52.928l26.706,142.382
					c0.338,1.81,1.207,3.474,2.514,4.782l27.429,27.429c1.783,1.783,4.123,2.679,6.464,2.679s4.681-0.896,6.464-2.679
					c3.575-3.575,3.575-9.353,0-12.928l-25.426-25.426l-26.917-143.506c-0.457-2.496-1.929-4.672-4.069-6.034l-96.338-61.303V249.81
					c6.528-3.154,12.178-7.397,16.649-12.425c0.549,0.101,1.051,0.329,1.637,0.329h61.467l43.538,26.121
					c1.426,0.859,3.045,1.307,4.709,1.307H448c5.056,0,9.143-4.096,9.143-9.143S453.056,246.857,448,246.857z"/>
				</g>
			</svg>
		`,

		cells: `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
				<path d="M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM448 96H288V224H448V96zM448 288H288V416H448V288zM224 224V96H64V224H224zM64 416H224V288H64V416z"/>
			</svg>
		`,

		bacterium: `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
				<path d="M543 102.9c-3.711-12.51-16.92-19.61-29.53-15.92l-15.12 4.48c-11.05-20.65-27.98-37.14-48.5-47.43l3.783-14.46c3.309-12.64-4.299-25.55-16.99-28.83c-12.76-3.309-25.67 4.295-28.96 16.92l-3.76 14.37c-9.947-.3398-26.22 .1016-66.67 11.88l-4.301-12.03c-4.406-12.3-17.1-18.81-30.34-14.34c-12.35 4.371-18.8 17.88-14.41 30.2l4.303 12.04c-20.6 8.889-40.16 19.64-58.69 31.83L225.9 81.01C217.1 70.56 203.1 68.42 192.6 76.21C182.1 84.03 179.9 98.83 187.8 109.3l7.975 10.63C178.8 134.3 163.3 150.3 149.1 167.4L138 159.3C127.5 151.6 112.6 153.9 104.8 164.5c-7.748 10.54-5.428 25.33 5.164 33.03l11.09 8.066C109.2 224.1 98.79 243.7 90.18 264.3l-12.93-4.431c-12.45-4.248-25.92 2.293-30.18 14.65C42.78 286.9 49.38 300.3 61.78 304.6l13.05 4.474c-11.86 42.33-11.02 55.76-10.39 65.93l-15.45 4.566c-12.59 3.709-19.74 16.87-16 29.38c4.053 13.61 18.1 19.36 29.52 15.93l15.02-4.441c10.78 20.21 27.57 36.73 48.53 47.24l-3.852 14.75C119.7 491.1 124.8 512 145.2 512c10.56 0 20.19-7.049 22.98-17.7l3.816-14.63c10.2 .377 35.85 .873 65.01-18.17l11.45 11.74c5.037 5.164 20.59 13.04 33.58 .4922c9.416-9.096 9.633-24.06 .4941-33.43l-12.19-12.5c7.805-12.29 13.56-26.13 16.11-41.4c1.186-7.107 3.082-13.95 5.158-20.7c10.66 4.988 15.16 7.881 22.12 7.881c8.922 0 17.46-5.018 21.51-13.59c5.582-11.8 .4785-25.89-11.4-31.45l-11.73-5.486c20.09-29.62 45.89-44.76 46.44-45.11l5.23 11.81c5.273 11.86 19.19 17.36 31.33 12.1c11.1-5.279 17.44-19.22 12.15-31.18L401.9 258.5c5.438-1.512 10.86-3.078 16.52-4.021c16.8-2.797 31.88-9.459 45.02-18.54l13.33 12.02c9.289 8.395 24.37 8.439 33.54-1.648c8.814-9.68 8.072-24.62-1.654-33.38l-12.95-11.68c11.32-18.9 16.99-41.02 15.52-64.23l15.81-4.681C539.6 128.6 546.7 115.4 543 102.9zM192 368c-26.51 0-48.01-21.49-48.01-48s21.5-48 48.01-48S240.1 293.5 240.1 320S218.6 368 192 368zM272 232c-13.25 0-23.92-10.75-23.92-24c0-13.26 10.67-23.1 23.92-23.1c13.26 0 23.1 10.74 23.1 23.1C295.1 221.3 285.3 232 272 232z"/>
			</svg>
		`,

		pet: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				 viewBox="0 0 485.876 485.876">
			<path d="M391.793,444.209h-71.932l-2.862-117.89c-0.228-9.374,1.185-18.63,4.198-27.51l30.234-89.11
				c2.173-6.405,3.057-13.075,2.628-19.823l-4.439-69.826c0.074-0.058,0.152-0.119,0.225-0.177c7.394-5.846,11.529-14.95,11.063-24.355
				c-0.337-6.783-0.923-16.38-1.801-23.579c-0.079-0.644-0.24-1.274-0.481-1.876c-0.455-1.137-1.022-2.287-1.711-3.459l0.236-0.278
				c1.913-2.251,3.057-5.114,3.222-8.061c0.695-12.416,2.125-42.344,0.41-52.066c-0.401-2.272-1.826-4.234-3.863-5.318
				c-2.038-1.085-4.46-1.169-6.569-0.232c-2.927,1.301-8.006,4.331-18.322,15.571c-0.088,0.092-0.175,0.186-0.259,0.282
				c-5.862,6.404-11.674,13.539-16.095,19.172h-30.938c-4.42-5.633-10.232-12.767-16.093-19.17c-0.087-0.1-0.176-0.197-0.268-0.292
				c-10.312-11.235-15.39-14.264-18.315-15.564c-2.108-0.937-4.531-0.851-6.569,0.232c-2.038,1.083-3.462,3.045-3.863,5.317
				c-1.717,9.729-0.285,39.653,0.41,52.067c0.165,2.948,1.31,5.812,3.223,8.063l0.235,0.276c-0.688,1.172-1.256,2.321-1.711,3.458
				c-0.241,0.603-0.403,1.234-0.481,1.878c-0.878,7.2-1.463,16.796-1.8,23.579c-0.358,7.217,2.003,14.251,6.458,19.778l-18.695,34.27
				l-56.745,19.556c-39.332,13.555-68.792,47.302-76.886,88.071c-10.317,51.975-22.189,123.311-20.158,167.996
				c0.542,11.927,3.692,23.57,9.112,33.671c6.749,12.579,18.213,27.017,47.203,27.017h262c11.487,0,20.833-9.346,20.833-20.833
				S403.28,444.209,391.793,444.209z "/>
			</svg>
		`,

		portrait: `
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
				<path d="M20.822 19.307c-2.967-.681-6.578-2.437-5.514-4.723.684 1.126 2.801 1.777 4.45.804-4.747-1.204 2.334-9.471-3.871-14.105-1.135-.853-2.526-1.283-3.912-1.283-1.378 0-2.751.425-3.862 1.283-6.206 4.634.876 12.901-3.872 14.105 1.649.974 3.77.293 4.451-.804 1.064 2.286-2.551 4.043-5.514 4.723-2.978.682-3.178 2.466-3.178 4.004l.005.689h23.99l.005-.691c0-1.537-.2-3.32-3.178-4.002z"/>
			</svg>
		`,

		person: `
			<svg xmlns="http://www.w3.org/2000/svg" height="512px" width="512px" xmlns:ns="&amp;#38;ns_ai;" viewBox="0 0 124.189 132.243">
				<g transform="translate(62, 64) scale(1.15) translate(-62 -64)">
					<path stroke-width="1.25" d="m62.096 8.5859c-5.208 0-9.424 4.2191-9.424 9.4261 0.001 5.203 4.217 9.424 9.424 9.424 5.202 0 9.422-4.221 9.422-9.424 0-5.208-4.22-9.4261-9.422-9.4261zm-10.41 21.268c-6.672 0-12.131 5.407-12.131 12.07v29.23c0 2.275 1.791 4.123 4.07 4.123 2.28 0 4.127-1.846 4.127-4.123v-26.355h2.102s0.048 68.811 0.048 73.331c0 3.05 2.478 5.53 5.532 5.53 3.052 0 5.525-2.48 5.525-5.53v-42.581h2.27v42.581c0 3.05 2.473 5.53 5.531 5.53 3.054 0 5.549-2.48 5.549-5.53v-73.331h2.127v26.355c0 2.275 1.85 4.123 4.126 4.123 2.28 0 4.073-1.846 4.073-4.123v-29.23c0-6.663-5.463-12.07-12.129-12.07h-20.82z"/>
				</g>
			</svg>
		`,
	},

	//
	// static methods
	//

	getIcon: function(kind) {
		return this.icons[kind || 'object'];
	}
});