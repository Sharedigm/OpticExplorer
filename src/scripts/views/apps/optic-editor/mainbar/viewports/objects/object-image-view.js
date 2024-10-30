/******************************************************************************\
|                                                                              |
|                             object-image-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a light emitting scene object.                 |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import SVGRenderable from '../../../../../../views/svg/behaviors/svg-renderable.js';
import SVGAnnotatable from '../../../../../../views/svg/behaviors/svg-annotatable.js';
import Selectable from '../../../../../../views/behaviors/selection/selectable.js';
import ObjectImageAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/objects/object-image-annotation-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import Bounds2 from '../../../../../../utilities/bounds/bounds2.js';

export default BaseView.extend(_.extend({}, SVGRenderable, SVGAnnotatable, Selectable, {

	//
	// attributes
	//

	tagName: 'use',
	className: 'object image',
	layer: 'underlay',
	unscaled: false,

	//
	// attribute methods
	//

	attributes: function() {
		let location = this.getLocation();
		let magnification = this.getMagnification();
		let viewport = this.options.parent.options.viewport;
		let center = location.scaledBy(viewport.pixelsPerMillimeter);
		let brightness = this.getBrightness();

		if (location && magnification) {
			return {
				x: location.x + 'mm',
				y: location.y + 'mm',
				transform: 'translate(' + (center.x) + ', ' + (center.y) + ') ' +
					'scale(' + (-magnification) + ') ' +
					'translate(' + (-center.x) + ', ' + (-center.y) + ')',
				'opacity': brightness? brightness.toPrecision(2) : 0
			};
		}
	},

	//
	// getting methods
	//

	getAnnotation: function() {
		return new ObjectImageAnnotationView({
			model: this.model,
			parent: this,
			viewport: this.options.viewport
		});
	},

	getBrightness: function() {
		let beamView1 = this.options.parent.beamView1;
		let beamView2 = this.options.parent.beamView2;

		if (beamView1 && beamView2) {
			let transmission1 = beamView1.getTransmission();
			let transmission2 = beamView2.getTransmission();
			let transmission = Math.min(transmission1, transmission2);
			let magnification = this.getMagnification();
			let brightness = transmission / magnification;
			return Math.clamp(brightness, 0, 1);
		}
	},

	getBounds: function() {
		let location = this.getLocation();
		let magnification = this.getMagnification();
		let height = this.options.parent.getHeight() * magnification;
		let width = height;
		let xmin = location.x - width / 2;
		let xmax = xmin + width;
		let ymin = location.y - height / 2;
		let ymax = ymin + height;
		return new Bounds2(new Vector2(xmin, ymin), new Vector2(xmax, ymax));
	},

	//
	// setting methods
	//

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

	setColor: function(color) {
		this.setElementColor(this.$el, color);
	},

	setScale: function(scale) {
		let location = this.getLocation();
		let viewport = this.options.parent.options.viewport;
		let center = location.scaledBy(viewport.pixelsPerMillimeter);

		this.$el.attr('transform', 
			'translate(' + (center.x) + ', ' + (center.y) + ') ' +
			'scale(' + scale + ') ' +
			'translate(' + (-center.x) + ', ' + (-center.y) + ')',
		);
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
	},

	deselect: function() {
		if (!this.isSelected()) {
			return;
		}

		// call mixin method
		//
		SVGAnnotatable.deselect.call(this);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set attributes
		//
		this.$el.attr({
			href: '#object' + this.options.parent.index
		});
		if (this.model.has('color')) {
			this.setColor(this.model.get('color'));
		}

		// set initial state
		//
		if (this.options.parent.isSelected()) {
			this.select();
		}
	},

	update: function() {
		let beamView1 = this.options.parent.beamView1;
		let beamView2 = this.options.parent.beamView2;

		// update image
		//
		if (beamView1.hasFocus() && beamView2.hasFocus()) {
			this.$el.attr(this.attributes());

			// call mixin method
			//
			// SVGAnnotatable.updateAnnotations.call(this);
		}
	},

	//
	// getting methods
	//

	getMagnification: function() {
		let beamView1 = this.options.parent.beamView1;
		let beamView2 = this.options.parent.beamView2;

		// update image
		//
		if (beamView1.hasFocus() && beamView2.hasFocus()) {
			let point1 = beamView1.getFocus();
			let point2 = beamView2.getFocus();
			let height = this.options.parent.getHeight();
			let distance = point1.distanceTo(point2);
			return distance / height;
			// return distance * height;	
		}
	},

	getLocation: function() {
		let beamView1 = this.options.parent.beamView1;
		let beamView2 = this.options.parent.beamView2;

		// update image
		//
		if (beamView1.hasFocus() && beamView2.hasFocus()) {
			let point1 = beamView1.getFocus();
			let point2 = beamView2.getFocus();
			return point1.plus(point2).scaledBy(0.5);
		}
	}
}));