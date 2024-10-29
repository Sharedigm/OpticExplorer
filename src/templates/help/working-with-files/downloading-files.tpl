<h1><i class="fa fa-download"></i>Downloading Files</h1>

<ol class="breadcrumb">
	<li><a href="#help"><i class="fa fa-question-circle"></i>Help</a></li>
	<li><a href="#help/working-with-files"><i class="fa fa-file"></i>Working with Files</a></li>
	<li><i class="fa fa-download"></i>Downloading Files</li>
</ol>

<div class="content">
	<p>To be able to share files using <%= application.name %>, users must be able to download files from your <%= application.name %> account to their computing device.  There are two ways to download files from <%= application.name %>: (1) drag and drop and (2) using the File menu.</p>

	<ol>
		<li>
			<h2><i class="fa fa-hand-grab"></i>Drag and Drop Downloading</h2>
			<p>The quickest and easiest way to download files to your <%= application.name %> account is through drag and drop.  Simply drag files or folders from your <%= application.name %> <a href="#help/getting-started/using-desktop">Desktop</a> or a <a href="#apps/file-browser">File Browser</a> window and drop them onto your operating system's Desktop.  Your web browser will then download the file to your local file system, placing it in the folder that it uses for downloads.</p>

			<div class="figure">
				<a href="images/help/working-with-files/downloading-files/downloading-file.png" target="_blank" class="lightbox" title="Downloading File"><img src="images/help/working-with-files/downloading-files/downloading-file.png" /></a>
				<div class="caption">Downloading File (Note download indicator at screen bottom)</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-download"></i>Downloading from the File Menu</h2>
			<p>You can also download files by using the File menu, either on your <%= application.name %> <a href="#help/getting-started/using-desktop">Desktop</a> or from a <a href="#apps/file-browser">File Browser</a> window. Simply select the items that you would like to download, then click "Download" on the File menu. Your web browser will then download the file to your local file system, placing it in the folder that it uses for downloads.</p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/downloading-files/download-menu-item@2x.png" />
				<div class="caption">"Download" on the File Menu</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>You can quickly download files using the keyboard shortcut: command or control + shift + D.</p>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-folder"></i>Downloading Folders</h2>
			<p>Note that when you download a folder, the folder and all of its contents will be downloaded as a single compressed archive (.zip) file. This is much more efficient than downloading many single files individually.  To uncompress this file once it has been downloaded, just double-click it on your local operating system and it should be uncompressed back into its original collection of files and folders. </p>

			<div class="icon-grid figure">
				<div class="directory item selected">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/folder-full.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Folder</div>
					</div>
				</div>

				<div class="directory item">
					download<br />
					<i class="fa fa-4x fa-arrow-right" style="color:lightgrey"></i>
				</div>

				<div class="file item">
					<div class="row">
						<div class="icon"><img src="images/icons/files/zip.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Folder.zip</div>
					</div>
				</div>
			</div>
		</li>
	<ol>
</div>