function DeliveryCalculator(options) {
	var Util = {
		makeAsyncPromise: function (promise) {
			var dfd;
			if (promise.state() !== 'pending') {
				dfd = $.Deferred();
				promise.done(function (data) {
					setTimeout(function () {
						dfd.resolve(data);
					}, 0);
				})
					.fail(function (data) {
						setTimeout(function () {
							dfd.reject(data);
						}, 0);
					});
				return dfd.promise();
			}
			else {
				return promise;
			}
		},
		parseJSON: function (string) {
			var result;
			try {
				result = JSON.parse(string);
			}
			catch (e) {}
			return result;
		},
		loadScript: function (source, timeout, id) {
			var script = document.createElement('script'),
				scripts = document.getElementsByTagName('script')[0],
				dfd = $.Deferred();

			id = id || '';
			timeout = timeout || 50;

			script.src = source;
			script.id = id;
			script.async = true;
			script.defer = true;
			scripts.parentNode.insertBefore(script, scripts);

			script.onload = function (event) {
				setTimeout(function () {
					dfd.resolve(event);
				}, timeout);
			};

			script.onerror = function (event) {
				setTimeout(function () {
					dfd.reject(event);
				}, timeout);
			};

			return dfd.promise();
		}
	};

	var YandexMapApi = function (options) {
		this.promise = false;
		this.options = $.extend({}, {
			src: 'http://api-maps.yandex.ru/2.1.41/?lang=ru_RU',
			id: 'yandex-map-api'
		}, options);
	};

	YandexMapApi.prototype = (function () {
		var get,
			initialize;

		initialize = function () {
			var dfd = $.Deferred();
			ymaps.ready(function () {
				dfd.resolve();
			});
			return dfd.promise();
		};

		get = function (timeout) {
			var script = document.getElementById(this.options.id),
				dfd;

			timeout = timeout || 1500;

			if (!script) {
				this.promise = Util.loadScript(this.options.src, 50, this.options.id)
					.then(initialize);
			}
			else if (!this.promise) {
				dfd = $.Deferred();
				setTimeout(function () {
					dfd.resolve();
				}, timeout);
				this.promise = dfd.promise();
			}
			return Util.makeAsyncPromise(this.promise);
		};

		return {
			get: get
		};
	} ());

	function formatPrice(distance) {
		var freeDistance = options.freeDistance || 0;
		var cost = options.cost || 0;
		if (distance <= freeDistance) {
			return 'Бесплатно';
		} else {
			var value = Math.round((distance - freeDistance) * cost);
			var price = isNaN(value) ? '' : value.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб.';

			return price;
		}
	}

	function successMessage(container, destination, price) {
		container.html("<div class='delivery_calc_title'>Стоимость доставки в " + destination + " составит " + price + "</div>");
	}

	function errorMessage(container) {
		container.html("<div class='delivery_error'>Ошибка расчёта стоимости доставки. Введите город!</div>");
	}

	var deliveryCalculatorForm = $(options.form);
	var deliveryCalculatorResult = $(options.result);
	var destinationInput = $(options.destinationInput);
	var departure = {
		type: 'wayPoint',
		point: options.from
	};
	var yandexMapApi = new YandexMapApi();

	yandexMapApi.get()
		.then(function () {
			destinationInput.autocomplete({
				source: function (request, response) {
					var suggest = ymaps.suggest(request.term, {
						results: 10
					});

					suggest.then(function (items) {
						var result = [];

						items.map(function (item, index) {
							result.push({
								id: index,
								label: item.displayName,
								value: item.displayName
							});
						});

						response(result);
					}, function (error) {
						console.error(error);
					});
				},
				select: function (e, ui) {
					destinationInput.val(ui.item.label);
					deliveryCalculatorForm.trigger('submit');

					e.preventDefault();
				}
			});
		});

	deliveryCalculatorForm.on('submit', function () {
		var destination = destinationInput.val();

		ymaps.route([departure, destination])
			.then(function (route) {
				var distance = route.getLength() / 1000;
				var price = formatPrice(distance);

				successMessage(deliveryCalculatorResult, destination, price);
			})
			.catch(function (error) {
				console.error(error);

				errorMessage(deliveryCalculatorResult);
			});

		return false;
	});

	return {};
}
