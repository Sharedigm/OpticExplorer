<h1><i class="<%= config.apps['chat_viewer'].icon %>"></i><%= config.apps['chat_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-comments"></i><%= config.apps['chat_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['chat_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['chat_viewer'].image || config.apps['chat_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['chat_viewer'].name %> app lets you view and post news updates and exchange direct messages. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Direct message friends in a private chat.</li>
					<li>Invite one or more friends to a chat session.</li>
					<li>Attach photos, files, and folders to chat messages.</li> 
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Allows you to keep up-to-date with events in the lives of your friends.</li>
					<li>Enables private discussions. </p>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-info-circle"></i>For More Information</h2>
	<ul>
		<li><a href="#help/sharing-messages">Sharing Messages</a></li>
	</ul>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/chat-viewer/chat-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['chat_viewer'].name %>"><img class="dialog" src="images/info/apps/chat-viewer/chat-viewer.png" /></a>
		<div class="caption"><%= config.apps['chat_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/chat-viewer/mobile/mobile-chat-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['chat_viewer'].name %>"><img src="images/info/apps/chat-viewer/mobile/mobile-chat-viewer.png" /></a>
		<div class="caption"><%= config.apps['chat_viewer'].name %></div>
	</div>
</div>