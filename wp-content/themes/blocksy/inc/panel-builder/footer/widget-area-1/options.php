<?php

if (! isset($sidebarId)) {
	$sidebarId = 'ct-footer-sidebar-1';
}

$options = [
	'widget' => [
		'type' => 'ct-widget-area',
		'sidebarId' => $sidebarId
	],

	blocksy_rand_md5() => [
		'type' => 'ct-divider',
	],

	'horizontal_alignment' => [
		'type' => 'ct-radio',
		'label' => __( 'Horizontal Alignment', 'blocksy' ),
		'view' => 'text',
		'design' => 'block',
		'responsive' => true,
		'attr' => [ 'data-type' => 'alignment' ],
		'setting' => [ 'transport' => 'postMessage' ],

		'choices' => [
			'left' => '',
			'center' => '',
			'right' => '',
		],

		'value' => [
			'desktop' => 'left',
			'tablet' => 'left',
			'mobile' => 'left'
		],
	],

	'vertical_alignment' => [
		'type' => 'ct-radio',
		'label' => __( 'Vertical Alignment', 'blocksy' ),
		'view' => 'text',
		'design' => 'block',
		'divider' => 'top',
		'responsive' => true,
		'attr' => [ 'data-type' => 'vertical-alignment' ],
		'setting' => [ 'transport' => 'postMessage' ],

		'choices' => [
			'flex-start' => '',
			'center' => '',
			'flex-end' => '',
		],

		'value' => [
			'desktop' => 'flex-start',
			'tablet' => 'flex-start',
			'mobile' => 'flex-start'
		],
	],
];
