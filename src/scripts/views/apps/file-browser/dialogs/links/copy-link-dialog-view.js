/******************************************************************************\
|                                                                              |
|                            copy-link-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog view for viewing and copying a link.            |
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
						Copy Link
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>You may now share the link / URL shown below:</p>
					<div class="well">
						<a id="link" href="<%= url %>"><%= url %></a>
					</div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="copy-link btn btn-primary" data-clipboard-target="#link">
							<i class="fa fa-copy"></i>Copy to Clipboard
						</button>
						<button class="view-link btn">
							<i class="fa fa-eye"></i>View Link
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
		'click .copy-link': 'onClickCopyLink',
		'click .view-link': 'onClickViewLink'
	}),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			url: this.options.url
		};
	},

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// enable copy to clipboard
		//
		new Clipboard('.copy-link');
	},

	//
	// mouse event handling methods
	//

	onClickCopyLink: function() {

		// play copy sound
		//
		application.play('copy');
	},

	onClickViewLink: function() {
		this.close();
		
		// show link in web browser
		//
		application.showUrl(this.options.url);
	}
});
