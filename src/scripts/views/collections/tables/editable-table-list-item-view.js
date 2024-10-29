/******************************************************************************\
|                                                                              |
|                      editable-table-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an view for showing editable table list items.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListItemView from '../../../views/collections/tables/table-list-item-view.js';
import Selectable from '../../../views/behaviors/selection/selectable.js';
import TableItemEditable from '../../../views/collections/tables/behaviors/table-item-editable.js';

export default TableListItemView.extend(_.extend({}, Selectable, TableItemEditable, {

	//
	// attributes
	//

	events: _.extend({}, TableListItemView.prototype.events, Selectable.events, TableItemEditable.events),

	//
	// allow table rows to be dragged
	//

	blocking: false
}));