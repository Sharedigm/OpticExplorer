/******************************************************************************\
|                                                                              |
|                          svg-collection-renderable.js                        |
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

import SVGRenderable from '../../../views/svg/behaviors/svg-renderable.js';

export default _.extend({}, SVGRenderable, {

	//
	// attributes
	//

	tagName: 'g',

	//
	// collection rendering methods
	//

	buildChildView: function(child, ChildViewClass, childViewOptions) {
		return new ChildViewClass(childViewOptions);
	},

	toElement: function() {

		// call superclass method
		//
		let el = SVGRenderable.toElement.call(this);

		// append child views
		//
		if (this.children) {
			this.children.each(function(childView) {
				$(el).append(childView.render());

				// update
				//
				if (childView.onAttach) {
					childView.onAttach();
				}
			});
		}

		return el;
	},

	attachHtml(els) {
		this.$el.append(els);
	},

	clear: function() {

		// clear child views
		//
		this.children.each(function(childView) {
			if (childView) {
				if (!childView.options || !childView.options.permanant) {

					// destroy view
					//
					childView.destroy();
				}
			}
		});
	},

	//
	// collection updating methods
	//

	addChildModel: function(model) {
		let options = this.childViewOptions(model);
		let ChildViewClass;

		// get child view class
		//
		if (this.childView.prototype.render) {
			ChildViewClass = this.childView;
		} else {
			ChildViewClass = this.childView(model);
		}

		// create new child view
		//
		let childView = new ChildViewClass(options);

		// add element to group
		//
		let element = childView.render();

		// add element to dom
		//
		this.$el.append(element);
		if (childView.onAttach) {
			childView.onAttach();
		}

		// add view to collection view's children
		//
		this.addChildView(childView);
	},

	removeChildModel: function(model) {
		let childView = this.children.findByModel(model);

		// remove view from collection view's children
		//
		this.removeChildView(childView);
	},

	//
	// bulk collection updating methods
	//

	addChildModels: function(models) {
		for (let i = 0; i < models.length; i++) {
			this.addChildModel(models[i]);
		}
	},

	removeChildModels: function(models) {
		for (let i = 0; i < models.length; i++) {
			this.removeChildModel(models[i]);
		}
	},

	//
	// cleanup methods
	//

	destroyViews: function() {
		if (this.views) {
			for (let key in this.views) {
				this.views[key].destroy();
			}
			this.views = null;
		}
	},

	onBeforeDestroy: function() {
		this.destroyViews();
	}
});