/******************************************************************************\
|                                                                              |
|                                 svg-renderable.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a mixin for displaying svg renderable views.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// attributes
	//

	precision: 5,

	//
	// converting methods
	//

	valueToString: function(value) {

		// division by 1 removes trailing zeros
		//
		return value.toPrecision(this.precision) / 1;
	},

	//
	// rendering methods
	//

	toElement: function() {

		// create element
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', this.tagName);

		// set class
		//
		if (this.className) {
			$(el).attr('class', this.className);
		}

		// set attributes
		//
		if (this.attributes) {
			let attributes = _.result(this, 'attributes');
			for (let name in attributes) {
				$(el).attr(name, attributes[name]);
			}
		}

		// add template elements
		//
		if (this.template) {
			let templateContext = this.templateContext? this.templateContext() : undefined;
			el.innerHTML = this.template(templateContext);
		}

		return el;	
	},

	clear: function() {
		this.$el.children().remove();
	},

	render: function() {
		let element = this.toElement();
		this.setElement(element);
		this._isRendered = true;

		// alert listeners of rendering
		//
		this.triggerMethod('render', this);

		return element;
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.$el.remove();
	}
};