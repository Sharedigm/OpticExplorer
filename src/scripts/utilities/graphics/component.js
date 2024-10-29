/******************************************************************************\
|                                                                              |
|                                component.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract generalized graphics component.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

//
// "class" constructor
//

export default class Component {

	constructor(element) {
		if (!element) {
			return this;
		}

		// the element parameter can refer to a document
		// element object or it can refer to its id
		//
		this.element = element;

		// set attributes
		//
		this.visible = (this.element != undefined) && (this.element.style.display != "none");
		this.width = this.getWidth();
		this.height = this.getHeight();

		return this;
	}

	//
	// methods
	//

	getTop() {
		let top = this;
		while (top.parent) {
			top = top.parent;
		}
		return top;
	}

	getWidth() {
		if (this.element) {
			if (this.element.offsetWidth != 0) {
				return this.element.offsetWidth;
			} else if (this.element.width) {
				return this.element.width;
			} else {
				return this.element.getAttribute("width");
			}
		} else {
			return 0;
		}
	}

	getHeight() {
		if (this.element) {
			if (this.element.offsetHeight != 0) {
				return this.element.offsetHeight;
			} else if (this.element.height) {
				return this.element.height;
			} else {
				return this.element.getAttribute("height");
			}
		} else {
			return 0;
		}
	}

	//
	// component attribute setting methods
	//

	setElement(element) {
		if (this.element.parentNode) {
			this.element.parentNode.replaceChild(element, this.element);
		}
		this.element = element;
	}

	//
	// component visibility methods
	//

	setVisible(visible) {

		// set attributes
		//
		this.visible = visible;

		// modify page element
		//
		if (this.element) {
			if (visible) {
				this.element.style.display = 'block';
			} else {
				this.element.style.display = 'none';
			}
		}
	}

	isVisible() {
		return this.visible && (!this.parent || !this.parent.isVisible || this.parent.isVisible());
	}

	toggleVisible() {
		this.setVisible(!this.isVisible());
	}
}