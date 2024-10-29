<h1><i class="<%= config.apps['video_player'].icon %>"></i><%= config.apps['video_player'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-video"></i><%= config.apps['video_player'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['video_player'].color %>">
		<img src="images/icons/apps/<%= config.apps['video_player'].image || config.apps['video_player'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['video_player'].name %> app is used to view video files and movies. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Play video files in the following formats:
						<ul>
							<li>Mpeg (.mp4, .mpeg, .mpg)</li>
							<li>Quicktime (.mov)</li>
							<li>Ogg (.ogg)</li>
							<li>WebM (.webm)</li>
						</ul>
					</li>
					<li>Use the video controls to play, pause, and repeat.</li>
					<li>Use the time slider to advance to a specific position in a clip.</li>
					<li>Use the volume controls to adjust the volume.</li>
					<li>Use the sidebar thumbnail view to preview and navigate videos.</li>
					<li>Use the navigation controls to step through a collection of videos.</li>
					<li>Use the full screen mode to expand videos to encompass the screen.</li>
					<li>Use the share menu to share favorite clips with connections.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Play video files and collections from any network connected device. </ul>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/video-player/video-player.png" target="_blank" class="lightbox" title="<%= config.apps['video_player'].name %>"><img class="dialog" src="images/info/apps/video-player/video-player.png" /></a>
		<div class="caption"><%= config.apps['video_player'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/video-player/mobile/mobile-video-player.png" target="_blank" class="lightbox" title="<%= config.apps['video_player'].name %>"><img src="images/info/apps/video-player/mobile/mobile-video-player.png" /></a>
		<div class="caption"><%= config.apps['video_player'].name %></div>
	</div>
</div>