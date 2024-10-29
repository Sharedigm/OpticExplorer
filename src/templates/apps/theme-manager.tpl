<h1><i class="<%= config.apps['theme_manager'].icon %>"></i><%= config.apps['theme_manager'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-paint-brush"></i><%= config.apps['theme_manager'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['theme_manager'].color %>">
		<img src="images/icons/apps/<%= config.apps['theme_manager'].image || config.apps['theme_manager'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['theme_manager'].name %> app lets you customize the look and feel of the user interface. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Apply <a href="#features/themeable">pre-existing themes</a> to change groups of settings.</li>
					<li>Create and save your own themes.</li>
					<li>View and modify theme settings including:
						<ul>
							<li>type of app launcher to use (task bar, dock bar, or run menu)</li>
							<li>color scheme</li>
							<li>background color, image, size, and repeats</li>
							<li>material attributes (none, chalk, plastic, glass, metal)</li>
							<li>dialog transparency</li>
							<li>icon labels</li>
							<li>font family and size</li>
						</ul>
					</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Customize your environment to suit your personal style and preferences. </li>
					<li>Make your environment look like your favorite computing environment or make it look like something new.</li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-info-circle"></i>For More Information</h2>
	<ul>
		<li><a href="#features/themeable">Themes</a></li>
		<li><a href="#help/customizing-environment">Customizing Your Environment</a></li>
	</ul>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/theme-manager/theme-manager.png" target="_blank" class="lightbox" title="<%= config.apps['theme_manager'].name %>"><img class="dialog" src="images/info/apps/theme-manager/theme-manager.png" /></a>
		<div class="caption"><%= config.apps['theme_manager'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/theme-manager/mobile/mobile-theme-manager.png" target="_blank" class="lightbox" title="<%= config.apps['theme_manager'].name %>"><img src="images/info/apps/theme-manager/mobile/mobile-theme-manager.png" /></a>
		<div class="caption"><%= config.apps['theme_manager'].name %></div>
	</div>
</div>