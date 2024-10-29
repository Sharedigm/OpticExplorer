<h1><i class="fa fa-copy"></i>Manipulating Files</h1>

<ol class="breadcrumb">
	<li><a href="#help"><i class="fa fa-question-circle"></i>Help</a></li>
	<li><a href="#help/working-with-files"><i class="fa fa-file"></i>Working with Files</a></li>
	<li><i class="fa fa-copy"></i>Manipulating Files</li>
</ol>

<div class="content">
	<p><%= application.name %> allows you to organize your data into files and folders in a way that should be familiar to you since it's almost the same as common operating systems that you are already familiar with.</p>

	<ol>
		<li>
			<h2><i class="fa fa-font"></i>Renaming Files</h2>
			<p>To rename a file or folder, simply select the item, then click on the selected item's name.  The item will enter edit mode where you can change its name. When you deselect the item, it will be renamed. </p>

			<div class="icon-grid figure">
				<div class="directory item selected">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/folder-full.svg" /></div>
					</div>
					<div class="row">
						<div class="name" contenteditable="true">untitled</div>
					</div>
				</div>
			</div>

			<p>Alternatively, you can select the item and then click "Rename" on the File Menu.</p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/rename-menu-item@2x.png" />
				<div class="caption">"Rename" on the File Menu</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>You can quickly rename items using the keyboard shortcut: command or control + shift + R.</p>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-hand-grab"></i>Moving Files</h2>
			<p>To move files, simply select the items that you would like to move, then drag them to the folder where you would like to move them. When you drag the items over a folder, it will be highlighted.  When you release the move button, the files will be moved to the highlighted destination folder. </p>

			<div class="figure">
				<a href="images/help/working-with-files/manipulating-files/moving-files@2x.png" target="_blank" class="lightbox" title="Moving Files"><img src="images/help/working-with-files/manipulating-files/moving-files@2x.png" width="600px" /></a>
				<div class="caption">Moving Files</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-cut"></i>Cutting Files</h2>
			<p>To cut files, select one or more items and then click "Cut" on the Edit menu. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/cut-menu-item@2x.png" />
				<div class="caption">"Cut" on the Edit Menu</div>
			</div>

			<p>When you cut files, they are moved to your ".Clipboard" folder (<a href="#help/working-with-files/viewing-hidden-items">which is hidden by default</a>) where they await pasting to a new location. </p>

			<div class="icon-grid figure">
				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/clipboard-full.svg" /></div>
					</div>
					<div class="row">
						<div class="name">.Clipboard</div>
					</div>
				</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>You can quickly cut items using the keyboard shortcut: command or control + X.</p>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-copy"></i>Copying Files</h2>
			<p>To copy files, select one or more items and then click "Copy" on the Edit menu.  When you copy files, they are copied to your ".Clipboard" folder where they await pasting to a new location. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/copy-menu-item@2x.png" />
				<div class="caption">"Copy" on the Edit Menu</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>You can quickly copy items using the keyboard shortcut: command or control + C.</p>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-paste"></i>Pasting Files</h2>
			<p>To paste files, open the folder where you want the items to be pasted and then click "Paste" on the Edit Menu.  When you paste, items contained in your .Clipboard folder will be copied to the destination folder. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/paste-menu-item@2x.png" />
				<div class="caption">"Paste" on the Edit Menu</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>You can quickly paste items using the keyboard shortcut: command or control + V.</p>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-paste"></i>Putting Files</h2>
			<p>To put files, open the folder where you want the items to be put and then click "Put" on the Edit Menu.  When you put, items contained in your .Clipboard folder will be moved to the destination folder (instead of copied as with 'paste'). </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/put-menu-item@2x.png" />
				<div class="caption">"Put" on the Edit Menu</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>You can quickly paste items using the keyboard shortcut: command or control + shift + V.</p>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-copy"></i>Duplicating Files</h2>
			<p>To duplicate files, select one or more items and then click "Duplicate" on the Edit menu.  When you duplicate files, they are copied to new files with the original name + " copy". </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/duplicate-menu-item@2x.png" />
				<div class="caption">"Duplicate" on the Edit Menu</div>
			</div>

			<div class="icon-grid figure">
				<div class="file item selected">
					<div class="row">
						<div class="icon"><img src="images/icons/files/text.svg" /></div>
					</div>
					<div class="row">
						<div class="name">File.text</div>
					</div>
				</div>

				<div class="directory item">
					copy<br />
					<i class="fa fa-4x fa-arrow-right" style="color:lightgrey"></i>
				</div>

				<div class="file item">
					<div class="row">
						<div class="icon"><img src="images/icons/files/text.svg" /></div>
					</div>
					<div class="row">
						<div class="name">File copy.text</div>
					</div>
				</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-trash-alt"></i>Deleting Files</h2>
			<p>To delete files, select one or more items and then click "Delete" on the Edit menu.  Alternatively, you can simply hit the "Delete" key. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/delete-menu-item@2x.png" />
				<div class="caption">"Delete" on the Edit Menu</div>
			</div>

			<p>When you delete files, they are moved to the Trash folder, which is indicated by a Trash can icon on your <a href="#help/getting-started/using-desktop">Desktop</a>. You can later recover files from this location if you decide to undelete them. </p>

			<div class="icon-grid figure">
				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/trash-full.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Trash</div>
					</div>
				</div>
			</div>

			<p>After you have deleted multiple items they will accumulate in your Trash folder.  You should periodically empty the trash to prevent a build up of files in your Trash folder. In order to empty the trash, click on "Empty Trash" on the File menu. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/empty-trash-menu-item@2x.png" />
				<div class="caption">"Empty Trash" on the File Menu</div>
			</div>

			<div class="icon-grid figure">
				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/trash-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Trash</div>
					</div>
				</div>
			</div>

			<div class="tip well">
				<h3><span class="icon"><i class="fa fa-lightbulb"></i></span>Tip</h3><p>You can quickly empty the trash using the keyboard shortcut: command or control + E.</p>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-clipboard"></i>Show Clipboard</h2>
			<p>You can quickly view and edit the clipboard directory simply by clicking on "Show Clipboard" on the Edit menu. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/show-clipboard-menu-item@2x.png" />
				<div class="caption">"Show Clipboard" on the Edit Menu</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-trash-alt"></i>Clear Clipboard</h2>
			<p>You can quickly clear the clipboard directory simply by clicking on "Clear Clipboard" on the Edit menu. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/manipulating-files/clear-clipboard-menu-item@2x.png" />
				<div class="caption">"Clear Clipboard" on the Edit Menu</div>
			</div>
		</li>
	</ol>
</div>