<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) {
    die();
}

$arComponentParameters = [
    'GROUPS' => [],
    'PARAMETERS' => [
        'DEPARTURE' => [
            'PARENT' => 'BASE',
            'NAME' => GetMessage('SCDC_DEPARTURE'),
            'TYPE' => 'TEXT',
        ],
        'COST' => [
            'PARENT' => 'BASE',
            'NAME' => GetMessage('SCDC_COST'),
            'TYPE' => 'TEXT',
        ],
        'FREE_DISTANCE' => [
            'PARENT' => 'BASE',
            'NAME' => GetMessage('SCDC_FREE_DISTANCE'),
            'TYPE' => 'TEXT',
        ],
    ],
];