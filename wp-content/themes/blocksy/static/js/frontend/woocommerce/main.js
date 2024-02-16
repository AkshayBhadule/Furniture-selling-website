import { mount as mountMiniCart } from './mini-cart'

export const wooEntryPoints = [
	{
		els:
			'body.single-product .woocommerce-product-gallery, body.single-product form.cart',
		condition: () =>
			!!document.querySelector(
				'.woocommerce-product-gallery .ct-image-container'
			),
		load: () => import('./single-product-gallery'),
		forcedEvents: ['ct:flexy:update'],
		trigger: ['hover'],
	},

	{
		els: '.quantity',
		load: () => import('./quantity-input'),
		forcedEvents: ['ct:add-to-cart:quantity'],
		trigger: ['hover'],
	},

	{
		els: '.ct-ajax-add-to-cart',
		load: () => import('./add-to-cart-single'),
		forcedEvents: ['ct:flexy:update'],
		trigger: ['hover'],
	},

	{
		els: '.ct-header-cart',
		load: () => new Promise((r) => r({ mount: mountMiniCart })),
		events: ['ct:header:update'],
	},
]
