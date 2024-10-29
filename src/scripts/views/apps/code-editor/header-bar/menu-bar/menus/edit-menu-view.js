/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying edit dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//
	

	template: template(`
		<li role="presentation">
			<a class="undo"><i class="fa fa-undo"></i>Undo<span class="command shortcut">Z</span></a>
		</li>
		
		<li role="presentation">
			<a class="redo"><i class="fa fa-redo"></i>Redo<span class="command shortcut">Y</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="cut"><i class="fa fa-cut"></i>Cut<span class="command shortcut">X</span></a>
		</li>
		
		<li role="presentation">
			<a class="copy"><i class="fa fa-copy"></i>Copy<span class="command shortcut">C</span></a>
		</li>
		
		<li role="presentation">
			<a class="paste"><i class="fa fa-paste"></i>Paste<span class="command shortcut">V</span></a>
		</li>
		
		<li role="presentation">
			<a class="delete"><i class="fa fa-trash-alt"></i>Delete<span class="shortcut">delete</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="indent"><i class="fa fa-indent"></i>Indent<span class="shortcut">tab</span></a>
		</li>
		
		<li role="presentation">
			<a class="outdent"><i class="fa fa-outdent"></i>Outdent<span class="shortcut">&#8679;tab</span></a>
		</li>
	`),

	events: {
		'click .undo': 'onClickUndo',
		'click .redo': 'onClickRedo',
		'click .cut': 'onClickCut',
		'click .copy': 'onClickCopy',
		'click .paste': 'onClickPaste',
		'click .delete': 'onClickDelete',
		'click .indent': 'onClickIndent',
		'click .outdent': 'onClickOutdent'
	},

	//
	// querying methods
	//

	disabled: function() {
		return {
			'undo': true,
			'redo': true,
			'cut': true,
			'copy': true,
			'paste': application.clipboard != undefined,
			'delete': true,
			'indent': true,
			'outdent': true	
		};
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.setItemsDisabled([
			'undo', 'redo'
		], false);
	},

	//
	// mouse event handling methods
	//

	onClickUndo: function() {
		this.parent.app.undo();
	},

	onClickRedo: function() {
		this.parent.app.redo();
	},

	onClickCut: function() {
		this.parent.app.cut();
		this.setItemEnabled('paste');
		this.onChange();
	},

	onClickCopy: function() {
		this.parent.app.copy();
		this.setItemEnabled('paste');
	},

	onClickPaste: function() {
		this.parent.app.paste();
		this.onChange();
	},

	onClickDelete: function() {
		this.parent.app.delete();
		this.onChange();
	},

	onClickIndent: function() {
		this.parent.app.indent();
		this.onChange();
	},

	onClickOutdent: function() {
		this.parent.app.outdent();
		this.onChange();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.setItemsDisabled([
			'cut', 'copy', 'delete', 'indent', 'outdent'
		], false);
	},

	onDeselect: function() {
		this.setItemsDisabled([
			'cut', 'copy', 'delete', 'indent', 'outdent'
		], true);
	}
});