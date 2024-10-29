<h1><i class="<%= config.apps['notification_center'].icon %>"></i><%= config.apps['notification_center'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-calendar-alt"></i><%= config.apps['notification_center'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['notification_center'].color %>">
		<img src="images/icons/apps/<%= config.apps['notification_center'].image || config.apps['notification_center'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['notification_center'].name %> app allows you to monitor and view your notifications. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View like, comment and reply notifications.</li>
					<li>View file and folder share request notifications.</li>
					<li>View connection request notifications.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Keep track of your notifications and connection requests. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<div class="figure col-sm-6">
			<a href="images/info/apps/notification-center/notification-center.png" target="_blank" class="lightbox" title="<%= config.apps['notification_center'].name %>"><img class="dialog" src="images/info/apps/notification-center/notification-center.png" style="width:300px" /></a>
			<div class="caption"><%= config.apps['notification_center'].name %></div>
		</div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/notification-center/mobile/mobile-notification-center.png" target="_blank" class="lightbox" title="<%= config.apps['notification_center'].name %>"><img src="images/info/apps/notification-center/mobile/mobile-notification-center.png" /></a>
		<div class="caption"><%= config.apps['notification_center'].name %></div>
	</div>
</div>