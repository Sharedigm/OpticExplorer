<h1><i class="fa fa-code"></i>Installing the Code</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-installation"></i>Installation</li>
	<li><i class="fa fa-code"></i>Installing the Code</li>
</ol>

<div class="content">
	<p>Once you have your web server up and running, you will need to install the code.</p>

	<ol>
		<li>
			<h2><i class="fa fa-copy"></i>Copy the Files</h2>
			<p>Copy the files contained in the <span class="code">src</span> directory to your web server's document root. On most Unix/Apache systems, the web server folder is "/var/www/html". Note that the document root may be different on your web server, so you will need to find out this location for your particular type of web server. </p>

			<div class="code well">
cp -R src/*.* /var/www/html
			</div>
		</li>

		<li>
			<h2><i class="fa fa-user"></i>Set File Ownership</h2>
			<p>You will next want to change the ownership of the files in the document root directory to be owned by the web server so your web server can access them. </p>

			<div class="code well">
chown -R apache:apache /var/www/html
			</div>
		</li>

		<li>
			<h2><i class="fa fa-lock"></i>Set File Permissions</h2>
			<p>The application may sometimes have a need to write out temporary files, for example, log files or session files.  To allow this, set the file permissions of the application to make the directory writeable by the web server. </p>

			<div class="code well">
chmod -R 755 /var/www/html
			</div>
		</li>
	</ol>
</div>