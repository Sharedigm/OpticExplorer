<h1><i class="<%= config.apps['connection_manager'].icon %>"></i><%= config.apps['connection_manager'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-user-friends"></i><%= config.apps['connection_manager'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['connection_manager'].color %>">
		<img src="images/icons/apps/<%= config.apps['connection_manager'].image || config.apps['connection_manager'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['connection_manager'].name %> app lets you view and manage your connections with friends and colleagues. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View and sort connections by name, location occupation, age, gender, birth date.</li>
					<li>Find and invite new connections.</li>
					<li>View connections as icons, tiles, lists, or cards.</li>
					<li>Open items to view connections' profile information.</li>
					<li>Create groups and sort connections into groups by drag and drop.</li>
					<li>Use groups to quickly filter and select connections of a particular group.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Easy to use - works a lot like the <a href="#apps/file-browser">File Browser</a> app, which you are already familiar with. </li>
					<li>Grouping makes it easy to manage and view a large number of connections. </p>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-info-circle"></i>For More Information</h2>
	<ul>
		<li><a href="#help/building-social-network">Building Your Social Network</a></li>
	</ul>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/connection-manager/connection-manager.png" target="_blank" class="lightbox" title="<%= config.apps['connection_manager'].name %>"><img class="dialog" src="images/info/apps/connection-manager/connection-manager.png" /></a>
		<div class="caption"><%= config.apps['connection_manager'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/connection-manager/mobile/mobile-connection-manager.png" target="_blank" class="lightbox" title="<%= config.apps['connection_manager'].name %>"><img src="images/info/apps/connection-manager/mobile/mobile-connection-manager.png" /></a>
		<div class="caption"><%= config.apps['connection_manager'].name %></div>
	</div>
</div>