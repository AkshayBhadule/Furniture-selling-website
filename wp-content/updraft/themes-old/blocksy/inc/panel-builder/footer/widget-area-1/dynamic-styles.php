<?php

if (! isset($selector)) {
	$selector = '[data-column="widget-area-1"]';
}

blocksy_output_responsive([
	'css' => $css,
	'tablet_css' => $tablet_css,
	'mobile_css' => $mobile_css,

	'selector' => blocksy_assemble_selector(blocksy_mutate_selector([
		'selector' => $root_selector,
		'operation' => 'replace-last',
		'to_add' => $selector
	])),

	'variableName' => 'horizontal-alignment',
	'unit' => '',
	'value' => blocksy_akg('horizontal_alignment', $atts, [
		'desktop' => 'left',
		'tablet' => 'left',
		'mobile' => 'left'
	])
]);

blocksy_output_responsive([
	'css' => $css,
	'tablet_css' => $tablet_css,
	'mobile_css' => $mobile_css,
	'selector' => blocksy_assemble_selector(blocksy_mutate_selector([
		'selector' => $root_selector,
		'operation' => 'replace-last',
		'to_add' => $selector
	])),
	'variableName' => 'vertical-alignment',
	'unit' => '',
	'value' => blocksy_akg('vertical_alignment', $atts, [
		'desktop' => 'flex-start',
		'tablet' => 'flex-start',
		'mobile' => 'flex-start'
	])
]);

