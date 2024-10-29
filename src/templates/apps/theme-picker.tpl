<h1><i class="<%= config.apps['theme_picker'].icon %>"></i><%= config.apps['theme_picker'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-paint-brush"></i><%= config.apps['theme_picker'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['theme_picker'].color %>">
		<img src="images/icons/apps/<%= config.apps['theme_picker'].image || config.apps['theme_picker'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['theme_picker'].name %> app lets you quickly apply a theme to change the look and feel of the user interface. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Apply pre-existing themes to change groups of settings.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Easily customize your environment to suit your personal style and preferences. </li>
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
		<a href="images/info/apps/theme-picker/theme-picker.png" target="_blank" class="lightbox" title="<%= config.apps['theme_picker'].name %>"><img class="dialog" src="images/info/apps/theme-picker/theme-picker.png" /></a>
		<div class="caption"><%= config.apps['theme_picker'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/theme-picker/mobile/mobile-theme-picker.png" target="_blank" class="lightbox" title="<%= config.apps['theme_picker'].name %>"><img src="images/info/apps/theme-picker/mobile/mobile-theme-picker.png" /></a>
		<div class="caption"><%= config.apps['theme_picker'].name %></div>
	</div>
</div>