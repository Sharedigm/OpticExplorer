<h1><i class="<%= config.apps['audio_player'].icon %>"></i><%= config.apps['audio_player'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-volume-up"></i><%= config.apps['audio_player'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['audio_player'].color %>">
		<img src="images/icons/apps/<%= config.apps['audio_player'].image || config.apps['audio_player'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['audio_player'].name %> app is used to play music and audio files (audiobooks, podcasts etc). </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Play audio files in the following formats:
						<ul>
							<li>Free Lossless Audio Codec (.flac)</li>
							<li>Mp3 (.mp3)</li>
							<li>Mp4 Audio (.m4a, .m4p)</li>
							<li>Wav (.wav)</li>
						</ul>
					</li>

					<li>Use the navigation controls to play, pause, and repeat.</li>
					<li>Use the time slider to advance to a specific position in a track.</li>
					<li>Use the volume controls to adjust the volume.</li>
					<li>View track ID3 metadata including Album, Artist, Band, Composer, Genre, Track Length, Publisher, Track Number, and Year.</li>
					<li>Use the share menu to share favorite tracks with friends.</li>
					<li>View track Id3 metadata information.</li>
					<li>Save favorites in the sidebar for easy access.</li>
					<li>Visualize audio tracks using the audio analyzer.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Allows you to play any track from your music collection from any network connected device. </li>
					<li>Lets you move your music or podcast libraries to the cloud. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/audio-player/audio-player.png" target="_blank" class="lightbox" title="<%= config.apps['audio_player'].name %>"><img class="dialog" src="images/info/apps/audio-player/audio-player.png" /></a>
		<div class="caption"><%= config.apps['audio_player'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/audio-player/mobile/mobile-audio-player.png" target="_blank" class="lightbox" title="<%= config.apps['audio_player'].name %>"><img src="images/info/apps/audio-player/mobile/mobile-audio-player.png" /></a>
		<div class="caption"><%= config.apps['audio_player'].name %></div>
	</div>
</div>