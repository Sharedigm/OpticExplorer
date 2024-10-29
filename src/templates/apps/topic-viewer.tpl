<h1><i class="<%= config.apps['topic_viewer'].icon %>"></i><%= config.apps['topic_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-newspaper"></i><%= config.apps['topic_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['topic_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['topic_viewer'].image || config.apps['topic_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['topic_viewer'].name %> app lets you view and post news updates and discussion. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Read friends' news posts and post your own news updates.</li>
					<li>Post new articles, comment on existing posts, and reply to comments.</li>
					<li>'Like' posts, comments, and replies.</li>
					<li>Include files and photos with your posts.</li>
					<li>Organize and view posts according to topic.</li>
					<li>Create new public or private news topics and invite friends to join the discussion.</li>
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
		<li><a href="#help/sharing-news">Sharing News</a></li>
	</ul>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/topic-viewer/topic-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['topic_viewer'].name %>"><img class="dialog" src="images/info/apps/topic-viewer/topic-viewer.png" /></a>
		<div class="caption"><%= config.apps['topic_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/topic-viewer/mobile/mobile-topic-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['topic_viewer'].name %>"><img src="images/info/apps/topic-viewer/mobile/mobile-topic-viewer.png" /></a>
		<div class="caption"><%= config.apps['topic_viewer'].name %></div>
	</div>
</div>