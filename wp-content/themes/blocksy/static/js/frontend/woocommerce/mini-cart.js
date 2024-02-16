import $ from 'jquery'
import { markImagesAsLoaded } from '../lazy-load-helpers'
import ctEvents from 'ct-events'

const scheduleLoad = () => {
	;[...document.querySelectorAll('.ct-header-cart')].map((singleCart) => {
		setTimeout(() => {
			markImagesAsLoaded(singleCart)
		})

		if (document.querySelector('#woo-cart-panel')) {
			markImagesAsLoaded(document.querySelector('#woo-cart-panel'))
		}
	})
}

let mounted = false

export const mount = () => {
	if (!$) return

	const selector = '.ct-header-cart'

	if (mounted) {
		return
	}

	mounted = true

	scheduleLoad()

	$(document.body).on('adding_to_cart', () =>
		[...document.querySelectorAll(selector)].map((cart) => {
			cart.firstElementChild.classList.remove('ct-added')
			cart.firstElementChild.classList.add('ct-adding')
		})
	)

	$(document.body).on('wc_fragments_loaded', () => {
		setTimeout(() => ctEvents.trigger('ct:images:lazyload:update'))
		setTimeout(() => ctEvents.trigger('ct:popper-elements:update'))
		setTimeout(() => ctEvents.trigger('blocksy:frontend:init'))
	})

	$(document.body).on('wc_fragments_refreshed', () => {
		scheduleLoad()
	})

	$(document.body).on(
		'added_to_cart',
		(_, fragments, __, button, quantity) => {
			button = button[0]
			;[...document.querySelectorAll(selector)].map((cart, index) => {
				cart.firstElementChild.classList.remove('ct-adding')
				cart.firstElementChild.classList.add('ct-added')

				if (
					!button.closest('.quick-view-modal') &&
					index === 0 &&
					((!document.body.classList.contains('single-product') &&
						cart.querySelector('[data-auto-open*="archive"]')) ||
						(document.body.classList.contains('single-product') &&
							cart.querySelector('[data-auto-open*="product"]')))
				) {
					setTimeout(() => {
						cart.querySelector('[data-auto-open]').click()
					}, 500)
				}

				if (document.querySelector('.ct-cart-content')) {
					if (cart.querySelector('.ct-cart-content')) {
						cart.querySelector(
							'.ct-cart-content'
						).innerHTML = Object.values(fragments)[0]

						if (
							cart.querySelector('.ct-cart-total') &&
							cart.querySelector(
								'.ct-cart-content .woocommerce-mini-cart__total .woocommerce-Price-amount'
							)
						) {
							cart.querySelector(
								'.ct-cart-total'
							).firstElementChild.innerHTML = cart.querySelector(
								'.ct-cart-content .woocommerce-mini-cart__total .woocommerce-Price-amount'
							).innerHTML
						}
					}

					markImagesAsLoaded(cart)
				}

				scheduleLoad()
			})
		}
	)

	$(document.body).on('removed_from_cart', (_, __, ___, button) =>
		[...document.querySelectorAll(selector)].map((cart) => {
			if (!button) return

			try {
				button[0]
					.closest('li')
					.parentNode.removeChild(button[0].closest('li'))
			} catch (e) {}
		})
	)
}
