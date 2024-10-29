<?php
/******************************************************************************\
|                                                                              |
|                              TaskAttachment.php                              |
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
use App\Models\Topics\Task;

class TaskAttachment extends Attachment
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'task_attachments';

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
		'task_id',
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
		'task_id',
		'valid',

		// timestamps
		//
		'created_at',
		'updated_at'
	];

	//
	// relationship methods
	//

	/**
	 * Get this attachment's relationship to its item.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function item() {
		return $this->belongsTo('App\Models\Topics\Task', 'task_id');
	}
}
