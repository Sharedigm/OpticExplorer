/******************************************************************************\
|                                                                              |
|                             contacts-list-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of contacts.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListView from '../../../../../../views/items/lists/list-view.js';
import CheckableContainable from '../../../../../../views/behaviors/containers/checkable-containable.js';
import ContactsListItemView from '../../../../../../views/apps/contact-editor/mainbar/contacts/lists/contacts-list-item-view.js';

export default ListView.extend(_.extend({}, CheckableContainable, {

	//
	// attributes
	//

	editable: false,

	// views
	//
	childView: ContactsListItemView
}));
