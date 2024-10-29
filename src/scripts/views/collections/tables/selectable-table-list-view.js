/******************************************************************************\
|                                                                              |
|                         selectable-table-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view for displaying a generic list.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListView from '../../../views/collections/tables/table-list-view.js';
import TableSelectable from '../../../views/collections/tables/behaviors/table-selectable.js';

export default TableListView.extend(_.extend({}, TableSelectable));