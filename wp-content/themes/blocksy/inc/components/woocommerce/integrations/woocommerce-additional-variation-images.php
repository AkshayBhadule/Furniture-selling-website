<?php

// https://woocommerce.com/products/woocommerce-additional-variation-images/

add_action('init', function () {
	if (! blocksy_woocommerce_has_flexy_view()) {
		return;
	}

	add_filter('blocksy:general:ct-scripts-localizations', function ($loc) {
		$loc['woo_gallery_replace_on_variation_change'] = true;
		return $loc;
	});

	add_action(
		'wp_enqueue_scripts',
		function () {
			wp_dequeue_script('wc_additional_variation_images_script');
		},
		500
	);
});

add_action(
	'wp_ajax_blocksy_get_product_view_for_variation',
	'blocksy_get_product_view_for_variation'
);

add_action(
	'wp_ajax_nopriv_blocksy_get_product_view_for_variation',
	'blocksy_get_product_view_for_variation'
);

function blocksy_get_product_view_for_variation() {
	if (! isset($_POST['product_id'])) {
		wp_send_json_error();
	}

	$product = wc_get_product(absint($_POST['product_id']));

	if (! $product) {
		wp_send_json_error();
	}

	$gallery_args = [
		'product' => $product,
		'forced_single' => true,
	];

	if (isset($_POST['variation_id'])) {
		$variation_id = isset($_POST['variation_id']) ? absint($_POST['variation_id']) : false;
		$variation = $variation_id ? wc_get_product($variation_id) : false;

		global $blocksy_current_variation;

		if ($variation) {
			$blocksy_current_variation = $variation;
		}
	}

	wp_send_json_success([
		'html' => blocksy_render_view(
			dirname(__FILE__) . '/../single/woo-gallery-template.php',
			$gallery_args
		)
	]);
}
