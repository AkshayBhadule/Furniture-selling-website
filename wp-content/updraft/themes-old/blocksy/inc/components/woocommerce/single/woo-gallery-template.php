<?php

// Note: `wc_get_gallery_image_html` was added in WC 3.3.2 and did not exist prior. This check protects against theme overrides being used on older versions of WC.
if (! function_exists('wc_get_gallery_image_html')) {
	return;
}

global $blocksy_current_variation;

if (! isset($product)) {
	global $product;
} else {
	$temp_product = $product;
	global $product;
	$product = $temp_product;
}

if ($product->get_type() === 'variable') {
	$maybe_variation = (new \WC_Product_Data_Store_CPT())->find_matching_product_variation(
		$product,
		$_GET
	);

	if ($maybe_variation) {
		$blocksy_current_variation = wc_get_product($maybe_variation);
	}
}

$is_single = is_single();

if (isset($forced_single) && $forced_single) {
	$is_single = true;
}

$columns = apply_filters( 'woocommerce_product_thumbnails_columns', 4 );
$post_thumbnail_id = $product->get_image_id();
$wrapper_classes = apply_filters('woocommerce_single_product_image_gallery_classes', array(
	'woocommerce-product-gallery',
	'woocommerce-product-gallery--' . ($product->get_image_id() ? 'with-images' : 'without-images'),
	'woocommerce-product-gallery--columns-' . absint($columns),
	'images',
));

if (! isset($gallery_images)) {
	$thumb_id = apply_filters(
		'woocommerce_product_get_image_id',
		get_post_thumbnail_id($product->get_id()),
		$product
	);

	$thumb_id = get_post_thumbnail_id($product->get_id());

	$gallery_images = $product->get_gallery_image_ids();

	if ($thumb_id) {
		array_unshift($gallery_images, intval($thumb_id));
	} else {
		$gallery_images = [null];
	}
}

if ($blocksy_current_variation) {
	$variation_gallery_images = array_filter(explode(',', get_post_meta(
		$blocksy_current_variation->get_id(),
		'_wc_additional_variation_images',
		true
	)), 'wp_get_attachment_url');

	if (! empty($variation_gallery_images)) {
		$gallery_images = $variation_gallery_images;
		$variation_main_image = $blocksy_current_variation->get_image_id();

		if (! empty($variation_main_image)) {
			array_unshift($gallery_images, $variation_main_image);
		}

		$product_view_attr['data-current-variation'] = $blocksy_current_variation->get_id();
	}
}

$gallery_images = apply_filters(
	'blocksy:woocommerce:product-view:product_gallery_images',
	$gallery_images
);

$ratio = '3/4';
$single_ratio = get_theme_mod('product_gallery_ratio', '3/4');

global $blocksy_is_quick_view;

$product_view_attr = [
	'class' => 'woocommerce-product-gallery'
];

if (! $blocksy_is_quick_view) {
	$product_view_attr = apply_filters(
		'blocksy:woocommerce:product-view:attr',
		$product_view_attr
	);
}

echo '<div ' . blocksy_attr_to_html($product_view_attr) . '>';

$maybe_custom_content = null;


if (! $blocksy_is_quick_view) {
	$maybe_custom_content = apply_filters(
		'blocksy:woocommerce:product-view:content',
		null,
		$product,
		$gallery_images
	);
}

do_action('blocksy:woocommerce:product-view:start');

$gallery_actions = [];

if (
	get_theme_mod('has_product_single_lightbox', 'no') === 'yes'
	&&
	get_theme_mod('has_product_single_zoom', 'yes') === 'yes'
	&&
	! isset($blocksy_is_quick_view)
	&&
	! $blocksy_is_quick_view
	&&
	isset($gallery_images[0])
	&&
	$gallery_images[0]
	&&
	! $maybe_custom_content
	&&
	apply_filters('blocksy:woocommerce:product-review:has-gallery-zoom-trigger', true)
) {
	$gallery_actions[] = '<a href="#" class="woocommerce-product-gallery__trigger">🔍</a>';
}

if (! empty($gallery_actions)) {
	// echo '<div class="ct-gallery-actions">';
	echo implode(' ', $gallery_actions);
	// echo '</div>';
}

$default_ratio = apply_filters('blocksy:woocommerce:default_product_ratio', '3/4');

if (! $maybe_custom_content && count($gallery_images) === 1) {
	$attachment_id = $gallery_images[0];

	$image_href = wp_get_attachment_image_src(
		$attachment_id,
		'full'
	);

	$width = null;
	$height = null;

	if ($image_href) {
		$width = $image_href[1];
		$height = $image_href[2];

		$image_href = $image_href[0];
	}

	echo blocksy_image([
		'no_image_type' => 'woo',
		'attachment_id' => $gallery_images[0],
		'size' => 'woocommerce_single',
		'ratio' => $is_single ? $single_ratio : $default_ratio,
		'tag_name' => 'a',
		'size' => 'woocommerce_single',
		'html_atts' => array_merge([
			'href' => $image_href
		], $width ? [
			'data-width' => $width,
			'data-height' => $height
		] : []),
	]);
}


if (! $maybe_custom_content && count($gallery_images) > 1) {
	echo blocksy_flexy(
		apply_filters(
			'blocksy:woocommerce:single_product:flexy-args',
			[
				'images' => $gallery_images,
				'size' => 'woocommerce_single',
				'pills_images' => $is_single ? $gallery_images : null,
				'images_ratio' => $is_single ? $single_ratio : $default_ratio
			]
		)
	);
}

if ($maybe_custom_content) {
	echo $maybe_custom_content;
}

do_action('blocksy:woocommerce:product-view:end');
do_action('woocommerce_product_thumbnails');

echo '</div>';


