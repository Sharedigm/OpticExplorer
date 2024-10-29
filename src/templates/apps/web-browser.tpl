<h1><i class="<%= config.apps['web_browser'].icon %>"></i><%= config.apps['web_browser'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-cloud"></i><%= config.apps['web_browser'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['web_browser'].color %>">
		<img src="images/icons/apps/<%= config.apps['web_browser'].image || config.apps['web_browser'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['web_browser'].name %> app lets you view and navigate web pages. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Quickly access and keep track of favorites using the Favorites sidebar.</li>
					<li>Use navigations controls to navigate through your browsing history.</li>
					<li>View web page source code using the View Source menu option, which will open up HTML in the <a href="#apps/code-editor"><%= config.apps['code_editor'].name %></a>.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Preview links before you send them to other people. </li>
					<li>Browse web pages and online help pages. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/web-browser/web-browser.png" target="_blank" class="lightbox" title="<%= config.apps['web_browser'].name %>"><img class="dialog" src="images/info/apps/web-browser/web-browser.png" /></a>
		<div class="caption"><%= config.apps['web_browser'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/web-browser/mobile/mobile-web-browser.png" target="_blank" class="lightbox" title="<%= config.apps['web_browser'].name %>"><img src="images/info/apps/web-browser/mobile/mobile-web-browser.png" /></a>
		<div class="caption"><%= config.apps['web_browser'].name %></div>
	</div>
</div>