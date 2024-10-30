/******************************************************************************\
|                                                                              |
|                           optics-viewport-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing and manipulating optics.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Optics from '../../../../../models/optics/optics.js';
import Light from '../../../../../models/optics/lights/light.js';
import PointLight from '../../../../../models/optics/lights/point-light.js';
import DistantLight from '../../../../../models/optics/lights/distant-light.js';
import LightRay from '../../../../../models/optics/lights/light-ray.js';
import LightBeam from '../../../../../models/optics/lights/light-beam.js';
import SceneObject from '../../../../../models/optics/objects/scene-object.js';
import DistantObject from '../../../../../models/optics/objects/distant-object.js';
import ColorScheme from '../../../../../models/optics/materials/color-scheme.js';
import BaseObject from '../../../../../models/optics/objects/base-object.js';
import AnnotatedViewportView from '../../../../../views/svg/annotation/annotated-viewport-view.js';
import DynamicShadowing from '../../../../../views/svg/viewports/behaviors/rendering/dynamic-shadowing.js';
import DynamicShading from '../../../../../views/svg/viewports/behaviors/rendering/dynamic-shading.js';
import DynamicAnnotating from '../../../../../views/svg/viewports/behaviors/rendering/dynamic-annotating.js';
import ElementsView from '../../../../../views/apps/optic-editor/mainbar/viewports/elements/elements-view.js';
import LensView from '../../../../../views/apps/optic-editor/mainbar/viewports/elements/lens-view.js';
import SensorView from '../../../../../views/apps/optic-editor/mainbar/viewports/elements/sensor-view.js';
import LightView from '../../../../../views/apps/optic-editor/mainbar/viewports/lights/light-view.js';
import PointLightView from '../../../../../views/apps/optic-editor/mainbar/viewports/lights/point-light-view.js';
import DistantLightView from '../../../../../views/apps/optic-editor/mainbar/viewports/lights/distant-light-view.js';
import LightRayView from '../../../../../views/apps/optic-editor/mainbar/viewports/lights/light-ray-view.js';
import LightBeamView from '../../../../../views/apps/optic-editor/mainbar/viewports/lights/light-beam-view.js';
import ObjectView from '../../../../../views/apps/optic-editor/mainbar/viewports/objects/object-view.js';
import SceneObjectView from '../../../../../views/apps/optic-editor/mainbar/viewports/objects/scene-object-view.js';
import DistantObjectView from '../../../../../views/apps/optic-editor/mainbar/viewports/objects/distant-object-view.js';
import MouseMoveBehavior from '../../../../../views/behaviors/mouse/mouse-move-behavior.js';
import Bounds2 from '../../../../../utilities/bounds/bounds2.js';

export default AnnotatedViewportView.extend(_.extend({}, DynamicShadowing, DynamicShading, DynamicAnnotating, {

	//
	// attributes
	//

	events: {
		'mousedown': 'onMouseDown'
	},

	//
	// viewport attributes
	//

	layers: ['background', 'underlay', 'lights', 'optics', 'overlay', 'annotations'],

	// use filters and gradients from parent
	//
	filters: null,
	gradients: null,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AnnotatedViewportView.prototype.initialize.call(this);

		// make sure that we have a model
		//
		if (!this.model) {
			this.model = new Optics();
		}

		// set viewport attributes
		//
		if (this.options.show_grid != undefined) {
			this.show_grid = this.options.show_grid;
		}
		if (this.options.show_optical_axis != undefined) {
			this.show_optical_axis = this.options.show_optical_axis;
		}
		if (this.options.show_perpendicular_axis != undefined) {
			this.show_perpendicular_axis = this.options.show_perpendicular_axis;
		}
		if (this.options.show_colored_viewport != undefined) {
			this.show_colored_viewport = this.options.show_colored_viewport;
		}

		// set element attributes
		//
		if (this.options.show_elements != undefined) {
			this.show_elements = this.options.show_elements;
		}
		if (this.options.show_filled_elements != undefined) {
			this.show_filled_elements = this.options.show_filled_elements;
		}
		if (this.options.show_stroked_elements != undefined) {
			this.show_stroked_elements = this.options.show_stroked_elements;
		}
		if (this.options.show_shaded_elements != undefined) {
			this.show_shaded_elements = this.options.show_shaded_elements;
		}
		if (this.options.show_illustrated_elements != undefined) {
			this.show_illustrated_elements = this.options.show_illustrated_elements;
		}
		if (this.options.show_shadowed_elements != undefined) {
			this.show_shadowed_elements = this.options.show_shadowed_elements;
		}

		// set light attributes
		//
		if (this.options.show_lights != undefined) {
			this.show_lights = this.options.show_lights;
		}
		if (this.options.show_filled_lights != undefined) {
			this.show_filled_lights = this.options.show_filled_lights;
		}
		if (this.options.show_stroked_lights != undefined) {
			this.show_stroked_lights = this.options.show_stroked_lights;
		}
		if (this.options.show_transmitted_lights != undefined) {
			this.show_transmitted_lights = this.options.show_transmitted_lights;
		}
		if (this.options.show_obstructed_lights != undefined) {
			this.show_obstructed_lights = this.options.show_obstructed_lights;
		}
		if (this.options.show_reflected_lights != undefined) {
			this.show_reflected_lights = this.options.show_reflected_lights;
		}

		// set object attributes
		//
		if (this.options.show_objects != undefined) {
			this.show_objects = this.options.show_objects;
		}
		if (this.options.show_filled_objects != undefined) {
			this.show_filled_objects = this.options.show_filled_objects;
		}
		if (this.options.show_stroked_objects != undefined) {
			this.show_stroked_objects = this.options.show_stroked_objects;
		}
		if (this.options.show_transmitted_objects != undefined) {
			this.show_transmitted_objects = this.options.show_transmitted_objects;
		}
		if (this.options.show_obstructed_objects != undefined) {
			this.show_obstructed_objects = this.options.show_obstructed_objects;
		}
		if (this.options.show_reflected_objects != undefined) {
			this.show_reflected_objects = this.options.show_reflected_objects;
		}

		// set annotation attributes
		//
		if (this.options.show_annotations != undefined) {
			this.show_annotations = this.options.show_annotations;
		}

		// set object annotation attributes
		//
		if (this.options.show_thickness != undefined) {
			this.show_thickness = this.options.show_thickness;
		}
		if (this.options.show_spacing != undefined) {
			this.show_spacing = this.options.show_spacing;
		}
		if (this.options.show_focal_points != undefined) {
			this.show_focal_points = this.options.show_focal_points;
		}
		if (this.options.show_principal_planes != undefined) {
			this.show_principal_planes = this.options.show_principal_planes;
		}
	},

	//
	// querying methods
	//

	hasSelected: function() {
		return this.$el.find('.selected').length != 0;
	},

	hasSelectedElements: function() {
		return this.$el.find('.element.selected').length != 0;
	},

	hasSelectedSurfaces: function() {
		return this.$el.find('.surface.selected').length != 0;
	},

	hasSelectedLights: function() {
		return this.$el.find('.light.selected').length != 0;
	},

	//
	// counting methods
	//

	numSelected: function() {
		return this.$el.find('.selected').length;
	},

	numElements: function(filter) {
		return this.$el.find('.element' + (filter || '')).length;
	},

	numSelectedElements: function() {
		return this.$el.find('.element.selected').length;
	},

	numSelectedSurfaces: function() {
		return this.$el.find('.surface.selected').length;
	},

	numLights: function() {
		return this.$el.find('.light').length;
	},

	numLightsSelected: function() {
		return this.$el.find('.light.selected').length;
	},

	//
	// getting methods
	//

	getChildView: function(model) {
		return this.children.findByModel(model);
	},

	getChildViews: function() {
		return this.children.toArray();
	},

	getChildViewByModel: function(model) {
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			if (child.model == model) {
				return child;
			}
		}
		return null;
	},

	getSelected: function() {
		let views = this.getSelectedElementViews();
		views = views.concat(this.getSelectedLightViews());
		views = views.concat(this.getSelectedObjectViews());
		return views;
	},

	/*
	getSelected: function() {
		return this.children.filter(function(item) {
			return item.isSelected && item.isSelected();
		});
	},
	*/

	getSelectedModels: function() {
		let models = this.getSelectedElements();
		models = models.concat(this.getSelectedLights());
		models = models.concat(this.getSelectedObjects());
		return models;
	},

	//
	// element getting methods
	//

	getElements: function() {
		return this.elementsView.collection.models;
	},

	getSelectedElements: function() {
		return this.elementsView.getSelectedModels();
	},

	getElementView: function(model) {
		return this.elementsView.children.findByModel(model);
	},

	getSelectedElementIndex: function() {
		for (let i = 0; i < this.elementsView.length; i++) {
			let child = this.elementsView.children.findByIndex(i);
			if (child.isSelected()) {
				return i;
			}
		}
	},

	getElementViews: function() {
		return this.elementsView.children.toArray();
	},

	getSelectedElementView: function(which) {
		return this.elementsView.getSelectedElementView(which);
	},

	getSelectedElementViews: function() {
		return this.elementsView.children.filter((item) => {
			return item.isSelected();
		});
	},

	//
	// lens getting methods
	//

	getLensViews: function() {
		return this.elementsView.children.filter(function(item) {
			return (item instanceof LensView);
		});
	},

	//
	// surface getting methods
	//

	getSelectedSurfaceView: function(which) {
		return this.elementsView.getSelectedSurfaceView(which);
	},

	//
	// light getting methods
	//

	getLightViewClass: function(model) {
		if (model instanceof PointLight) {
			return PointLightView;
		} else if (model instanceof DistantLight) {
			return DistantLightView;
		} else if (model instanceof LightRay) {
			return LightRayView;
		} else if (model instanceof LightBeam) {
			return LightBeamView;
		}
	},

	getLights: function() {
		let lights = [];
		this.children.each((child) => {
			if (child.model instanceof Light) {
				lights.push(child.model);
			}
		});
		return lights;
	},

	getSelectedLights: function() {
		let lights = [];
		this.children.each(function(child) {
			if (child instanceof LightView && child.isSelected()) {
				lights.push(child.model);
			}
		});
		return lights;
	},

	getLightViews: function() {
		return this.children.filter(function(item) {
			return (item instanceof LightView);
		});
	},

	getSelectedLightViews: function() {
		return this.children.filter(function(item) {
			return (item instanceof LightView) && item.isSelected();
		});
	},

	//
	// object getting methods
	//

	getObjectViewClass: function(model) {
		if (model instanceof SceneObject) {
			return SceneObjectView;
		} else if (model instanceof DistantObject) {
			return DistantObjectView;
		}
	},

	getObjects: function() {
		let objects = [];
		this.children.each((child) => {
			if (child.model instanceof BaseObject) {
				objects.push(child.model);
			}
		});
		return objects;
	},

	getSelectedObjects: function() {
		let objects = [];
		this.children.each(function(child) {
			if (child instanceof ObjectView && child.isSelected()) {
				objects.push(child.model);
			}
		});
		return objects;
	},

	//
	// view getting methods
	//

	getObjectViews: function() {
		return this.children.filter(function(item) {
			return (item instanceof ObjectView);
		});
	},

	getSelectedObjectViews: function() {
		return this.children.filter(function(item) {
			return (item instanceof ObjectView) && item.isSelected();
		});
	},

	getImageViews: function() {
		let imageViews = [];
		let objectViews = this.getObjectViews();
		for (let i = 0; i < objectViews.length; i++) {
			let objectView = objectViews[i];
			if (objectView.imageView) {
				imageViews.push(objectView.imageView);
			}
		}
		return imageViews;
	},

	getFocusViews: function() {
		let focusViews = [];
		let lightViews = this.getLightViews();
		for (let i = 0; i < lightViews.length; i++) {
			let lightView = lightViews[i];
			if (lightView.beamViews && lightView.beamViews.length > 0) {
				focusViews.push(lightView.beamViews[0]);
			}
		}
		return focusViews;
	},

	getSensorViews: function() {
		return this.elementsView.children.filter(function(item) {
			return (item instanceof SensorView);
		});
	},

	//
	// bounds getting methods
	//

	getOpticsBounds: function() {
		return this.model.getBounds();
	},

	getViewBounds: function(views) {
		let bounds = new Bounds2();

		// extend to objects
		//
		for (let i = 0; i < views.length; i++) {
			let view = views[i];
			if (view.getBounds) {
				bounds.extendToBounds(view.getBounds());
			} else if (view.getFocusPosition) {
				bounds.extendToPosition(view.getFocusPosition());
			}
		}

		if (bounds.left != undefined && bounds.top != undefined) {
			return bounds;
		}
	},

	getLensBounds: function() {
		return this.getViewBounds(this.getLensViews());
	},

	getObjectBounds: function() {
		return this.getViewBounds(this.getObjectViews());
	},

	getLightBounds: function() {
		return this.getViewBounds(this.getLightViews());
	},

	getFocusBounds: function() {
		return this.getViewBounds(this.getFocusViews());
	},

	getSensorBounds: function() {
		return this.getViewBounds(this.getSensorViews());
	},

	getImageBounds: function() {
		return this.getViewBounds(this.getImageViews());
	},

	getItemsBounds: function(kind) {
		let bounds = new Bounds2();

		if (kind.includes('optics') || kind.includes('all')) {
			bounds.extendToBounds(this.getLensBounds());
		}
		if (kind.includes('objects') || kind.includes('all')) {
			bounds.extendToBounds(this.getObjectBounds());
		}
		if (kind.includes('images') || kind.includes('all')) {
			bounds.extendToBounds(this.getImageBounds());
		}
		if (kind.includes('lights') || kind.includes('all')) {
			bounds.extendToBounds(this.getLightBounds());
		}
		if (kind.includes('focii') || kind.includes('all')) {
			bounds.extendToBounds(this.getFocusBounds());
		}

		if (bounds.left != undefined && bounds.top != undefined) {
			return bounds;
		}
	},

	//
	// offset getting methods
	//

	getOpticsOffset: function() {
		return this.elementsView.getViewportOffset();
	},

	getItemsOffset: function(kind) {
		let bounds = this.getItemsBounds(kind);
		if (bounds) {
			return bounds.center().reversed().scaledBy(this.pixelsPerMillimeter);
		}
	},

	//
	// scale getting methods
	//

	getItemsScale: function(kind) {
		let bounds = this.getItemsBounds(kind);
		if (bounds) {
			let widthScale = this.getWidthScale(bounds.width() * 1.25);
			let heightScale = this.getHeightScale(bounds.height() * 1.25);
			return Math.min(widthScale, heightScale);
		}
	},

	getOpticsScale: function() {
		let widthScale = this.getWidthScale(this.model.getLength() * 1.25);
		let heightScale = this.getHeightScale(this.model.getDiameter() * 1.25);
		return Math.min(widthScale, heightScale);
	},

	snapTo: function(amount, factor) {
		if (amount > 1) {
			let base = 2;
			let zoom = Math.log(amount) / Math.log(base);
			return Math.floor(Math.pow(base, zoom) * factor) / factor;
		} else {
			return 1 / this.snapTo(1 / amount, factor);
		}
	},

	getWidthScale: function(width) {

		// check params
		//
		if (!width) {
			return 1;
		}

		// snap scale to factor of base
		//
		return this.snapTo(this.width / width / this.pixelsPerMillimeter, 4);
	},

	getHeightScale: function(height) {

		// check params
		//
		if (!height) {
			return 1;
		}

		// snap scale to factor of base
		//
		return this.snapTo(this.height / height / this.pixelsPerMillimeter, 4);
	},

	getRelativeScale: function() {
		return this.scale / this.getOpticsScale();	
	},

	getZoom: function() {
		return this.scale * 100;
	},

	//
	// setting methods
	//

	setZoom: function(zoom) {
		this.setScale(zoom / 100);
	},

	setScheme: function(value) {
		ColorScheme.setCurrent(value);
		this.elementsView.updateColors();
	},

	setTheme: function(theme) {
		switch (theme) {
			case 'light':
				this.$el.removeClass('dark');
				this.$el.addClass('light');
				this.$el.removeClass('auto');
				break;
			case 'medium':
				this.$el.removeClass('dark');
				this.$el.removeClass('light');
				this.$el.removeClass('auto');
				break;
			case 'dark':
				this.$el.addClass('dark');
				this.$el.removeClass('light');
				this.$el.removeClass('auto');
				break;
			case 'auto':
				this.$el.removeClass('dark');
				this.$el.removeClass('light');
				this.$el.addClass('auto');
				break;
		}
	},

	//
	// option setting methods
	//

	setOption: function(key, value) {
		switch (key) {

			// color options
			//
			case 'scheme':
				this.setScheme(value);
				break;
			case 'theme':
				this.setTheme(value);
				break;

			// viewport options
			//
			case 'show_grid':
				this.setShowGrid(value);
				break;
			case 'show_optical_axis':
				this.setShowOpticalAxis(value);
				break;
			case 'show_perpendicular_axis':
				this.setShowPerpendicularAxis(value);
				break;
			case 'show_colored_viewport':
				this.setShowColoredViewport(value);
				break;

			// element options
			//
			case 'show_elements':
				this.setShowElements(value);
				break;
			case 'show_filled_elements':
				this.setShowFilledElements(value);
				break;
			case 'show_stroked_elements':
				this.setShowStrokedElements(value);
				break;
			case 'show_shaded_elements':
				this.setShowShadedElements(value);
				break;
			case 'show_illustrated_elements':
				this.setShowIllustratedElements(value);
				break;
			case 'show_shadowed_elements':
				this.setShowShadowedElements(value);
				break;

			// ray tracing options
			//
			case 'max_ray_depth':
				this.setMaxRayDepth(value);
				break;

			// light options
			//
			case 'show_lights':
				this.setShowLights(value);
				break;
			case 'show_filled_lights':
				this.setShowFilledLights(value);
				break;
			case 'show_stroked_lights':
				this.setShowStrokedLights(value);
				break;
			case 'show_transmitted_lights':
				this.setShowTransmittedLights(value);
				break;
			case 'show_obstructed_lights':
				this.setShowObstructedLights(value);
				break;
			case 'show_reflected_lights':
				this.setShowReflectedLights(value);
				break;

			// object options
			//
			case 'show_objects':
				this.setShowObjects(value);
				break;
			case 'show_filled_objects':
				this.setShowFilledObjects(value);
				break;
			case 'show_stroked_objects':
				this.setShowStrokedObjects(value);
				break;
			case 'show_transmitted_objects':
				this.setShowTransmittedObjects(value);
				break;
			case 'show_obstructed_objects':
				this.setShowObstructedObjects(value);
				break;
			case 'show_reflected_objects':
				this.setShowReflectedObjects(value);
				break;

			// annotation optinos
			//
			case 'show_annotations': 
				this.setShowAnnotations(value);
				break;
			case 'arrow_style':
				this.setArrowStyle(value);
				break;
			case 'label_style':
				this.setLabelStyle(value);
				break;

			// optic annotation options
			//
			case 'show_thickness': 
				this.setShowThickness(value);
				break;
			case 'show_spacing': 
				this.setShowSpacing(value);
				break;
			case 'show_focal_points': 
				this.setShowFocalPoints(value);
				break;
			case 'show_principal_planes': 
				this.setShowPrincipalPlanes(value);
				break;

			// other options
			//
			default:

				// call superclass method
				//
				AnnotatedViewportView.prototype.setOption.call(this, key, value);
				break;
		}
	},

	setOptions: function() {
		this.setViewportOptions();
		this.setElementOptions();
		this.setLightOptions();
		this.setObjectOptions();
		this.setOpticAnnotationOptions();
	},

	//
	// viewport option setting methods
	//

	setViewportOptions: function() {
		this.setShowGrid(this.show_grid);
		this.setShowOpticalAxis(this.show_optical_axis);
		this.setShowPerpendicularAxis(this.show_perpendicular_axis);
		this.setShowColoredViewport(this.show_colored_viewport);
	},

	setShowOpticalAxis: function(showOpticalAxis) {
		this.setShowXAxis(showOpticalAxis);
	},

	setShowPerpendicularAxis: function(showPerpendicularAxis) {
		this.setShowYAxis(showPerpendicularAxis);
	},

	setShowColoredViewport: function(showColoredViewport) {
		this.setClass('colored', showColoredViewport);
	},

	//
	// optics option setting methods
	//

	setElementOptions: function() {
		this.setShowElements(this.show_elements);
		this.setShowFilledElements(this.show_filled_elements);
		this.setShowStrokedElements(this.show_stroked_elements);
		this.setShowShadedElements(this.show_shaded_elements);
		this.setShowIllustratedElements(this.show_illustrated_elements);
		this.setShowShadowedElements(this.show_shadowed_elements);
	},

	setLightOptions: function() {
		this.setShowLights(this.show_lights);
		this.setShowFilledLights(this.show_filled_lights);
		this.setShowStrokedLights(this.show_stroked_lights);
		this.setShowTransmittedLights(this.show_transmitted_lights);
		this.setShowObstructedLights(this.show_obstructed_lights);
		this.setShowReflectedLights(this.show_reflected_lights);
	},

	setObjectOptions: function() {
		this.setShowObjects(this.show_objects);
		this.setShowFilledObjects(this.show_filled_objects);
		this.setShowStrokedObjects(this.show_stroked_objects);
		this.setShowTransmittedObjects(this.show_transmitted_objects);
		this.setShowObstructedObjects(this.show_obstructed_objects);
		this.setShowReflectedObjects(this.show_reflected_objects);
	},

	setOpticAnnotationOptions: function() {
		this.setShowThickness(this.show_thickness);
		this.setShowSpacing(this.show_spacing);
		this.setShowFocalPoints(this.show_focal_points);
		this.setShowPrincipalPlanes(this.show_principal_planes);
	},

	//
	// element rendering methods
	//

	setShowElements: function(visible) {
		this.setClass('elements-hidden', !visible);
	},

	setShowFilledElements: function(visible) {
		this.setClass('elements-unfilled', !visible);	
	},

	setShowStrokedElements: function(visible) {
		this.setClass('elements-unstroked', !visible);	
	},

	setShowShadedElements: function(visible) {
		this.setClass('elements-unshaded', !visible);	
	},

	setShowIllustratedElements: function(visible) {
		this.setClass('elements-unillustrated', !visible);	
	},

	setShowShadowedElements: function(visible) {
		this.setClass('elements-unshadowed', !visible);	
	},

	//
	// light rendering methods
	//

	setShowLights: function(visible) {
		this.setClass('lights-hidden', !visible);
	},

	setShowFilledLights: function(visible) {
		this.setClass('lights-unfilled', !visible);	
	},

	setShowStrokedLights: function(visible) {
		this.setClass('lights-unstroked', !visible);	
	},

	setShowTransmittedLights: function(visible) {
		this.setClass('lights-untransmitted', !visible);	
	},

	setShowObstructedLights: function(visible) {
		this.setClass('lights-unobstructed', !visible);	
	},

	setShowReflectedLights: function(visible) {
		this.setClass('lights-unreflected', !visible);	
	},

	//
	// object beam rendering methods
	//

	setShowObjects: function(visible) {
		this.setClass('objects-hidden', !visible);
	},

	setShowFilledObjects: function(visible) {
		this.setClass('objects-unfilled', !visible);	
	},

	setShowStrokedObjects: function(visible) {
		this.setClass('objects-unstroked', !visible);	
	},

	setShowTransmittedObjects: function(visible) {
		this.setClass('objects-untransmitted', !visible);	
	},

	setShowObstructedObjects: function(visible) {
		this.setClass('objects-unobstructed', !visible);	
	},

	setShowReflectedObjects: function(visible) {
		this.setClass('objects-unreflected', !visible);	
	},

	//
	// optic annotation methods
	//

	setShowThickness: function(visible) {
		this.setClass('hide-thickness', !visible);	
	},

	setShowSpacing: function(visible) {
		this.setClass('hide-spacing', !visible);	
	},

	setShowFocalPoints: function(visible) {
		this.setClass('hide-focal-points', !visible);	
	},

	setShowPrincipalPlanes: function(visible) {
		this.setClass('hide-principal-planes', !visible);	
	},

	//
	// selecting methods
	//

	deselectAll: function() {
		if (this.elementsView) {
			this.elementsView.deselectAll();
		}
		this.children.each((child) => {
			if (child.deselect) {
				child.deselect();
			}
		});
	},

	//
	// deleting methods
	//

	deleteModel: function(model) {
		if (model.collection) {
			model.collection.remove(model);
		}
		let view = this.children.findByModel(model);
		while (view) {
			this.removeChildView(view);
			view = this.getChildViewByModel(model);
		}
		model.destroy();
		this.removeTooltips();
	},

	deleteModels: function(models) {
		for (let i = 0; i < models.length; i++) {
			this.deleteModel(models[i]);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			filters: this.filters,
			markers: this.markers,
			gradients: this.gradients
		};
	},

	onAttach: function() {

		// call superclass method
		//
		AnnotatedViewportView.prototype.onAttach.call(this);

		// set initial theme
		//
		if (this.options.theme) {
			this.setTheme(this.options.theme);
		}

		// show initial view
		//
		this.showOptics(this.model);

		// add mouse tracker
		//
		this.addMouseBehavior();

		// set initial state
		//
		this.setOptions();
	},

	showOptics: function(optics) {

		// set attributes;
		//
		this.model = optics;

		// clear previous optics
		//
		this.clearOptics();

		// create new elements view
		//
		this.elementsView = new ElementsView({
			model: optics,
			collection: optics? optics.elements : null,
			viewport: this,
			editable: this.options.editable,
			move_duration: this.options.move_duration,
			parent: this,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchangeselection: this.options.onchangeselection,
			onreorder: this.options.onreorder
		});

		// show elements in viewport
		//
		this.show(this.elementsView);
		this.addObjects(optics.objects);

		// center and scale elements
		//
		this.centerOptics('objects, optics, images');
		this.scaleOptics('objects, optics, images');

		// add and ray trace lights - needs to be after scale
		// to extend light beams according to viewport
		//
		this.addLights(optics.lights, {
			silent: true
		});
	},

	addMouseBehavior: function() {

		// show cursor location
		//
		this.mouseBehavior = new MouseMoveBehavior(this.$el, {
			on: true,

			// callbacks
			//
			onmousemove: (event) => {
				if (event.pageX == undefined) {
					return;
				}

				let offset = this.$el.offset();
				let h = event.pageX - offset.left;
				let v = event.pageY - offset.top;
				this.location = this.toPoint(h, v);

				// perform callback
				//
				this.options.onmousemove(event);
			}
		});
	},

	clearOptics: function() {
		if (this.elementsView) {
			this.elementsView.destroy();
		}
	},

	//
	// light adding methods
	//

	addLights: function(lights, options) {
		for (let i = 0; i < lights.length; i++) {
			this.addLight(lights.at(i), options);
		}
	},

	addLight: function(model, options) {
		let LightViewClass = this.getLightViewClass(model);

		// add to lights
		//
		this.model.lights.add(model);

		// create new light view
		//
		let view = new LightViewClass({
			model: model,

			// options
			//
			selected: false,
			draggable: true,
			editable: true,
			viewport: this,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		});

		// show new light view
		//
		this.show(view);

		// perform callback
		//
		if (!options || !options.silent) {

			// perform callback
			//
			if (this.options.onchange) {
				this.options.onchange();
			}
		}

		return view;
	},

	//
	// object adding methods
	//

	addObjects: function(objects) {
		for (let i = 0; i < objects.length; i++) {
			this.addObject(objects.at(i));
		}
	},

	addObject: function(model, options) {
		let ObjectViewClass = this.getObjectViewClass(model);

		// add to lights
		//
		this.model.objects.add(model);

		// create new object view
		//
		let view = new ObjectViewClass({
			model: model,

			// options
			//
			selected: false,
			draggable: true,
			editable: true,
			viewport: this,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item)
		});

		// show new object view
		//
		this.show(view);

		// perform callback
		//
		if (!options || !options.silent) {

			// perform callback
			//
			if (this.options.onchange) {
				this.options.onchange();
			}
		}

		return view;
	},

	//
	// updating methods
	//

	update: function() {

		// call superclass method
		//
		AnnotatedViewportView.prototype.update.call(this);

		// update optics rendering
		//
		this.updateShading();
		this.updateShadows();
		this.updateAnnotations();
	},

	//
	// centering methods
	//

	centerOptics: function(kind, options) {
		let offset = this.getItemsOffset(kind);
		if (offset) {
			this.panTo(offset, options);
		}
	},

	scaleOptics: function(kind, options) {
		let scale = this.getItemsScale(kind);
		if (scale) {
			this.scaleTo(scale, options);
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function(element) {

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(element);
		}
	},

	onDeselect: function(element) {

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect(element);
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// if not shift clicking
		//
		if (!event.shiftKey) {

			// if clicking on the background, then deselect viewport elements
			//
			if (event.originalEvent.target == this.el) {
				this.deselectAll();
			}
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {

		// call superclass method
		//
		AnnotatedViewportView.prototype.onResize.call(this);

		// resize annotations
		//
		if (this.gridView) {
			this.gridView.onResize();
		}
		if (this.xAxisView) {
			this.xAxisView.onResize();
		}
		if (this.yAxisView) {
			this.yAxisView.onResize();
		}
	}
}));
