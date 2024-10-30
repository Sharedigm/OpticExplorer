/******************************************************************************\
|                                                                              |
|                              edit-tools-view.js                              |
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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import FlipButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/edit/buttons/flip-button-view.js';
import CutButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/edit/buttons/cut-button-view.js';
import CopyButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/edit/buttons/copy-button-view.js';
import PasteButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/edit/buttons/paste-button-view.js';
import DeleteButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/edit/buttons/delete-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="flip" data-toggle="tooltip" title="Flip"></div>
		<div id="cut" data-toggle="tooltip" title="Cut"></div>
		<div id="copy" data-toggle="tooltip" title="Copy"></div>
		<div id="paste" data-toggle="tooltip" title="Paste"></div>
		<div id="delete" data-toggle="tooltip" title="Delete"></div>
	`),

	regions: {
		flip: '#flip',
		cut: '#cut',
		copy: '#copy',
		paste: '#paste',
		delete: '#delete'
	},

	tooltips: {
		placement: 'top'
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
		this.showChildView('flip', new FlipButtonView({
			parent: this
		}));
		this.showChildView('cut', new CutButtonView({
			parent: this
		}));
		this.showChildView('copy', new CopyButtonView({
			parent: this
		}));
		this.showChildView('paste', new PasteButtonView({
			parent: this
		}));
		this.showChildView('delete', new DeleteButtonView({
			parent: this
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.app = this.getParentView('app');
		this.hasSelected = this.app.hasSelected();
		this.getChildView('cut').onActivate();
		this.getChildView('copy').onActivate();
		this.getChildView('paste').onActivate();
		this.getChildView('delete').onActivate();
	},

	onChangeSelection: function() {
		this.app = this.getParentView('app');
		this.hasSelected = this.app.hasSelected();
		this.getChildView('cut').onChangeSelection();
		this.getChildView('copy').onChangeSelection();
		this.getChildView('paste').onChangeSelection();
		this.getChildView('delete').onChangeSelection();
	}
});