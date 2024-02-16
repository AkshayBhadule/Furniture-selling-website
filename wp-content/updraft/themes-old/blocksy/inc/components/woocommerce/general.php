<?php

add_filter(
	'woocommerce_format_sale_price',
	function ($price, $regular_price, $sale_price) {
		return '<span class="sale-price">' . $price . '</span>';
	},
	10,
	3
);

add_action(
	'woocommerce_before_quantity_input_field',
	function () {
		if (
			(is_product() || wp_doing_ajax())
			&&
			! blocksy_manager()->screen->uses_woo_default_template()
		) {
			return;
		}

		echo '<span class="ct-increase"></span>';
		echo '<span class="ct-decrease"></span>';
	}
);

add_action(
	'woocommerce_before_main_content',
	function () {
		$prefix = blocksy_manager()->screen->get_prefix();

		if ($prefix === 'woo_categories' || $prefix === 'search') {
			/**
			 * Note to code reviewers: This line doesn't need to be escaped.
			 * Function blocksy_output_hero_section() used here escapes the value properly.
			 */
			echo blocksy_output_hero_section([
				'type' => 'type-2'
			]);
		}

		$attr = [
			'class' => 'ct-container'
		];

		if (blocksy_get_page_structure() === 'narrow') {
			$attr['class'] = 'ct-container-narrow';
		}

		if (is_product()) {
		}

		if ($prefix === 'product') {
			echo blocksy_output_hero_section([
				'type' => 'type-2'
			]);
		}

		echo '<div ' . blocksy_attr_to_html($attr) . ' ' . wp_kses(blocksy_sidebar_position_attr(), []) . ' ' . blocksy_get_v_spacing() . '>';

		if (is_product()) {
			echo '<article class="post-' . get_the_ID() . '">';
		} else {
			echo '<section>';
		}

		if (
			$prefix === 'woo_categories'
			||
			$prefix === 'search'
			||
			$prefix === 'product'
		) {
			/**
			 * Note to code reviewers: This line doesn't need to be escaped.
			 * Function blocksy_output_hero_section() used here escapes the value properly.
			 */
			echo blocksy_output_hero_section([
				'type' => 'type-1'
			]);
		}
	}
);

add_action(
	'woocommerce_after_main_content',
	function () {
		if (is_product()) {
			echo '</article>';
		} else {
			echo '</section>';
		}

		get_sidebar();
		echo '</div>';
	}
);

add_action(
	'woocommerce_before_template_part',
	function ($template_name, $template_path, $located, $args) {
		if (
			$template_name === 'global/quantity-input.php'
			&&
			blocksy_manager()->screen->uses_woo_default_template()
		) {
			ob_start();
		}

		if ($template_name === 'single-product/up-sells.php') {
			ob_start();
		}

		if ($template_name === 'single-product/related.php') {
			ob_start();
		}
	},
	10,
	4
);

add_action(
	'woocommerce_after_template_part',
	function ($template_name, $template_path, $located, $args) {
		if (
			$template_name === 'global/quantity-input.php'
			&&
			blocksy_manager()->screen->uses_woo_default_template()
		) {
			$quantity = ob_get_clean();

			echo str_replace(
				'class="quantity"',
				'class="quantity" data-type="' . get_theme_mod('quantity_type', 'type-1') . '"',
				$quantity
			);
		}

		if ($template_name === 'single-product/up-sells.php') {
			$upsells = ob_get_clean();

			echo str_replace(
				'class="up-sells upsells products"',
				'class="up-sells upsells products ' . trim(
					blocksy_visibility_classes(
						get_theme_mod(
							'upsell_products_visibility',
							[
								'desktop' => true,
								'tablet' => false,
								'mobile' => false,
							]
						)
					)
				) . '"',
				$upsells
			);
		}

		if ($template_name === 'single-product/related.php') {
			$related = ob_get_clean();

			echo str_replace(
				'class="related products"',
				'class="related products ' . trim(
					blocksy_visibility_classes(
						get_theme_mod(
							'related_products_visibility',
							[
								'desktop' => true,
								'tablet' => false,
								'mobile' => false,
							]
						)
					)
				) . '"',
				$related
			);
		}
	},
	4,
	4
);
