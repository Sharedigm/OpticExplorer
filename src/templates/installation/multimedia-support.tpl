<h1><i class="fa fa-image"></i>Installing Multimedia Support</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-installation"></i>Installation</li>
	<li><i class="fa fa-image"></i>Multimedia Support</li>
</ol>

<div class="content">
	<p>Once you have your <%= application.name %> instance up and running, you will need to make sure that your <%= application.name %> web server has the appropriate multimedia support to take advantage of <%= application.name %>'s image and video capabilities. </p>

	<ol>
		<li>
			<h2><i class="fa fa-image"></i>Install Image Support</h2>
			<p><%= application.name %> uses the Image Magick library to perform image manipulation and scaling.   This is used to generate image thumbnails and to show image previews when viewing image galleries. </p>
			<ol>
				<li>
					<h3>Install the ImageMagick library</h3>
					<p>Follow the instructions on <a href="https://imagemagick.org">https://imagemagick.org</a> to install ImageMagick on your particular platform. </p>
				</li>
				<li>
					<h3>Install ImageMagick PHP library</h3>
					<p>You will also need to install support for PHP to access the ImageMagick library.  You will need to find directions for your particular platform to do this.  On CentOS / Linux, you would execute the following command, where XX is the major/minor version of PHP that you have installed: </p>
					<div class="code well">
yum install phpXX-imagick
yum install php-pecl-imagick
					</div>
				</li>
				<li>
					<h3>Configure PHP to use ImageMagick</h3>
					<p>To configure your PHP installation to use ImageMagick, open up your php.ini file and under the list of extensions, add the following line: </p>
					<div class="code well">
extension=imagick.so
					</div>
					</p>After adding this line, restart your web server.</p>
				</li>
			</ol>
		</li>

		<li>
			<h2><i class="fa fa-video"></i>Install Video Support</h2>
			<p>For generating thumbnails for video files and for extracing video file metadata, <%= application.name %> uses the FFMpeg library. <p>

			<ol>
				<li>
					<h3>Install the FFMpeg Framework</h3>
					<p>Follow the instructions on <a href="https://ffmpeg.org">https://ffmpeg.org</a> for installing the ImageMagick library on your particular platform. </p>
				</li>

				<li>
					<h3>Configure your <%= application.name %> Server to Use FFMpeg</h3>
					<p>Once you have installed the FFMpeg library, you may need to configure your <%= application.name %> server to know where the FFMpeg executables are on your file system. There are two executables that are used: </p>
					<ul>
						<li>ffmpeg - this is an executable used to perform video operations.</li>
						<li>ffprobe - this is an executable used to query video metadata.</li>
					</ul>
					<br />
					<p>To configure the path to these executables, open the .env file in the root directory of your <%= application.name %> server directory and set the following two values: 
					<div class="code well">
APP_FFMPEG_BINARY_PATH=/usr/local/bin/ffmpeg
APP_FFPROBE_BINARY_PATH=/usr/local/bin/ffprobe
					</div>
					</p>
					<p>Some hosting providers do not allow users to install the FFMpeg framework because of the potential for high resource consumption.  In that case, you will not be able to generate video file thumbnails.  To disable video file thumbnails, add the following line to your .env file:
					</p>
					<div class="code well">
APP_VIDEO_THUMBNAILS_ENABLED=false
					</div>
				</li>
			</ol>
		</li>
	</ol>
</div>