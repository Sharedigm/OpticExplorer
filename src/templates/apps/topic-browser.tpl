<h1><i class="<%= config.apps['topic_browser'].icon %>"></i><%= config.apps['topic_browser'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="<%= config.apps['topic_browser'].icon %>"></i><%= config.apps['topic_browser'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['topic_browser'].color %>">
		<img src="images/icons/apps/<%= config.apps['topic_browser'].image || config.apps['topic_browser'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['topic_browser'].name %> app lets you view discussion topics. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View and sort topics by name, date, or number of members.</li>
					<li>Create new public or private news topics and invite friends to join the discussion.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Review the topics that you are subscribed to.</li>
					<li>Find new topics to subscribe to. </p>
				</ul>
			</div>
		</div>
	</div>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/topic-browser/topic-browser.png" target="_blank" class="lightbox" title="<%= config.apps['topic_browser'].name %>"><img class="dialog" src="images/info/apps/topic-browser/topic-browser.png" /></a>
		<div class="caption"><%= config.apps['topic_browser'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/topic-browser/mobile/mobile-topic-browser.png" target="_blank" class="lightbox" title="<%= config.apps['topic_browser'].name %>"><img src="images/info/apps/topic-browser/mobile/mobile-topic-browser.png" /></a>
		<div class="caption"><%= config.apps['topic_browser'].name %></div>
	</div>
</div>