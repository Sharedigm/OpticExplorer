<h1><i class="<%= config.apps['settings_browser'].icon %>"></i><%= config.apps['settings_browser'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-cog"></i><%= config.apps['settings_browser'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['settings_browser'].color %>">
		<img src="images/icons/apps/<%= config.apps['settings_browser'].image || config.apps['settings_browser'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['settings_browser'].name %> app lets you view and modify system settings and app preferences. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View and modify system settings.</li>
					<li>View and modify app preferences.</li>
					<li>Use arrow keys to quickly and easily step through all settings and preferences.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Customize your system and applications to suit your personal style and preferences. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-info-circle"></i>For More Information</h2>
	<ul>
		<li><a href="#help/getting-started/setting-desktop-app">Setting Your Desktop App</a></li>
	</ul>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/settings-browser/settings-browser.png" target="_blank" class="lightbox" title="<%= config.apps['settings_browser'].name %>"><img class="dialog" src="images/info/apps/settings-browser/settings-browser.png" /></a>
		<div class="caption"><%= config.apps['settings_browser'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/settings-browser/mobile/mobile-settings-browser.png" target="_blank" class="lightbox" title="<%= config.apps['settings_browser'].name %>"><img src="images/info/apps/settings-browser/mobile/mobile-settings-browser.png" /></a>
		<div class="caption"><%= config.apps['settings_browser'].name %></div>
	</div>
</div>