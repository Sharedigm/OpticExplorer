<h1><i class="fa fa-compress"></i>Compressing and Uncompressing Files</h1>

<ol class="breadcrumb">
	<li><a href="#help"><i class="fa fa-question-circle"></i>Help</a></li>
	<li><a href="#help/working-with-files"><i class="fa fa-file"></i>Working with Files</a></li>
	<li><i class="fa fa-compress"></i>Compressing and Uncompressing Files</li>
</ol>

<div class="content">
	<p>File compression is an essential tool for being able to transfer and archive data.  <%= application.name %> has file compression and decompression functions built-in so you can easily upload and download compressed files, saving bandwidth and time. </p>

	<ol>
		<li>
			<h2><i class="fa fa-compress"></i>Compressing Files</h2>
			<p>To compress a file or folder, select the item(s) that you want to compress, then click on "Compresss" on the File menu. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/compressing-files/compress-menu-item@2x.png" />
				<div class="caption">"Compress" on the File Menu</div>
			</div>

			<p>When you compress an item, a compressed item will be created with the same name but with a ".zip" file extension. </p>

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
					compress<br />
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

		<li>
			<h2><i class="fa fa-expand"></i>Uncompressing Files</h2>
			<p>To uncompress a file or folder, simply open the item that you want to uncompress by either double-clicking it or by selecting the item and clicking "Open" on the File menu. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/compressing-files/open-menu-item@2x.png" />
				<div class="caption">"Open" on the File Menu</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>You can quickly open compressed archive files using the keyboard shortcut: command or control + O.</p>
			</div>
			
			<p>When you uncompress an item, one or more new files or folders will be created using the original file names that they had before they were compressed. To prevent the possibility of inadvertantly creating a large number of new files and folders, you will be presented with a dialog box informing you of the number of new files and folders that will be created.</p>

			<div class="figure">
				<a href="images/help/working-with-files/compressing-files/uncompress-confirm-dialog.png" target="_blank" class="lightbox" title="Uncompress Confirmation Dialog Box"><img class="dialog" src="images/help/working-with-files/compressing-files/uncompress-confirm-dialog.png" /></a>
				<div class="caption">Uncompress Confirmation Dialog Box</div>
			</div>

			<p>The archive file formats that are supported are as follows: </p>
			<ul>
				<li><label>.zip</label></li>
				<li><label>.tar</label></li>
				<li><label>.tgz</label></li>
			</ul>
		</li>
	</ol>
</div>