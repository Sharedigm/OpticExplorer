<h1><i class="<%= config.apps['timer'].icon %>"></i><%= config.apps['timer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-hourglass"></i><%= config.apps['timer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['timer'].color %>">
		<img src="images/icons/apps/<%= config.apps['timer'].image || config.apps['timer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['timer'].name %> app lets you time events, functioning as a simple stopwatch. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Start, stop, and reset functions</li>
					<li>Displays hours, minutes, seconds and hundredths of seconds.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Perform basic timing. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<div class="figure col-sm-6">
			<a href="images/info/apps/timer/timer.png" target="_blank" class="lightbox" title="<%= config.apps['timer'].name %>"><img class="dialog" src="images/info/apps/timer/timer.png" style="width:auto; height:300px" /></a>
			<div class="caption"><%= config.apps['timer'].name %></div>
		</div>
	</div>
	<div class="figure row mobile-only">
		<div class="figure col-sm-6">
			<a href="images/info/apps/timer/mobile/mobile-timer.png" target="_blank" class="lightbox" title="<%= config.apps['timer'].name %>"><img src="images/info/apps/timer/mobile/mobile-timer.png" /></a>
			<div class="caption"><%= config.apps['timer'].name %></div>
		</div>
	</div>
</div>