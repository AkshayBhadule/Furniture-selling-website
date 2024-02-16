import $ from 'jquery'
import ctEvents from 'ct-events'

function isTouchDevice() {
	try {
		document.createEvent('TouchEvent')
		return true
	} catch (e) {
		return false
	}
}

export const mount = (el, { event: mountEvent }) => {
	const wc_single_product_params = {
		i18n_required_rating_text: 'Please select a rating',
		review_rating_required: 'yes',
		flexslider: {
			rtl: false,
			animation: 'slide',
			smoothHeight: true,
			directionNav: false,
			controlNav: 'thumbnails',
			slideshow: false,
			animationSpeed: 500,
			animationLoop: false,
			allowOneSlide: false,
		},
		zoom_enabled: '',
		zoom_options: [],
		photoswipe_enabled: '1',
		photoswipe_options: {
			shareEl: false,
			closeOnScroll: false,
			history: false,
			hideAnimationDuration: 0,
			showAnimationDuration: 0,
		},
		flexslider_enabled: '1',
	}

	const openPhotoswipeFor = (el, index = null) => {
		var pswpElement = $('.pswp')[0],
			eventTarget = $(el),
			clicked = eventTarget

		const items = [
			...el
				.closest('.woocommerce-product-gallery')
				.querySelectorAll(
					'.flexy-items .ct-image-container img:not(.zoomImg), .woocommerce-product-gallery > .ct-image-container img:not(.zoomImg)'
				),
		].map((img) => ({
			img,
			src: img.closest('a') ? img.closest('a').href : img.src,
			w:
				(img.closest('a')
					? img.closest('a').dataset.width
					: img.width) || img.width,
			h:
				(img.closest('a')
					? img.closest('a').dataset.height
					: img.width) || img.width,
			title: img.getAttribute('title'),
		}))

		if (
			items.length === 1 &&
			items[0].img.closest('a') &&
			!items[0].img.closest('a').getAttribute('href')
		) {
			return
		}

		var options = $.extend(
			{
				index: index === 0 ? 0 : index || $(clicked).index(),
				addCaptionHTMLFn: function (item, captionEl) {
					if (!item.title) {
						captionEl.children[0].textContent = ''
						return false
					}
					captionEl.children[0].textContent = item.title
					return true
				},
			},
			wc_single_product_params.photoswipe_options
		)

		// Initializes and opens PhotoSwipe.
		var photoswipe = new PhotoSwipe(
			pswpElement,
			PhotoSwipeUI_Default,
			items,
			options
		)

		photoswipe.init()
	}

	const renderPhotoswipe = ({ onlyZoom = false } = {}) => {
		let maybeTrigger = [
			...document.querySelectorAll(
				'.woocommerce-product-gallery .woocommerce-product-gallery__trigger'
			),
		]

		;[
			...document.querySelectorAll(
				'.single-product .flexy-items .ct-image-container, .single-product .woocommerce-product-gallery > .ct-image-container'
			),
		].map((el) => {
			if (
				((wp.customize &&
					wp.customize('has_product_single_lightbox') &&
					wp.customize('has_product_single_lightbox')() === 'yes') ||
					!wp.customize) &&
				!onlyZoom
			) {
				if (!el.hasPhotoswipeListener) {
					el.hasPhotoswipeListener = true
					el.addEventListener('click', (e) => {
						e.preventDefault()

						if (maybeTrigger.length > 0) {
							return
						}

						let activeIndex = 0

						if (el.closest('.flexy-items')) {
							activeIndex = [
								...el.closest('.flexy-items').children,
							].indexOf(el.parentNode)
						}

						window.PhotoSwipe && openPhotoswipeFor(el, activeIndex)
					})
				}
			}

			if ($.fn.zoom) {
				if (
					(wp.customize &&
						wp.customize('has_product_single_zoom') &&
						wp.customize('has_product_single_zoom')() === 'yes') ||
					!wp.customize
				) {
					const rect = el.getBoundingClientRect()

					$(el).zoom({
						url: el.href,
						touch: false,
						duration: 50,

						...(rect.width > parseFloat(el.dataset.width) ||
						rect.height > parseFloat(el.dataset.height)
							? {
									magnify: 2,
							  }
							: {}),

						...(isTouchDevice()
							? {
									on: 'toggle',
							  }
							: {}),
					})

					setTimeout(() => {
						/*
						if (
							mountEvent.target.closest('.flexy-items') ||
							(mountEvent.target.closest('.ct-image-container') &&
								mountEvent.target
									.closest('.ct-image-container')
									.parentNode.classList.contains(
										'woocommerce-product-gallery'
									))
						) {
							$(el).trigger('mouseenter.zoom')
						}
                        */
					})
				}
			}
		})

		maybeTrigger.map((maybeTrigger) => {
			if (maybeTrigger.hasPhotoswipeListener) {
				return
			}

			maybeTrigger.hasPhotoswipeListener = true

			maybeTrigger.addEventListener('click', (e) => {
				e.preventDefault()
				e.stopPropagation()

				if (maybeTrigger.closest('.ct-image-container')) {
					window.PhotoSwipe &&
						openPhotoswipeFor(
							maybeTrigger.closest('.ct-image-container')
						)

					return
				}

				if (
					document.querySelector(
						'.single-product .woocommerce-product-gallery > .ct-image-container'
					)
				) {
					window.PhotoSwipe &&
						openPhotoswipeFor(
							document.querySelector(
								'.single-product .woocommerce-product-gallery > .ct-image-container'
							)
						)
				}

				if (
					document.querySelector(
						'.single-product .flexy-items .ct-image-container'
					)
				) {
					let pills = document.querySelector(
						'.single-product .flexy-pills'
					)

					let activeIndex = Array.from(
						pills.querySelector('.active').parentNode.children
					).indexOf(
						pills.querySelector('.active') ||
							pills.firstElementChild
					)

					window.PhotoSwipe &&
						openPhotoswipeFor(
							document.querySelector(
								'.single-product .flexy-items'
							).children[activeIndex].firstElementChild,

							activeIndex
						)
				}
			})
		})
	}

	renderPhotoswipe()

	if (!$ || !$.fn || !$.fn.wc_variations_image_update) {
		return
	}

	const old = $.fn.wc_variations_image_update

	const handleVariationChange = ({ context, variation, args }) => {
		if (
			context[0]
				.closest('.single-product')
				.querySelector(
					'.woocommerce-product-gallery > .ct-image-container'
				)
		) {
			/**
			 * One image
			 */
			let imageContainer = context[0]
				.closest('.single-product')
				.querySelector(
					'.woocommerce-product-gallery > .ct-image-container'
				)

			if (imageContainer.querySelector('.zoomImg')) {
				imageContainer.querySelector('.zoomImg').remove()
			}

			if (!variation) {
				let img = imageContainer.querySelector('img')

				if (
					img &&
					imageContainer.querySelector('.ct-variation-image')
				) {
					img.remove()
				} else {
					imageContainer.href =
						imageContainer.dataset.originalHref ||
						imageContainer.href
					if (img.dataset.originalSrc || img.src) {
						img.src = img.dataset.originalSrc || img.src
					}
					if (img.dataset.originalSrcSet || img.srcset) {
						img.srcset = img.dataset.originalSrcSet || img.srcset
					}
					if (img.dataset.originalSizes || img.sizes) {
						img.sizes = img.dataset.originalSizes || img.sizes
					}
				}
			} else {
				if (
					variation.image &&
					variation.image.src &&
					variation.image.src.length > 0
				) {
					let img = imageContainer.querySelector('img')

					if (!imageContainer.querySelector('img')) {
						img = document.createElement('img')
						img.classList.add('ct-variation-image')
					}

					if (
						!img.classList.contains('ct-variation-image') &&
						!img.dataset.originalSrc
					) {
						imageContainer.dataset.originalHref =
							imageContainer.href
						if (img.src) {
							img.dataset.originalSrc = img.src
						}
						if (img.srcset) {
							img.dataset.originalSrcSet = img.srcset
						}
						if (img.sizes) {
							img.dataset.originalSizes = img.sizes
						}
					}

					imageContainer.href = variation.image.full_src

					if (variation.image.srcset) {
						img.srcset = variation.image.srcset
					}
					if (variation.image.sizes) {
						img.sizes = variation.image.sizes
					}
					img.src = variation.image.src

					imageContainer.appendChild(img)
				}
			}

			renderPhotoswipe({ onlyZoom: true })

			old && old.apply(context, args)
			return
		}

		/**
		 * Gallery
		 */
		if (
			!context[0].closest('.single-product').querySelector('.flexy-pills')
		) {
			old && old.apply(context, args)
			return
		}

		const slideToFirst = () => {
			if (
				!context[0]
					.closest('.single-product')
					.querySelector('.flexy-container').dataset.flexy
			) {
				context[0]
					.closest('.single-product')
					.querySelector('.flexy-pills > *')
					.firstElementChild.click()
			}
		}

		const resetView = () => {
			let pill = context[0]
				.closest('.single-product')
				.querySelector('.flexy-pills [data-original-src]')

			let slide = context[0]
				.closest('.single-product')
				.querySelector('.flexy-items [data-original-src]')

			if (!pill) {
				return
			}

			pill.parentNode.href =
				pill.parentNode.dataset.originalHref || pill.parentNode.href
			if (pill.dataset.originalSrc || pill.src) {
				pill.src = pill.dataset.originalSrc || pill.src
			}
			if (pill.dataset.originalSrcSet || pill.srcset) {
				pill.srcset = pill.dataset.originalSrcSet || pill.srcset
			}
			if (pill.dataset.originalSizes || pill.sizes) {
				pill.sizes = pill.dataset.originalSizes || pill.sizes
			}

			slide.parentNode.href =
				slide.parentNode.dataset.originalHref || slide.parentNode.href
			if (slide.dataset.originalSrc || slide.src) {
				slide.src = slide.dataset.originalSrc || slide.src
			}
			if (slide.dataset.originalSrcSet || slide.srcset) {
				slide.srcset = slide.dataset.originalSrcSet || slide.srcset
			}
			if (slide.dataset.originalSizes || slide.sizes) {
				slide.sizes = slide.dataset.originalSizes || slide.sizes
			}
		}

		if (!variation) {
			slideToFirst()
			resetView()
			;[
				...context[0]
					.closest('.single-product')
					.querySelectorAll('.zoomImg'),
			].map((el) => el.remove())

			renderPhotoswipe({ onlyZoom: true })

			old && old.apply(context, args)
			return
		}

		resetView()

		const maybePillImage = context[0]
			.closest('.single-product')
			.querySelector(`.flexy-items [srcset*="${variation.image.src}"]`)
		if (maybePillImage) {
			const pill = context[0]
				.closest('.single-product')
				.querySelector(`.flexy-pills > *`).children[
				[
					...context[0]
						.closest('.single-product')
						.querySelector(`.flexy-items`).children,
				].indexOf(maybePillImage.closest('div'))
			]

			pill && pill.click()
		} else {
			slideToFirst()

			let pill = context[0]
				.closest('.single-product')
				.querySelector('.flexy-pills > *').firstElementChild
				.firstElementChild

			if (
				context[0]
					.closest('.single-product')
					.querySelector(`.flexy-pills[data-type="circle"]`)
			) {
				pill = context[0]
					.closest('.single-product')
					.querySelector('.flexy-pills > *').firstElementChild
			}

			let slide = context[0]
				.closest('.single-product')
				.querySelector('.flexy-items')
				.firstElementChild.querySelector('.ct-image-container img')

			if (!pill.dataset.originalSrc) {
				pill.parentNode.dataset.originalHref = pill.parentNode.href
				pill.dataset.originalSrc = pill.src
				pill.dataset.originalSrcSet = pill.srcset
				pill.dataset.originalSizes = pill.sizes

				slide.parentNode.dataset.originalHref = slide.parentNode.href
				slide.dataset.originalSrc = slide.src
				slide.dataset.originalSrcSet = slide.srcset
				slide.dataset.originalSizes = slide.sizes
			}

			pill.parentNode.href = variation.image.full_src
			if (variation.image.srcset) {
				pill.srcset = variation.image.srcset
			}
			if (variation.image.sizes) {
				pill.sizes = variation.image.sizes
			}
			pill.src = variation.image.src

			slide.parentNode.href = variation.image.full_src
			if (variation.image.srcset) {
				slide.srcset = variation.image.srcset
			}
			if (variation.image.sizes) {
				slide.sizes = variation.image.sizes
			}
			slide.src = variation.image.src

			slideToFirst()
		}

		;[
			...context[0]
				.closest('.single-product')
				.querySelectorAll('.zoomImg'),
		].map((el) => el.remove())

		renderPhotoswipe({ onlyZoom: true })

		old && old.apply(context, args)
	}

	$.fn.wc_variations_image_update = function (variation) {
		const currentVariation = document.querySelector(
			'.woocommerce-product-gallery'
		)

		const productId = document
			.querySelector('.type-product')
			.id.replace('product-', '')

		if (
			window.ct_localizations.woo_gallery_replace_on_variation_change &&
			(!currentVariation ||
				parseInt(variation.variation_id) !==
					parseInt(currentVariation.dataset.currentVariation))
		) {
			const body = new FormData()

			body.append('action', 'blocksy_get_product_view_for_variation')
			body.append('variation_id', variation.variation_id)
			body.append('product_id', productId)

			fetch(ct_localizations.ajax_url, {
				method: 'POST',
				body,
			})
				.then((response) => response.json())
				.then(({ success, data }) => {
					if (success) {
						jQuery(currentVariation).replaceWith(data.html)

						setTimeout(() => {
							ctEvents.trigger('blocksy:frontend:init')

							setTimeout(() => {
								handleVariationChange({
									context: this,
									args: arguments,
									variation,
								})
							})
						})

						return
					}

					handleVariationChange({
						context: this,
						args: arguments,
						variation,
					})
				})

			return
		}

		handleVariationChange({
			context: this,
			args: arguments,
			variation,
		})
	}
}
