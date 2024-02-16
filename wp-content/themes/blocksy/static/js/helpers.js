import ctEvents from 'ct-events'

const loadSingleEntryPoint = ({
	els,
	events,
	forcedEvents,
	load,
	mount,
	condition,
	trigger,
}) => {
	if (!els) {
		els = []
	}

	if (!events) {
		events = []
	}

	if (!forcedEvents) {
		forcedEvents = []
	}

	if (!trigger) {
		trigger = []
	}

	if (!mount) {
		mount = ({ mount, el, ...everything }) =>
			el ? mount(el, everything) : mount()
	}

	if (els && {}.toString.call(els) === '[object Function]') {
		els = els()
	}

	const allEls = (Array.isArray(els) ? els : [els]).reduce(
		(a, selector) => [
			...a,
			...(Array.isArray(selector)
				? selector
				: document.querySelectorAll(selector)),
		],
		[]
	)

	if (allEls.length === 0) {
		return
	}

	if (
		condition &&
		!condition({
			els,
			allEls,
		})
	) {
		return
	}

	if (trigger.length > 0) {
		if (trigger.includes('click')) {
			allEls.map((el) => {
				if (el.hasLazyLoadClickListener) {
					return
				}

				el.hasLazyLoadClickListener = true

				el.addEventListener('click', (event) => {
					event.preventDefault()
					load().then((arg) => mount({ ...arg, event, el }))
				})
			})
		}

		if (trigger.includes('input')) {
			allEls.map((el) => {
				if (el.hasLazyLoadInputListener) {
					return
				}

				el.hasLazyLoadInputListener = true

				el.addEventListener(
					'input',
					(event) => load().then((arg) => mount({ ...arg, el })),
					{ once: true }
				)
			})
		}

		if (trigger.includes('hover')) {
			allEls.map((el) => {
				if (el.hasLazyLoadMouseOverListener) {
					return
				}

				el.hasLazyLoadMouseOverListener = true

				el.addEventListener(
					'mouseover',
					(event) =>
						load().then((arg) => mount({ ...arg, event, el })),
					{ once: true }
				)
			})
		}
	} else {
		load().then((arg) =>
			allEls.map((el) => {
				mount({ ...arg, el })
			})
		)
	}
}

export const onDocumentLoaded = (cb) => {
	if (/comp|inter|loaded/.test(document.readyState)) {
		cb()
	} else {
		document.addEventListener('DOMContentLoaded', cb, false)
	}
}

export const handleEntryPoints = (mountEntryPoints, args) => {
	const { immediate = false, skipEvents = false } = args || {}

	const loadInitialEntryPoints = () =>
		mountEntryPoints
			.filter(({ onLoad = true }) => !!onLoad)
			.map(loadSingleEntryPoint)

	if (immediate) {
		loadInitialEntryPoints()
	} else {
		onDocumentLoaded(loadInitialEntryPoints)
	}

	if (skipEvents) {
		return
	}

	;[
		...new Set(
			mountEntryPoints.reduce(
				(currentEvents, entry) => [
					...currentEvents,
					...(entry.events || []),
					...(entry.forcedEvents || []),
				],
				[]
			)
		),
	].map((distinctEvent) =>
		ctEvents.on(distinctEvent, () => {
			mountEntryPoints
				.filter(({ events = [] }) => events.indexOf(distinctEvent) > -1)
				.map(loadSingleEntryPoint)

			mountEntryPoints
				.filter(
					({ forcedEvents = [] }) =>
						forcedEvents.indexOf(distinctEvent) > -1
				)
				.map((entry) =>
					loadSingleEntryPoint({
						...entry,
						els: ['body'],
					})
				)
		})
	)
}
