<?php
/******************************************************************************\
|                                                                              |
|                                  Guid.php                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for creating globally unique identifiers.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\Uuids;

class Guid
{
    /**
     * Create a new unique Guid.
     *
     * @return string
     */
    static function create(): string {
        if (function_exists('com_create_guid')) {
            return com_create_guid();
        } else {
            mt_srand((double)microtime() * 10000); //optional for php 4.2.0 and up.
            $charid = strtolower(md5(uniqid(rand(), true)));
            $hyphen = chr(45); // '-'
            $uuid = substr($charid, 0, 8) . $hyphen . 
                substr($charid, 8, 4) . $hyphen .
                substr($charid, 12, 4) . $hyphen .
                substr($charid, 16, 4) . $hyphen .
                substr($charid, 20, 12);
            return $uuid;
        }
    }
}