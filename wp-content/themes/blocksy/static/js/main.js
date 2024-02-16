import './events'
import './public-path.js'
import './frontend/lazy-load'
import './frontend/comments'

import ctEvents from 'ct-events'
import $ from 'jquery'

import { watchLayoutContainerForReveal } from './frontend/animated-element'
import { onDocumentLoaded, handleEntryPoints } from './helpers'

import { mountRenderHeaderLoop } from './frontend/header/render-loop'

import { mount as mountSocialButtons } from './frontend/social-buttons'
import { mount as mountBackToTop } from './frontend/back-to-top-link'
import { mount as mountShareBox } from './frontend/share-box'

import { getCurrentScreen } from './frontend/helpers/current-screen'
import { mountDynamicChunks } from './dynamic-chunks'

import { menuEntryPoints } from './frontend/entry-points/menus'
import { liveSearchEntryPoints } from './frontend/entry-points/live-search'
import { wooEntryPoints } from './frontend/woocommerce/main'

/**
 * iOS hover fix
 */
document.addEventListener('click', (x) => 0)

export const areWeDealingWithSafari = /apple/i.test(navigator.vendor)

if (areWeDealingWithSafari) {
	document.querySelector('html').dataset.browser = 'safari'
}

export { getCurrentScreen } from './frontend/helpers/current-screen'

export const allFrontendEntryPoints = [
	...menuEntryPoints,
	...liveSearchEntryPoints,
	...wooEntryPoints,

	{
		els: '#main [data-sticky]',
		load: () => import('./frontend/sticky'),
		condition: () => areWeDealingWithSafari,
	},

	{
		els: '[data-parallax]',
		load: () => import('./frontend/parallax/register-listener'),
		events: ['blocksy:parallax:init'],
	},

	{
		els: '.flexy-container[data-flexy*="no"]',
		load: () => import('./frontend/flexy'),
		events: ['ct:flexy:update'],
		trigger: ['hover'],
	},

	{
		els: '.ct-share-box [data-network]',
		load: () => new Promise((r) => r({ mount: mountSocialButtons })),
	},

	{
		els: [
			...(document.querySelector('.ct-header-cart > .ct-cart-content')
				? ['.ct-header-cart > .ct-cart-item']
				: []),
			'.ct-language-switcher > .ct-active-language',
		],

		load: () => import('./frontend/popper-elements'),
		trigger: ['hover'],
		events: ['ct:popper-elements:update'],
	},

	{
		els: '.ct-back-to-top',
		load: () => new Promise((r) => r({ mount: mountBackToTop })),
		events: ['ct:back-to-top:mount'],
	},

	{
		els: '.ct-share-box[data-type="type-2"]',
		load: () => new Promise((r) => r({ mount: mountShareBox })),
	},

	{
		els: '.ct-pagination:not([data-pagination="simple"])',
		load: () => import('./frontend/layouts/infinite-scroll'),
	},

	{
		els: ['.entries[data-layout]', '[data-products].products'],
		load: () =>
			new Promise((r) => r({ mount: watchLayoutContainerForReveal })),
	},

	{
		els: ['.ct-modal-action', '.ct-header-search'],
		load: () => import('./frontend/overlay'),
		events: ['ct:header:update'],
		trigger: ['click'],
	},
]

handleEntryPoints(allFrontendEntryPoints)

const initOverlayTrigger = () => {
	;[
		...document.querySelectorAll('.ct-header-trigger'),
		...document.querySelectorAll('.ct-offcanvas-trigger'),
	].map((menuToggle) => {
		if (menuToggle && !menuToggle.hasListener) {
			menuToggle.hasListener = true

			menuToggle.addEventListener('click', (event) => {
				event.preventDefault()

				if (!menuToggle.hash) {
					return
				}

				let offcanvas = document.querySelector(menuToggle.hash)

				if (!offcanvas) {
					return
				}

				if (!offcanvas.hasListener) {
					offcanvas.hasListener = true

					offcanvas.addEventListener('click', (event) => {
						if (event.target && event.target.matches('a')) {
							const menuToggle = document.querySelector(
								'.ct-header-trigger'
							)

							if (
								event.target.closest('.woocommerce-mini-cart')
							) {
								return
							}

							menuToggle && menuToggle.click()
						}
					})
				}

				import('./frontend/overlay').then(({ handleClick }) =>
					handleClick(event, {
						container: offcanvas,
						computeScrollContainer: () =>
							offcanvas.querySelector('.cart_list')
								? offcanvas.querySelector('.cart_list')
								: getCurrentScreen() === 'mobile' &&
								  offcanvas.querySelector(
										'[data-device="mobile"]'
								  )
								? offcanvas.querySelector(
										'[data-device="mobile"]'
								  )
								: offcanvas.querySelector('.ct-panel-content'),
					})
				)
			})
		}
	})
}

if ($) {
	$(document.body).on('wc_fragments_refreshed', () => {
		setTimeout(() => {
			initOverlayTrigger()
			ctEvents.trigger('ct:popper-elements:update')
		})
	})

	$(document.body).on('wc_fragments_loaded', () => {
		setTimeout(() => {
			initOverlayTrigger()
			ctEvents.trigger('ct:popper-elements:update')
		})
	})
}

onDocumentLoaded(() => {
	mountDynamicChunks()
	setTimeout(() => document.body.classList.remove('ct-loading'), 1500)

	setTimeout(() => {
		initOverlayTrigger()
	}, 100)

	mountRenderHeaderLoop()

	if (location.hash) {
		let maybeModal = false
		try {
			let maybeModalLocal = document.querySelector(location.hash)

			if (maybeModalLocal) {
				maybeModal = maybeModalLocal
			}
		} catch (e) {}

		if (maybeModal && maybeModal.classList.contains('ct-panel')) {
			let maybeTrigger = document.querySelector(
				`[href*="${location.hash}"]`
			)

			setTimeout(() => {
				maybeTrigger.click()
			}, 300)
		}
	}
})

ctEvents.on('blocksy:frontend:init', () => {
	handleEntryPoints(allFrontendEntryPoints, {
		immediate: true,
		skipEvents: true,
	})

	mountDynamicChunks()

	initOverlayTrigger()
})

ctEvents.on('ct:overlay:handle-click', ({ e, href, options = {} }) => {
	import('./frontend/overlay').then(({ handleClick }) => {
		handleClick(e, {
			container: document.querySelector(href),
			...options,
		})
	})
})

if ($) {
	$(document).on('uael_quick_view_loader_stop', () => {
		ctEvents.trigger('ct:add-to-cart:quantity')
	})

	$(document).on('facetwp-loaded', () => {
		ctEvents.trigger('ct:custom-select:init')
		ctEvents.trigger('ct:images:lazyload:update')
	})

	$(window).on('wpf_ajax_success', function () {
		ctEvents.trigger('blocksy:frontend:init')
	})

	$(document).on('prdctfltr-reload', function () {
		ctEvents.trigger('blocksy:frontend:init')
	})
}

export { handleEntryPoints, onDocumentLoaded } from './helpers'
export { markImagesAsLoaded } from './frontend/lazy-load-helpers'
export { registerDynamicChunk } from './dynamic-chunks'
