/******************************************************************************\
|                                                                              |
|                             lights-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of lights.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PointLight from '../../../../../../models/optics/lights/point-light.js';
import DistantLight from '../../../../../../models/optics/lights/distant-light.js';
import LightRay from '../../../../../../models/optics/lights/light-ray.js';
import LightBeam from '../../../../../../models/optics/lights/light-beam.js';
import TableListView from '../../../../../../views/collections/tables/table-list-view.js';
import DistantLightListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/lights-list/distant-light-list-item-view.js';
import PointLightListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/lights-list/point-light-list-item-view.js';
import LightRayListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/lights-list/light-ray-list-item-view.js';
import LightBeamListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/lights-list/light-beam-list-item-view.js';
import BaseView from '../../../../../../views/base-view.js';

export default TableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="kind">
					<span>Kind</span>
				</th>

				<th class="distance">
					<span>Distance</span>
				</th>

				<th class="offset">
					<span>Offset</span>
				</th>

				<th class="angle">
					<span>Angle</span>
				</th>

				<th class="number-of-rays">
					<span># of Rays</span>
				</th>

				<th class="is-off th-sm hidden-xs">
					<span>Off</span>
				</th>

				<th class="color hidden-xs">
					<span>Color / Spectrum</span>
				</th>
			</tr>
		</thead>
		<tbody class="sortable">
		</tbody>
	`),

	emptyView: BaseView.extend({
		className: 'empty',
		template: template('No lights.')
	}),

	//
	// table attributes
	//

	show_numbering: true,

	//
	// rendering methods
	//

	childView: function(item) {
		if (item instanceof PointLight) {
			return PointLightListItemView;
		} else if (item instanceof DistantLight) {
			return DistantLightListItemView;
		} else if (item instanceof LightRay) {
			return LightRayListItemView;
		} else if (item instanceof LightBeam) {
			return LightBeamListItemView;
		}
	},

	childViewOptions: function(model) {
		return {
			model: model,

			// options
			//
			viewport: this.options.viewport,
			parent: this,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}
	}
});