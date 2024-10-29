<h1><i class="<%= config.apps['calendar'].icon %>"></i><%= config.apps['calendar'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-calendar-alt"></i><%= config.apps['calendar'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['calendar'].color %>">
		<img src="images/icons/apps/<%= config.apps['calendar'].image || config.apps['calendar'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['calendar'].name %> app allows you to keep track of your appointments. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View current date and time. </li>
					<li>Look back at previous dates and times. </li>
					<li>View events by day or time.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Keep track of your events and appointment times and details. </li>
					<li>Easily view an overview of your daily, weekly, or monthly schedule. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/calendar/calendar.png" target="_blank" class="lightbox" title="<%= config.apps['calendar'].name %>"><img class="dialog" src="images/info/apps/calendar/calendar.png" /></a>
		<div class="caption"><%= config.apps['calendar'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/calendar/mobile/mobile-calendar.png" target="_blank" class="lightbox" title="<%= config.apps['calendar'].name %>"><img src="images/info/apps/calendar/mobile/mobile-calendar.png" /></a>
		<div class="caption"><%= config.apps['calendar'].name %></div>
	</div>
</div>