<?php
/******************************************************************************\
|                                                                              |
|                            StringArrayCaster.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a caster for string arrays.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\Strings;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class StringArrayCaster implements CastsAttributes {

    /**
     * Convert string to array.
     *
     * @var array
     */
    public function get($model, $key, $value, $attributes) {
        if ($value) {
           return explode(', ', $value); 
       } else {
            return [];
       } 
    }

    /**
     * Convert array to string.
     *
     * @var array
     */
    public function set($model, $key, $value, $attributes) {
        return [$key => implode(', ', $value)];
    }
}