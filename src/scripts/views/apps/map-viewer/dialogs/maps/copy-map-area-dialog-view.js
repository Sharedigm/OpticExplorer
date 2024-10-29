/******************************************************************************\
|                                                                              |
|                         copy-map-area-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog view for viewing and copying map coords.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../../views/dialogs/modal-view.js';
import '../../../../../../library/clipboard/clipboard.min.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-copy"></i>
					</div>	
					<div class="title">
						Copy Map Area
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>Your current map area is:</p>
					<div id="area" class="well">
						<%= area %>
					</div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="copy-to-clipboard btn btn-primary" data-clipboard-target="#area">
							<i class="fa fa-copy"></i>Copy to Clipboard
						</button>
						<button class="ok btn" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, ModalView.prototype.events, {
		'click .copy-to-clipboard': 'onClickCopyToClipboard'
	}),

	//
	// rendering methods
	//

	templateContext: function() {
		let bounds = this.options.bounds;
		let tlx = bounds.min_longitude;
		let tly = bounds.max_latitude;
		let brx = bounds.max_longitude;
		let bry = bounds.min_latitude;
		let area = '<Coords tlx="' + tlx + '" tly="' + tly + '" brx="' + brx + '" bry="' + bry + '"/>';

		return {
			area: area.replace('<', '&lt;').replace('>', '&gt;').replace(/"/g, '&quot;')
		};
	},

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// enable copy to clipboard
		//
		new Clipboard('.copy-to-clipboard');
	},

	//
	// mouse event handling methods
	//

	onClickCopyToClipboard: function() {

		// play copy sound
		//
		application.play('copy');
	}
});
