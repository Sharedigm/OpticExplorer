/******************************************************************************\
|                                                                              |
|                               font-selector-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a font from a list of names.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import NameSelectorView from '../../../views/forms/selectors/name-selector-view.js';

export default NameSelectorView.extend({

	//
	// attributes
	//

	names: Object.keys(config.fonts),
	unselectable: true
});