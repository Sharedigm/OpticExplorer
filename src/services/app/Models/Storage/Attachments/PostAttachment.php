<?php
/******************************************************************************\
|                                                                              |
|                              PostAttachment.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of file attachment.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage\Attachments;

use App\Models\Storage\Attachments\Attachment;
use App\Models\Topics\Post;
use App\Models\Topics\Info\PostInfo;

class PostAttachment extends Attachment
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'post_attachments';

	/**
	 * Indicates if the IDs are auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;
	
	/**
	 * The "type" of the primary key ID.
	 *
	 * @var string
	 */
	protected $keyType = 'string';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id',
		'post_id',
		'path',
		'copy'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'post_id',
		'post',
		'path',
		'filename',
		'copy',

		// timestamps
		//
		'created_at',
		'updated_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'filename',
		'post'
	];

	/**
	 * Get this attachment's post
	 *
	 * @return string
	 */
	public function getPostAttribute() {
		return PostInfo::where('id', '=', $this->post_id)->first();
	}

	/**
	 * Get this attachment's post
	 *
	 * @return string
	 */
	public function getFilenameAttribute() {
		return $this->getItemPath();
	}

	//
	// relationship methods
	//

	/**
	 * Get this attachment's relationship to its item.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function item() {
		return $this->belongsTo('App\Models\Topics\Post', 'post_id');
	}
}