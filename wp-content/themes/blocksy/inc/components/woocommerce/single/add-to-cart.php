<?php

add_action(
	'woocommerce_before_add_to_cart_form',
	function () {
		global $product;
		global $root_product;

		$root_product = $product;
	}
);

add_action(
	'woocommerce_before_add_to_cart_quantity',
	function () {
		global $product;
		global $root_product;

		if (! $root_product) {
			return;
		}

		if (
			! $root_product->is_type('simple')
			&&
			! $root_product->is_type('variable')
			&&
			! $root_product->is_type('subscription')
			&&
			! $root_product->is_type('variable-subscription')
		) {
			return;
		}

		if (
			(is_product() || wp_doing_ajax())
			&&
			! blocksy_manager()->screen->uses_woo_default_template()
		) {
			// return;
		}

		global $has_wish_list;

		$ajax_add_to_cart_id = 'has_ajax_add_to_cart';

		if ($has_wish_list) {
			$ajax_add_to_cart_id = 'has_wishlist_ajax_add_to_cart';
		}

		if (
			(is_product() || wp_doing_ajax())
			&&
			! blocksy_manager()->screen->uses_woo_default_template()
		) {
			$class = 'ct-cart-actions-builder';
		} else {
			$class = 'ct-cart-actions';
		}

		if (get_theme_mod($ajax_add_to_cart_id, 'no') === 'yes') {
			$class .= ' ct-ajax-add-to-cart';
		}

		echo '<div class="' . $class . '">';
	},
	PHP_INT_MAX
);

add_action(
	'woocommerce_after_add_to_cart_button',
	function () {
		global $product;
		global $root_product;

		global $post;

		if (! $root_product) {
			return;
		}

		if (
			! $root_product->is_type('simple')
			&&
			! $root_product->is_type('variable')
			&&
			! $root_product->is_type('subscription')
			&&
			! $root_product->is_type('variable-subscription')
		) {
			return;
		}

		if (
			(is_product() || wp_doing_ajax())
			&&
			! blocksy_manager()->screen->uses_woo_default_template()
		) {
			// return;
		}

		echo '</div>';
	},
	100
);

