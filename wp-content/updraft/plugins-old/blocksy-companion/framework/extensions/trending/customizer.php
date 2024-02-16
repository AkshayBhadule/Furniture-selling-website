<?php

$all_post_types = [
	'post' => __('Posts', 'blc')
];

if (class_exists('WooCommerce')) {
	$all_post_types['product'] = __('Products', 'blc');
}

if (function_exists('blocksy_manager')) {
	$post_types = blocksy_manager()->post_types->get_supported_post_types();

	foreach ($post_types as $single_post_type) {
		$post_type_object = get_post_type_object($single_post_type);

		if (! $post_type_object) {
			continue;
		}

		$all_post_types[$single_post_type] = $post_type_object->labels->singular_name;
	}
}

$options = [
	'title' => __('Trending Posts', 'blc'),
	'container' => [ 'priority' => 8 ],
	'options' => [
		'trending_posts_section_options' => [
			'type' => 'ct-options',
			'setting' => [ 'transport' => 'postMessage' ],
			'inner-options' => [
				blocksy_rand_md5() => [
					'type' => 'ct-title',
					'label' => __( 'Trending Posts', 'blocksy' ),
				],

				blocksy_rand_md5() => [
					'title' => __( 'General', 'blc' ),
					'type' => 'tab',
					'options' => [
						[
							'trending_block_post_type' => count($all_post_types) > 1 ? [
								'label' => __( 'Post Type', 'blc' ),
								'type' => 'ct-select',
								'value' => 'post',
								'design' => 'inline',
								'setting' => [ 'transport' => 'postMessage' ],
								'choices' => blocksy_ordered_keys($all_post_types),
								'sync' => [
									'selector' => '.ct-trending-block',
									'render' => function () {
										echo blc_get_trending_block();
									}
								],
							] : [
								'label' => __('Post Type', 'blc'),
								'type' => 'hidden',
								'value' => 'post',
								'design' => 'none',
								'setting' => ['transport' => 'postMessage'],
							],

							'trending_block_filter' => [
								'label' => __( 'Trending From', 'blc' ),
								'type' => 'ct-select',
								'divider' => 'top',
								'value' => 'all_time',
								'view' => 'text',
								'design' => 'inline',
								'setting' => [ 'transport' => 'postMessage' ],
								'choices' => blocksy_ordered_keys(
									[
										'all_time' => __( 'All Time', 'blc' ),
										'last_24_hours' => __( 'Last 24 Hours', 'blc' ),
										'last_7_days' => __( 'Last 7 Days', 'blc' ),
										'last_month' => __( 'Last Month', 'blc' ),
									]
								),

								'sync' => [
									'selector' => '.ct-trending-block',
									'render' => function () {
										echo blocksy_get_trending_block();
									}
								],
							],

							blocksy_rand_md5() => [
								'type' => 'ct-divider',
							],

							'trending_block_visibility' => [
								'label' => __( 'Container Visibility', 'blc' ),
								'type' => 'ct-visibility',
								'design' => 'block',
								'sync' => 'live',

								'value' => [
									'desktop' => true,
									'tablet' => true,
									'mobile' => false,
								],

								'choices' => blocksy_ordered_keys([
									'desktop' => __( 'Desktop', 'blc' ),
									'tablet' => __( 'Tablet', 'blc' ),
									'mobile' => __( 'Mobile', 'blc' ),
								]),
							],
						],

						blc_fs()->is__premium_only() ? [

							'trending_block_location' => [
								'label' => __('Display Location', 'blc'),
								'type' => 'ct-select',
								'design' => 'inline',
								'divider' => 'top',
								'value' => 'blocksy:content:bottom',
								'choices' => [
									[
										'key' => 'blocksy:content:bottom',
										'value' => __('Before Footer', 'blc')
									],

									[
										'key' => 'blocksy:footer:after',
										'value' => __('After Footer', 'blc')
									],

									[
										'key' => 'blocksy:header:after',
										'value' => __('After Header', 'blc')
									]
								]
							],

							'trending_block_conditions' => [
								'label' => __('Display Conditions', 'blc'),
								'type' => 'blocksy-display-condition',
								'divider' => 'top',
								'value' => [
									[
										'type' => 'include',
										'rule' => 'everywhere',
									]
								],
								'display' => 'modal',

								'modalTitle' => __('Trending Block Display Conditions', 'blc'),
								'modalDescription' => __('Add one or more conditions to display the trending block.', 'blc'),
								'design' => 'block',
								'sync' => 'live'
							],
						] : [],
					],
				],

				blocksy_rand_md5() => [
					'title' => __( 'Design', 'blc' ),
					'type' => 'tab',
					'options' => [

						'trendingBlockPostsFont' => [
							'type' => 'ct-typography',
							'label' => __( 'Posts Font', 'blc' ),
							'value' => blocksy_typography_default_values([
								'size' => '15px',
								'variation' => 'n5',
							]),
							'setting' => [ 'transport' => 'postMessage' ],
						],

						'trendingBlockFontColor' => [
							'label' => __( 'Font Color', 'blc' ),
							'type'  => 'ct-color-picker',
							'design' => 'block:right',
							'divider' => 'top',
							'responsive' => true,
							'sync' => 'live',
							'value' => [
								'default' => [
									'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT'),
								],

								'hover' => [
									'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT'),
								],
							],

							'pickers' => [
								[
									'title' => __( 'Initial', 'blc' ),
									'id' => 'default',
									'inherit' => 'var(--color)'
								],

								[
									'title' => __( 'Hover', 'blc' ),
									'id' => 'hover',
									'inherit' => 'var(--linkHoverColor)'
								],
							],
						],

						'trending_block_background' => [
							'label' => __( 'Container Background', 'blc' ),
							'type' => 'ct-background',
							'design' => 'block:right',
							'responsive' => true,
							'divider' => 'top',
							'sync' => 'live',
							'value' => blocksy_background_default_value([
								'backgroundColor' => [
									'default' => [
										'color' => 'var(--paletteColor5)',
									],
								],
							])
						],

						'trendingBlockContainerSpacing' => [
							'label' => __( 'Container Inner Spacing', 'blc' ),
							'type' => 'ct-slider',
							'divider' => 'top',
							'value' => '30px',
							'units' => blocksy_units_config([
								[
									'unit' => 'px',
									'min' => 0,
									'max' => 100,
								],
							]),
							'responsive' => true,
							'sync' => 'live',
						],

					],
				],
			]
		]
	]
];
