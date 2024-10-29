/******************************************************************************\
|                                                                              |
|                          view-kind-buttons-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import IconsButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/view-kind/buttons/icons-button-view.js';
import ListsButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/view-kind/buttons/lists-button-view.js';
import CardsButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/view-kind/buttons/cards-button-view.js';
import TilesButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/view-kind/buttons/tiles-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="current" data-toggle="tooltip" title="View Kind"></div>
		<div class="tools">
			<%= tools %>
		</div>
	`),

	tools: _.template(`
		<div id="show-icons" data-toggle="tooltip" title="Icons"></div>
		<div id="show-lists" data-toggle="tooltip" title="Lists"></div>
		<div id="show-cards" data-toggle="tooltip" title="Cards"></div>
		<div id="show-tiles" data-toggle="tooltip" title="Tiles"></div>
	`),

	regions: {
		icons: '#show-icons',
		lists: '#show-lists',
		cards: '#show-cards',
		tiles: '#show-tiles'
	},

	tooltips: {
		placement: 'top'
	},

	//
	// setting methods
	//

	setViewKind: function(viewKind) {
		this.select(this.getChildView(viewKind));
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ButtonGroupView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('icons', new IconsButtonView({
			parent: this
		}));
		this.showChildView('lists', new ListsButtonView({
			parent: this
		}));
		this.showChildView('cards', new CardsButtonView({
			parent: this
		}));
		this.showChildView('tiles', new TilesButtonView({
			parent: this
		}));
	},

	onAttach: function() {

		// set view kind
		//
		this.setViewKind(this.getParentView('app').preferences.get('map_view_kind'));
	}
});