/******************************************************************************\
|                                                                              |
|                            settings-cards-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of settings cards.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardsView from '../../../../../../views/items/cards/cards-view.js';
import SettingsCardView from '../../../../../../views/apps/settings-browser/sidebar/items/cards/settings-card-view.js';

export default CardsView.extend({

	//
	// attributes
	//

	className: 'settings card-grid',

	template: template(`
		<svg class="defs">
			<defs></defs>
		</svg>
		<div class="cards"></div>
	`),

	childView: SettingsCardView,
	childViewContainer: '.cards',

	//
	// querying methods
	//

	contains: function(array, model) {
		let name = model.get('name');
		for (let i = 0; i < array.length; i++) {
			if (array[i].get('name') == name) {
				return true;
			}
		}
		return false;
	},

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,

			// state
			//
			selected: this.options.selected && this.contains(this.options.selected, model)
		});
	}
});