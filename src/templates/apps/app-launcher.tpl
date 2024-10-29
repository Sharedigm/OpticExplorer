<h1><i class="<%= config.apps['app_launcher'].icon %>"></i><%= config.apps['app_launcher'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-rocket"></i><%= config.apps['app_launcher'].name %></li>
</ol>

<div class="content">

	<div class="attention icon colored <%= config.apps['app_launcher'].color %>">
		<img src="images/icons/apps/<%= config.apps['app_launcher'].image || config.apps['app_launcher'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['app_launcher'].name %> app is used to launch (start / run) other applications. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Click icons to launch applications.</li>
					<li>On mobile devices, the launcher is the main / home app, providing a similar experience to your mobile device's native operating system.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Launch all apps from one place with a single click.</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="section">
		<h2><i class="fa fa-info-circle"></i>For More Information</h2>
		<ul>
			<li><a href="#apps">Apps</a></li>
		</ul>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/app-launcher/app-launcher.png" target="_blank" class="lightbox" title="<%= config.apps['app_launcher'].name %>"><img class="dialog" src="images/info/apps/app-launcher/app-launcher.png" /></a>
		<div class="caption"><%= config.apps['app_launcher'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/app-launcher/mobile/mobile-app-launcher.png" target="_blank" class="lightbox" title="<%= config.apps['app_launcher'].name %>"><img src="images/info/apps/app-launcher/mobile/mobile-app-launcher.png" /></a>
		<div class="caption"><%= config.apps['app_launcher'].name %></div>
	</div>
</div>