/******************************************************************************\
|                                                                              |
|                           annotated-viewport-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of an svg viewport that may be annotated.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MultiLayerViewportView from '../../../views/svg/viewports/multilayer-viewport-view.js';
import Browser from '../../../utilities/web/browser.js';

export default MultiLayerViewportView.extend({

	//
	// attributes
	//

	className: 'annotated viewport',

	markers: `
		<!-- arrow markers -->

		<marker id="arrow-start" markerWidth="5" markerHeight="5" refX="0" refY="0" orient="auto" viewBox="0 -3.33 10 6.66">
			<path d="M 10,3.33 L 0,0 L 10,-3.33" />
		</marker>

		<marker id="arrow-end" markerWidth="5" markerHeight="5" refX="0" refY="0" orient="auto" viewBox="-10 -3.33 10 6.66">
			<path d="M -10,3.33 L 0,0 L -10,-3.33" />
		</marker>

		<!-- measuring markers -->

		<marker id="measure-start" markerWidth="5" markerHeight="5" refX="0" refY="0" orient="auto" viewBox="0 -3.33 10 6.66">
			<path d="M 10,3.33 L 0,0 L 10,-3.33" />
			<path d="M 0,-3.33 L 0,3.33" />
		</marker>

		<marker id="measure-end" markerWidth="5" markerHeight="5" refX="0" refY="0" orient="auto" viewBox="-10 -3.33 10 6.66">
			<path d="M -10,3.33 L 0,0 L -10,-3.33" />
			<path d="M 0,-3.33 L 0,3.33" />
		</marker>
	`,

	filters: `
		<!-- background filters -->

		<filter x="-.05" y="0.15" width="1.1" height="0.75" id="white-background">
			<feFlood flood-color="white"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0.15" width="1.1" height="0.75" id="black-background">
			<feFlood flood-color="black"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0.15" width="1.1" height="0.75" id="dark-background">
			<feFlood flood-color="#333b55"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0.15" width="1.1" height="0.75" id="dark-colored-background">
			<feFlood flood-color="#273060"/>
			<feComposite in="SourceGraphic"/>
		</filter>
	`,

	// annotation attributes
	//
	arrow_style: 'filled',
	label_style: 'diagonal',

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		MultiLayerViewportView.prototype.initialize.call(this, options);

		// set attributes
		//
		if (this.options.arrow_style) {
			this.arrow_style = this.options.arrow_style;
		}
		if (this.options.label_style) {
			this.label_style = this.options.label_style;
		}
	},

	//
	// setting methods
	//

	setOption: function(kind, value, options) {
		switch (kind) {

			// annotation options
			//
			case 'show_annotations':
				this.setShowAnnotations(value);
				break;
			case 'arrow_style':
				this.setArrowStyle(value, options);
				break;
			case 'label_style':
				this.setArrowStyle(value, options);
				break;

			// viewport options
			//
			default:
				MultiLayerViewportView.prototype.setOption.call(this, kind, value, options);
		}
	},

	setScale: function(scale, options) {

		// call superclass method
		//
		MultiLayerViewportView.prototype.setScale.call(this, scale, options);

		// update markers
		//
		this.updateMarkersScale();
	},

	setShowAnnotations: function(visible) {
		this.setClass('hide-annotations', !visible);
	},

	setArrowStyle: function(arrowStyle, options) {

		// set attributes
		//
		this.arrow_style = arrowStyle;

		// update view
		//
		switch (arrowStyle) {
			case 'filled':
				this.$el.find('marker#arrow-start').addClass('filled');
				this.$el.find('marker#arrow-end').addClass('filled');
				this.$el.find('marker#arrow-start').removeClass('stroked');
				this.$el.find('marker#arrow-end').removeClass('stroked');
				break;
			case 'stroked':
				this.$el.find('marker#arrow-start').addClass('stroked');
				this.$el.find('marker#arrow-end').addClass('stroked');
				this.$el.find('marker#arrow-start').removeClass('filled');
				this.$el.find('marker#arrow-end').removeClass('filled');
				break;
		}

		// update
		//
		if (!options || !options.silent) {

			// trigger change
			//
			this.trigger('change:arrows');
		}
	},

	setLabelStyle: function(labelStyle, options) {

		// set attributes
		//
		this.label_style = labelStyle;

		// update
		//
		if (!options || !options.silent) {

			// trigger change
			//
			this.trigger('change:labels');
		}
	},

	setActive: function(active) {

		// call superclass method
		//
		MultiLayerViewportView.prototype.setActive.call(this, active);

		// update markers
		//
		if (active) {
			this.updateMarkersScale();
		}
	},

	//
	// marker methods
	//

	rescaleMarker: function(element, scale) {
		let markerWidth, markerHeight;
			
		// get original marker size
		//
		if (!element.hasAttribute('originalMarkerWidth')) {
			markerWidth = element.getAttribute('markerWidth');
			markerHeight = element.getAttribute('markerHeight');

			// save original marker size
			//
			element.setAttributeNS(null, 'originalMarkerWidth', markerWidth);	
			element.setAttributeNS(null, 'originalMarkerHeight', markerHeight);
		} else {
			markerWidth = element.getAttribute('originalMarkerWidth');
			markerHeight = element.getAttribute('originalMarkerWidth');
		}

		// set marker size to scaled marker size
		//
		element.setAttributeNS(null, 'markerWidth', markerWidth / scale);	
		element.setAttributeNS(null, 'markerHeight', markerHeight / scale);
	},

	setMarkerScale: function(element, scale) {
		if (element.hasAttribute('width')) {
			this.rescaleElement(element, scale);
		} else if (element.hasAttribute('markerWidth')) {
			this.rescaleMarker(element, scale);
		}
	},

	setMarkersScale: function(scale) {
		let elements = $('defs marker');
		for (let i = 0; i < elements.length; i++) {
			this.setMarkerScale(elements[i], scale);	
		}		
	},

	updateMarkersScale: function() {
		if (Browser.is_safari) {
			this.setMarkersScale(this.scale);
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		MultiLayerViewportView.prototype.onRender.call(this);
		
		// set annotation styles
		//
		this.setArrowStyle(this.arrow_style);
		this.setLabelStyle(this.label_style);
	}
});