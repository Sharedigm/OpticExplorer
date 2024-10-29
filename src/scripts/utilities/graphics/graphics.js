/******************************************************************************\
|                                                                              |
|                                 graphics.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a graphics container display element.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Vector2 from "../../utilities/math/vector2.js";
import Component from "../../utilities/graphics/component.js";

export default class Graphics extends Component {

	constructor(element, parent) {

		// call superclass constructor
		//
		super(element, parent);

		// set attributes
		//
		this.width = this.element.clientWidth;
		this.height = this.element.clientHeight;
		this.left = 0;
		this.top = 0;
		this.origin = new Vector2(this.width / 2, this.height / 2);

		// create resize event handler
		//
		let self = this;
		window.onresize = function() {
			self.onResize();
		}

		return this;
	}

	//
	// setting methods
	//

	setColor(color) {

		// set attributes
		//
		this.element.style.background = color;
	}

	//
	// loading methods
	//

	load(element) {
		if (!element) {
			return;
		}

		// load array elements
		//
		if (Array.isArray(element)) {
			for (let i = 0; i < element.length; i++) {
				if (element[i] && element[i].onLoad) {
					element[i].onLoad(this);
				}
			}

		// load non array elements
		//
		} else if (element.onLoad) {
			element.onLoad(this);
		}
	}

	unload(element) {

		// unload array elements
		//
		if (Array.isArray(element)) {
			for (let i = 0; i < element.length; i++) {
				if (element[i] && element[i].onLoad) {
					element[i].onUnload(this);
				}
			}

		// unload non array elements
		//
		} else if (element.onUnload) {
			element.onUnload(this);
		}
	}

	toScreenCoords(pixel) {
		let x = (pixel.x / this.width) * 2 - 1;
		let y = (pixel.y / this.height) * -2 + 1;
		return new Vector2(x, y);
	}

	//
	// printing methods
	//

	toString() {
		return "canvas";
	}

	//
	// private methods
	//

	onResize() {

		// reset attributes
		//
		this.width = this.element.clientWidth;
		this.height = this.element.clientHeight;
		this.origin = new Vector2(this.width / 2, this.height / 2);
	}
}