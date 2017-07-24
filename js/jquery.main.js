 // page init
jQuery(function(){
	initMobileNav();
	initRetinaCover();
	initSlickCarousel();
	initOpenClose();
	initCustomForms();
	initParallax();
	initAnchors();
	initSameHeight();
	initResizableFonts();
});

// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener'
	});
}

function initRetinaCover() {
	jQuery('.bg-stretch').retinaCover();
}

// slick init
function initSlickCarousel() {
	jQuery('.slick-slider').slick({
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		arrows: false,
		fade: true,
		draggable: false,
		accessibility: false,
		adaptiveHeight: true
	});
}


// open-close init
function initOpenClose() {
	jQuery('.open-close').openClose({
		activeClass: 'active',
		opener: '.form-opener',
		slider: '.form-authorization',
		animSpeed: 400,
		hideOnClickOutside: true,
		effect: 'slide'
	});
}

// initialize custom form elements
function initCustomForms() {
	jcf.setOptions('Select', {
		wrapNative: false,
		wrapNativeOnMobile: false
	});
	jcf.replaceAll();
}

//header section parallax init
function initParallax() {
	var win = jQuery(window);
	// set height for lines
	jQuery('.parallax-section').each(function() {
		var section = jQuery(this);
		var line = section.find('.line');
		var button = section.find('.btn');



		function setHeight() {
			line.css({
				height: button.offset().top - line.offset().top + button.outerHeight(true)
			});			
		}
		setHeight();
		win.on('resize orientationchange', setHeight);
	});

	var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
	skrollr.init({
		forceHeight: false,
		smoothScrollingDuration: 400
	});
}

// initialize smooth anchor links
function initAnchors() {
	new SmoothScroll({
		anchorLinks: 'a[href^="#"]:not([href="#"])',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function(){
				totalHeight += jQuery(this).outerHeight();
			});
			return totalHeight;
		}
	});
}

// align blocks height
function initSameHeight() {
	jQuery('div.columns-holder').sameHeight({
		elements: 'div.column',
		flexible: true,
		multiLine: true,
		biggestHeight: true
	});
}

function initResizableFonts() {
	var body = jQuery('html');
	var win = jQuery(window);
	var resizeText = function () {
		// Standard height, for which the body font size is correct
		var preferredFontSize = 62.5; // %
		var preferredSize = 1920 * 768;

		var currentSize = win.width() * win.height();
		var scalePercentage = Math.sqrt(currentSize) / Math.sqrt(preferredSize);
		var newFontSize = preferredFontSize * scalePercentage;
		body.css('font-size', newFontSize + '%');
	};

	win.on('resize orientationchange', resizeText).trigger('resize');
}

/*
 * jQuery retina cover plugin
 */
 ;(function($) {
 	'use strict';

 	var styleRules = {};
 	var templates = {
 		'2x': [
 			'(-webkit-min-device-pixel-ratio: 1.5)',
 			'(min-resolution: 192dpi)',
 			'(min-device-pixel-ratio: 1.5)',
 			'(min-resolution: 1.5dppx)'
 		],
 		'3x': [
 			'(-webkit-min-device-pixel-ratio: 3)',
 			'(min-resolution: 384dpi)',
 			'(min-device-pixel-ratio: 3)',
 			'(min-resolution: 3dppx)'
 		]
 	};

 	function addSimple(imageSrc, media, id) {
 		var style = buildRule(id, imageSrc);

 		addRule(media, style);
 	}

 	function addRetina(imageData, media, id) {
 		var currentRules = templates[imageData[1]].slice();
 		var patchedRules = currentRules;
 		var style = buildRule(id, imageData[0]);

 		if (media !== 'default') {
 			patchedRules = $.map(currentRules, function(ele, i) {
 				return ele + ' and ' + media;
 			});
 		}

 		media = patchedRules.join(',');
 		
 		addRule(media, style);
 	}

 	function buildRule(id, src) {
 		return '#' + id + '{background-image: url("' + src + '");}';
 	}

 	function addRule(media, rule) {
 		var $styleTag = styleRules[media];
 		var styleTagData;
 		var rules = '';

 		if (media === 'default') {
 			rules = rule + ' ';
 		} else {
 			rules = '@media ' + media + '{' + rule + '}';
 		}

 		if (!$styleTag) {
 			styleRules[media] = $('<style>').text(rules).appendTo('head');
 		} else {
 			styleTagData = $styleTag.text();
 			styleTagData = styleTagData.substring(0, styleTagData.length - 2) + ' }' + rule + '}';
 			$styleTag.text(styleTagData);
 		}
 	}

 	$.fn.retinaCover = function() {
 		return this.each(function() {
 			var $block = $(this);
 			var $items = $block.children('[data-srcset]');
 			var id = 'bg-stretch' + Date.now() + (Math.random() * 1000).toFixed(0);

 			if ($items.length) {
 				$block.attr('id', id);

 				$items.each(function() {
 					var $item = $(this);
 					var data = $item.data('srcset').split(', ');
 					var media = $item.data('media') || 'default';
 					var dataLength = data.length;
 					var itemData;
 					var i;

 					for (i = 0; i < dataLength; i++) {
 						itemData = data[i].split(' ');

 						if (itemData.length === 1) {
 							addSimple(itemData[0], media, id);
 						} else {
 							addRetina(itemData, media, id);
 						}
 					}
 				});
 			}

 			$items.detach();
 		});
 	};
 }(jQuery));

 /*
  * Simple Mobile Navigation
  */
 ;(function($) {
 	function MobileNav(options) {
 		this.options = $.extend({
 			container: null,
 			hideOnClickOutside: false,
 			menuActiveClass: 'nav-active',
 			menuOpener: '.nav-opener',
 			menuDrop: '.nav-drop',
 			toggleEvent: 'click',
 			outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
 		}, options);
 		this.initStructure();
 		this.attachEvents();
 	}
 	MobileNav.prototype = {
 		initStructure: function() {
 			this.page = $('html');
 			this.container = $(this.options.container);
 			this.opener = this.container.find(this.options.menuOpener);
 			this.drop = this.container.find(this.options.menuDrop);
 		},
 		attachEvents: function() {
 			var self = this;

 			if(activateResizeHandler) {
 				activateResizeHandler();
 				activateResizeHandler = null;
 			}

 			this.outsideClickHandler = function(e) {
 				if(self.isOpened()) {
 					var target = $(e.target);
 					if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
 						self.hide();
 					}
 				}
 			};

 			this.openerClickHandler = function(e) {
 				e.preventDefault();
 				self.toggle();
 			};

 			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
 		},
 		isOpened: function() {
 			return this.container.hasClass(this.options.menuActiveClass);
 		},
 		show: function() {
 			this.container.addClass(this.options.menuActiveClass);
 			if(this.options.hideOnClickOutside) {
 				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
 			}
 		},
 		hide: function() {
 			this.container.removeClass(this.options.menuActiveClass);
 			if(this.options.hideOnClickOutside) {
 				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
 			}
 		},
 		toggle: function() {
 			if(this.isOpened()) {
 				this.hide();
 			} else {
 				this.show();
 			}
 		},
 		destroy: function() {
 			this.container.removeClass(this.options.menuActiveClass);
 			this.opener.off(this.options.toggleEvent, this.clickHandler);
 			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
 		}
 	};

 	var activateResizeHandler = function() {
 		var win = $(window),
 			doc = $('html'),
 			resizeClass = 'resize-active',
 			flag, timer;
 		var removeClassHandler = function() {
 			flag = false;
 			doc.removeClass(resizeClass);
 		};
 		var resizeHandler = function() {
 			if(!flag) {
 				flag = true;
 				doc.addClass(resizeClass);
 			}
 			clearTimeout(timer);
 			timer = setTimeout(removeClassHandler, 500);
 		};
 		win.on('resize orientationchange', resizeHandler);
 	};

 	$.fn.mobileNav = function(opt) {
 		var args = Array.prototype.slice.call(arguments);
 		var method = args[0];

 		return this.each(function() {
 			var $container = jQuery(this);
 			var instance = $container.data('MobileNav');

 			if (typeof opt === 'object' || typeof opt === 'undefined') {
 				$container.data('MobileNav', new MobileNav($.extend({
 					container: this
 				}, opt)));
 			} else if (typeof method === 'string' && instance) {
 				if (typeof instance[method] === 'function') {
 					args.shift();
 					instance[method].apply(instance, args);
 				}
 			}
 		});
 	};
 }(jQuery));


 /*
  * jQuery Open/Close plugin
  */
 ;(function($) {
 	function OpenClose(options) {
 		this.options = $.extend({
 			addClassBeforeAnimation: true,
 			hideOnClickOutside: false,
 			activeClass: 'active',
 			opener: '.drop-opener',
 			slider: '.slide',
 			animSpeed: 400,
 			effect: 'fade',
 			event: 'click'
 		}, options);
 		this.init();
 	}
 	OpenClose.prototype = {
 		init: function() {
 			if (this.options.holder) {
 				this.findElements();
 				this.attachEvents();
 				this.makeCallback('onInit', this);
 			}
 		},
 		findElements: function() {
 			this.holder = $(this.options.holder);
 			this.opener = this.holder.find(this.options.opener);
 			this.slider = this.holder.find(this.options.slider);
 		},
 		attachEvents: function() {
 			// add handler
 			var self = this;
 			this.eventHandler = function(e) {
 				e.preventDefault();
 				if (self.slider.hasClass(slideHiddenClass)) {
 					self.showSlide();
 				} else {
 					self.hideSlide();
 				}
 			};
 			self.opener.on(self.options.event, this.eventHandler);

 			// hover mode handler
 			if (self.options.event === 'hover') {
 				self.opener.on('mouseenter', function() {
 					if (!self.holder.hasClass(self.options.activeClass)) {
 						self.showSlide();
 					}
 				});
 				self.holder.on('mouseleave', function() {
 					self.hideSlide();
 				});
 			}

 			// outside click handler
 			self.outsideClickHandler = function(e) {
 				if (self.options.hideOnClickOutside) {
 					var target = $(e.target);
 					if (!target.is(self.holder) && !target.closest(self.holder).length) {
 						self.hideSlide();
 					}
 				}
 			};

 			// set initial styles
 			if (this.holder.hasClass(this.options.activeClass)) {
 				$(document).on('click touchstart', self.outsideClickHandler);
 			} else {
 				this.slider.addClass(slideHiddenClass);
 			}
 		},
 		showSlide: function() {
 			var self = this;
 			if (self.options.addClassBeforeAnimation) {
 				self.holder.addClass(self.options.activeClass);
 			}
 			self.slider.removeClass(slideHiddenClass);
 			$(document).on('click touchstart', self.outsideClickHandler);

 			self.makeCallback('animStart', true);
 			toggleEffects[self.options.effect].show({
 				box: self.slider,
 				speed: self.options.animSpeed,
 				complete: function() {
 					if (!self.options.addClassBeforeAnimation) {
 						self.holder.addClass(self.options.activeClass);
 					}
 					self.makeCallback('animEnd', true);
 				}
 			});
 		},
 		hideSlide: function() {
 			var self = this;
 			if (self.options.addClassBeforeAnimation) {
 				self.holder.removeClass(self.options.activeClass);
 			}
 			$(document).off('click touchstart', self.outsideClickHandler);

 			self.makeCallback('animStart', false);
 			toggleEffects[self.options.effect].hide({
 				box: self.slider,
 				speed: self.options.animSpeed,
 				complete: function() {
 					if (!self.options.addClassBeforeAnimation) {
 						self.holder.removeClass(self.options.activeClass);
 					}
 					self.slider.addClass(slideHiddenClass);
 					self.makeCallback('animEnd', false);
 				}
 			});
 		},
 		destroy: function() {
 			this.slider.removeClass(slideHiddenClass).css({
 				display: ''
 			});
 			this.opener.off(this.options.event, this.eventHandler);
 			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
 			$(document).off('click touchstart', this.outsideClickHandler);
 		},
 		makeCallback: function(name) {
 			if (typeof this.options[name] === 'function') {
 				var args = Array.prototype.slice.call(arguments);
 				args.shift();
 				this.options[name].apply(this, args);
 			}
 		}
 	};

 	// add stylesheet for slide on DOMReady
 	var slideHiddenClass = 'js-slide-hidden';
 	(function() {
 		var tabStyleSheet = $('<style type="text/css">')[0];
 		var tabStyleRule = '.' + slideHiddenClass;
 		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
 		if (tabStyleSheet.styleSheet) {
 			tabStyleSheet.styleSheet.cssText = tabStyleRule;
 		} else {
 			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
 		}
 		$('head').append(tabStyleSheet);
 	}());

 	// animation effects
 	var toggleEffects = {
 		slide: {
 			show: function(o) {
 				o.box.stop(true).hide().slideDown(o.speed, o.complete);
 			},
 			hide: function(o) {
 				o.box.stop(true).slideUp(o.speed, o.complete);
 			}
 		},
 		fade: {
 			show: function(o) {
 				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
 			},
 			hide: function(o) {
 				o.box.stop(true).fadeOut(o.speed, o.complete);
 			}
 		},
 		none: {
 			show: function(o) {
 				o.box.hide().show(0, o.complete);
 			},
 			hide: function(o) {
 				o.box.hide(0, o.complete);
 			}
 		}
 	};

 	// jQuery plugin interface
 	$.fn.openClose = function(opt) {
 		var args = Array.prototype.slice.call(arguments);
 		var method = args[0];

 		return this.each(function() {
 			var $holder = jQuery(this);
 			var instance = $holder.data('OpenClose');

 			if (typeof opt === 'object' || typeof opt === 'undefined') {
 				$holder.data('OpenClose', new OpenClose($.extend({
 					holder: this
 				}, opt)));
 			} else if (typeof method === 'string' && instance) {
 				if (typeof instance[method] === 'function') {
 					args.shift();
 					instance[method].apply(instance, args);
 				}
 			}
 		});
 	};
 }(jQuery));

 /*!
  * JavaScript Custom Forms
  *
  * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
  * Released under the MIT license (LICENSE.txt)
  *
  * Version: 1.1.3
  */
 ;(function(root, factory) {

 	'use strict';
 	if (typeof define === 'function' && define.amd) {
 		define(['jquery'], factory);
 	} else if (typeof exports === 'object') {
 		module.exports = factory(require('jquery'));
 	} else {
 		root.jcf = factory(jQuery);
 	}
 }(this, function($) {

 	'use strict';

 	// define version
 	var version = '1.1.3';

 	// private variables
 	var customInstances = [];

 	// default global options
 	var commonOptions = {
 		optionsKey: 'jcf',
 		dataKey: 'jcf-instance',
 		rtlClass: 'jcf-rtl',
 		focusClass: 'jcf-focus',
 		pressedClass: 'jcf-pressed',
 		disabledClass: 'jcf-disabled',
 		hiddenClass: 'jcf-hidden',
 		resetAppearanceClass: 'jcf-reset-appearance',
 		unselectableClass: 'jcf-unselectable'
 	};

 	// detect device type
 	var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
 		isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
 	commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);
 	
 	var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
 	if(isIOS) isIOS = parseFloat(isIOS[2].replace(/_/g, '.'));
 	commonOptions.ios = isIOS;

 	// create global stylesheet if custom forms are used
 	var createStyleSheet = function() {
 		var styleTag = $('<style>').appendTo('head'),
 			styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');

 		// crossbrowser style handling
 		var addCSSRule = function(selector, rules, index) {
 			if (styleSheet.insertRule) {
 				styleSheet.insertRule(selector + '{' + rules + '}', index);
 			} else {
 				styleSheet.addRule(selector, rules, index);
 			}
 		};

 		// add special rules
 		addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
 		addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
 		addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
 		addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');

 		// detect rtl pages
 		var html = $('html'), body = $('body');
 		if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
 			html.addClass(commonOptions.rtlClass);
 		}

 		// handle form reset event
 		html.on('reset', function() {
 			setTimeout(function() {
 				api.refreshAll();
 			}, 0);
 		});

 		// mark stylesheet as created
 		commonOptions.styleSheetCreated = true;
 	};

 	// simplified pointer events handler
 	(function() {
 		var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
 			touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
 			eventList, eventMap = {}, eventPrefix = 'jcf-';

 		// detect events to attach
 		if (pointerEventsSupported) {
 			eventList = {
 				pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
 				pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
 				pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
 				pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
 			};
 		} else {
 			eventList = {
 				pointerover: 'mouseover',
 				pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
 				pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
 				pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
 			};
 		}

 		// create event map
 		$.each(eventList, function(targetEventName, fakeEventList) {
 			$.each(fakeEventList.split(' '), function(index, fakeEventName) {
 				eventMap[fakeEventName] = targetEventName;
 			});
 		});

 		// jQuery event hooks
 		$.each(eventList, function(eventName, eventHandlers) {
 			eventHandlers = eventHandlers.split(' ');
 			$.event.special[eventPrefix + eventName] = {
 				setup: function() {
 					var self = this;
 					$.each(eventHandlers, function(index, fallbackEvent) {
 						if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, commonOptions.isMobileDevice ? {passive: false} : false);
 						else self['on' + fallbackEvent] = fixEvent;
 					});
 				},
 				teardown: function() {
 					var self = this;
 					$.each(eventHandlers, function(index, fallbackEvent) {
 						if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, commonOptions.isMobileDevice ? {passive: false} : false);
 						else self['on' + fallbackEvent] = null;
 					});
 				}
 			};
 		});

 		// check that mouse event are not simulated by mobile browsers
 		var lastTouch = null;
 		var mouseEventSimulated = function(e) {
 			var dx = Math.abs(e.pageX - lastTouch.x),
 				dy = Math.abs(e.pageY - lastTouch.y),
 				rangeDistance = 25;

 			if (dx <= rangeDistance && dy <= rangeDistance) {
 				return true;
 			}
 		};

 		// normalize event
 		var fixEvent = function(e) {
 			var origEvent = e || window.event,
 				touchEventData = null,
 				targetEventName = eventMap[origEvent.type];

 			e = $.event.fix(origEvent);
 			e.type = eventPrefix + targetEventName;

 			if (origEvent.pointerType) {
 				switch (origEvent.pointerType) {
 					case 2: e.pointerType = 'touch'; break;
 					case 3: e.pointerType = 'pen'; break;
 					case 4: e.pointerType = 'mouse'; break;
 					default: e.pointerType = origEvent.pointerType;
 				}
 			} else {
 				e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
 			}

 			if (!e.pageX && !e.pageY) {
 				touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
 				e.pageX = touchEventData.pageX;
 				e.pageY = touchEventData.pageY;
 			}

 			if (origEvent.type === 'touchend') {
 				lastTouch = { x: e.pageX, y: e.pageY };
 			}
 			if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
 				return;
 			} else {
 				return ($.event.dispatch || $.event.handle).call(this, e);
 			}
 		};
 	}());

 	// custom mousewheel/trackpad handler
 	(function() {
 		var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
 			shimEventName = 'jcf-mousewheel';

 		$.event.special[shimEventName] = {
 			setup: function() {
 				var self = this;
 				$.each(wheelEvents, function(index, fallbackEvent) {
 					if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
 					else self['on' + fallbackEvent] = fixEvent;
 				});
 			},
 			teardown: function() {
 				var self = this;
 				$.each(wheelEvents, function(index, fallbackEvent) {
 					if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
 					else self['on' + fallbackEvent] = null;
 				});
 			}
 		};

 		var fixEvent = function(e) {
 			var origEvent = e || window.event;
 			e = $.event.fix(origEvent);
 			e.type = shimEventName;

 			// old wheel events handler
 			if ('detail'      in origEvent) { e.deltaY = -origEvent.detail;      }
 			if ('wheelDelta'  in origEvent) { e.deltaY = -origEvent.wheelDelta;  }
 			if ('wheelDeltaY' in origEvent) { e.deltaY = -origEvent.wheelDeltaY; }
 			if ('wheelDeltaX' in origEvent) { e.deltaX = -origEvent.wheelDeltaX; }

 			// modern wheel event handler
 			if ('deltaY' in origEvent) {
 				e.deltaY = origEvent.deltaY;
 			}
 			if ('deltaX' in origEvent) {
 				e.deltaX = origEvent.deltaX;
 			}

 			// handle deltaMode for mouse wheel
 			e.delta = e.deltaY || e.deltaX;
 			if (origEvent.deltaMode === 1) {
 				var lineHeight = 16;
 				e.delta *= lineHeight;
 				e.deltaY *= lineHeight;
 				e.deltaX *= lineHeight;
 			}

 			return ($.event.dispatch || $.event.handle).call(this, e);
 		};
 	}());

 	// extra module methods
 	var moduleMixin = {
 		// provide function for firing native events
 		fireNativeEvent: function(elements, eventName) {
 			$(elements).each(function() {
 				var element = this, eventObject;
 				if (element.dispatchEvent) {
 					eventObject = document.createEvent('HTMLEvents');
 					eventObject.initEvent(eventName, true, true);
 					element.dispatchEvent(eventObject);
 				} else if (document.createEventObject) {
 					eventObject = document.createEventObject();
 					eventObject.target = element;
 					element.fireEvent('on' + eventName, eventObject);
 				}
 			});
 		},
 		// bind event handlers for module instance (functions beggining with "on")
 		bindHandlers: function() {
 			var self = this;
 			$.each(self, function(propName, propValue) {
 				if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
 					// dont use $.proxy here because it doesn't create unique handler
 					self[propName] = function() {
 						return propValue.apply(self, arguments);
 					};
 				}
 			});
 		}
 	};

 	// public API
 	var api = {
 		version: version,
 		modules: {},
 		getOptions: function() {
 			return $.extend({}, commonOptions);
 		},
 		setOptions: function(moduleName, moduleOptions) {
 			if (arguments.length > 1) {
 				// set module options
 				if (this.modules[moduleName]) {
 					$.extend(this.modules[moduleName].prototype.options, moduleOptions);
 				}
 			} else {
 				// set common options
 				$.extend(commonOptions, moduleName);
 			}
 		},
 		addModule: function(proto) {
 			// add module to list
 			var Module = function(options) {
 				// save instance to collection
 				if (!options.element.data(commonOptions.dataKey)) {
 					options.element.data(commonOptions.dataKey, this);
 				}
 				customInstances.push(this);

 				// save options
 				this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);

 				// bind event handlers to instance
 				this.bindHandlers();

 				// call constructor
 				this.init.apply(this, arguments);
 			};

 			// parse options from HTML attribute
 			var getInlineOptions = function(element) {
 				var dataOptions = element.data(commonOptions.optionsKey),
 					attrOptions = element.attr(commonOptions.optionsKey);

 				if (dataOptions) {
 					return dataOptions;
 				} else if (attrOptions) {
 					try {
 						return $.parseJSON(attrOptions);
 					} catch (e) {
 						// ignore invalid attributes
 					}
 				}
 			};

 			// set proto as prototype for new module
 			Module.prototype = proto;

 			// add mixin methods to module proto
 			$.extend(proto, moduleMixin);
 			if (proto.plugins) {
 				$.each(proto.plugins, function(pluginName, plugin) {
 					$.extend(plugin.prototype, moduleMixin);
 				});
 			}

 			// override destroy method
 			var originalDestroy = Module.prototype.destroy;
 			Module.prototype.destroy = function() {
 				this.options.element.removeData(this.options.dataKey);

 				for (var i = customInstances.length - 1; i >= 0; i--) {
 					if (customInstances[i] === this) {
 						customInstances.splice(i, 1);
 						break;
 					}
 				}

 				if (originalDestroy) {
 					originalDestroy.apply(this, arguments);
 				}
 			};

 			// save module to list
 			this.modules[proto.name] = Module;
 		},
 		getInstance: function(element) {
 			return $(element).data(commonOptions.dataKey);
 		},
 		replace: function(elements, moduleName, customOptions) {
 			var self = this,
 				instance;

 			if (!commonOptions.styleSheetCreated) {
 				createStyleSheet();
 			}

 			$(elements).each(function() {
 				var moduleOptions,
 					element = $(this);

 				instance = element.data(commonOptions.dataKey);
 				if (instance) {
 					instance.refresh();
 				} else {
 					if (!moduleName) {
 						$.each(self.modules, function(currentModuleName, module) {
 							if (module.prototype.matchElement.call(module.prototype, element)) {
 								moduleName = currentModuleName;
 								return false;
 							}
 						});
 					}
 					if (moduleName) {
 						moduleOptions = $.extend({ element: element }, customOptions);
 						instance = new self.modules[moduleName](moduleOptions);
 					}
 				}
 			});
 			return instance;
 		},
 		refresh: function(elements) {
 			$(elements).each(function() {
 				var instance = $(this).data(commonOptions.dataKey);
 				if (instance) {
 					instance.refresh();
 				}
 			});
 		},
 		destroy: function(elements) {
 			$(elements).each(function() {
 				var instance = $(this).data(commonOptions.dataKey);
 				if (instance) {
 					instance.destroy();
 				}
 			});
 		},
 		replaceAll: function(context) {
 			var self = this;
 			$.each(this.modules, function(moduleName, module) {
 				$(module.prototype.selector, context).each(function() {
 					if (this.className.indexOf('jcf-ignore') < 0) {
 						self.replace(this, moduleName);
 					}
 				});
 			});
 		},
 		refreshAll: function(context) {
 			if (context) {
 				$.each(this.modules, function(moduleName, module) {
 					$(module.prototype.selector, context).each(function() {
 						var instance = $(this).data(commonOptions.dataKey);
 						if (instance) {
 							instance.refresh();
 						}
 					});
 				});
 			} else {
 				for (var i = customInstances.length - 1; i >= 0; i--) {
 					customInstances[i].refresh();
 				}
 			}
 		},
 		destroyAll: function(context) {
 			if (context) {
 				$.each(this.modules, function(moduleName, module) {
 					$(module.prototype.selector, context).each(function(index, element) {
 						var instance = $(element).data(commonOptions.dataKey);
 						if (instance) {
 							instance.destroy();
 						}
 					});
 				});
 			} else {
 				while (customInstances.length) {
 					customInstances[0].destroy();
 				}
 			}
 		}
 	};

 	// always export API to the global window object
 	window.jcf = api;

 	return api;
 })); 

  /*!
  * JavaScript Custom Forms : Select Module
  *
  * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
  * Released under the MIT license (LICENSE.txt)
  *
  * Version: 1.1.3
  */
 ;(function($, window) {

 	'use strict';

 	jcf.addModule({
 		name: 'Select',
 		selector: 'select',
 		options: {
 			element: null,
 			multipleCompactStyle: false
 		},
 		plugins: {
 			ListBox: ListBox,
 			ComboBox: ComboBox,
 			SelectList: SelectList
 		},
 		matchElement: function(element) {
 			return element.is('select');
 		},
 		init: function() {
 			this.element = $(this.options.element);
 			this.createInstance();
 		},
 		isListBox: function() {
 			return this.element.is('[size]:not([jcf-size]), [multiple]');
 		},
 		createInstance: function() {
 			if (this.instance) {
 				this.instance.destroy();
 			}
 			if (this.isListBox() && !this.options.multipleCompactStyle) {
 				this.instance = new ListBox(this.options);
 			} else {
 				this.instance = new ComboBox(this.options);
 			}
 		},
 		refresh: function() {
 			var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
 								(!this.isListBox() && this.instance instanceof ListBox);

 			if (typeMismatch) {
 				this.createInstance();
 			} else {
 				this.instance.refresh();
 			}
 		},
 		destroy: function() {
 			this.instance.destroy();
 		}
 	});

 	// combobox module
 	function ComboBox(options) {
 		this.options = $.extend({
 			wrapNative: true,
 			wrapNativeOnMobile: true,
 			fakeDropInBody: true,
 			useCustomScroll: true,
 			flipDropToFit: true,
 			maxVisibleItems: 10,
 			fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
 			fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
 			optionClassPrefix: 'jcf-option-',
 			selectClassPrefix: 'jcf-select-',
 			dropContentSelector: '.jcf-select-drop-content',
 			selectTextSelector: '.jcf-select-text',
 			dropActiveClass: 'jcf-drop-active',
 			flipDropClass: 'jcf-drop-flipped'
 		}, options);
 		this.init();
 	}
 	$.extend(ComboBox.prototype, {
 		init: function() {
 			this.initStructure();
 			this.bindHandlers();
 			this.attachEvents();
 			this.refresh();
 		},
 		initStructure: function() {
 			// prepare structure
 			this.win = $(window);
 			this.doc = $(document);
 			this.realElement = $(this.options.element);
 			this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
 			this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
 			this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
 			makeUnselectable(this.fakeElement);

 			// copy classes from original select
 			this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));

 			// handle compact multiple style
 			if (this.realElement.prop('multiple')) {
 				this.fakeElement.addClass('jcf-compact-multiple');
 			}

 			// detect device type and dropdown behavior
 			if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
 				this.options.wrapNative = true;
 			}

 			if (this.options.wrapNative) {
 				// wrap native select inside fake block
 				this.realElement.prependTo(this.fakeElement).css({
 					position: 'absolute',
 					height: '100%',
 					width: '100%'
 				}).addClass(this.options.resetAppearanceClass);
 			} else {
 				// just hide native select
 				this.realElement.addClass(this.options.hiddenClass);
 				this.fakeElement.attr('title', this.realElement.attr('title'));
 				this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
 			}
 		},
 		attachEvents: function() {
 			// delayed refresh handler
 			var self = this;
 			this.delayedRefresh = function() {
 				setTimeout(function() {
 					self.refresh();
 					if (self.list) {
 						self.list.refresh();
 						self.list.scrollToActiveOption();
 					}
 				}, 1);
 			};

 			// native dropdown event handlers
 			if (this.options.wrapNative) {
 				this.realElement.on({
 					focus: this.onFocus,
 					change: this.onChange,
 					click: this.onChange,
 					keydown: this.onChange
 				});
 			} else {
 				// custom dropdown event handlers
 				this.realElement.on({
 					focus: this.onFocus,
 					change: this.onChange,
 					keydown: this.onKeyDown
 				});
 				this.fakeElement.on({
 					'jcf-pointerdown': this.onSelectAreaPress
 				});
 			}
 		},
 		onKeyDown: function(e) {
 			if (e.which === 13) {
 				this.toggleDropdown();
 			} else if (this.dropActive) {
 				this.delayedRefresh();
 			}
 		},
 		onChange: function() {
 			this.refresh();
 		},
 		onFocus: function() {
 			if (!this.pressedFlag || !this.focusedFlag) {
 				this.fakeElement.addClass(this.options.focusClass);
 				this.realElement.on('blur', this.onBlur);
 				this.toggleListMode(true);
 				this.focusedFlag = true;
 			}
 		},
 		onBlur: function() {
 			if (!this.pressedFlag) {
 				this.fakeElement.removeClass(this.options.focusClass);
 				this.realElement.off('blur', this.onBlur);
 				this.toggleListMode(false);
 				this.focusedFlag = false;
 			}
 		},
 		onResize: function() {
 			if (this.dropActive) {
 				this.hideDropdown();
 			}
 		},
 		onSelectDropPress: function() {
 			this.pressedFlag = true;
 		},
 		onSelectDropRelease: function(e, pointerEvent) {
 			this.pressedFlag = false;
 			if (pointerEvent.pointerType === 'mouse') {
 				this.realElement.focus();
 			}
 		},
 		onSelectAreaPress: function(e) {
 			// skip click if drop inside fake element or real select is disabled
 			var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
 			if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
 				return;
 			}

 			// toggle dropdown visibility
 			this.selectOpenedByEvent = e.pointerType;
 			this.toggleDropdown();

 			// misc handlers
 			if (!this.focusedFlag) {
 				if (e.pointerType === 'mouse') {
 					this.realElement.focus();
 				} else {
 					this.onFocus(e);
 				}
 			}
 			this.pressedFlag = true;
 			this.fakeElement.addClass(this.options.pressedClass);
 			this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
 		},
 		onSelectAreaRelease: function(e) {
 			if (this.focusedFlag && e.pointerType === 'mouse') {
 				this.realElement.focus();
 			}
 			this.pressedFlag = false;
 			this.fakeElement.removeClass(this.options.pressedClass);
 			this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
 		},
 		onOutsideClick: function(e) {
 			var target = $(e.target),
 				clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;

 			if (!clickedInsideSelect) {
 				this.hideDropdown();
 			}
 		},
 		onSelect: function() {
 			this.refresh();

 			if (this.realElement.prop('multiple')) {
 				this.repositionDropdown();
 			} else {
 				this.hideDropdown();
 			}

 			this.fireNativeEvent(this.realElement, 'change');
 		},
 		toggleListMode: function(state) {
 			if (!this.options.wrapNative) {
 				if (state) {
 					// temporary change select to list to avoid appearing of native dropdown
 					this.realElement.attr({
 						size: 4,
 						'jcf-size': ''
 					});
 				} else {
 					// restore select from list mode to dropdown select
 					if (!this.options.wrapNative) {
 						this.realElement.removeAttr('size jcf-size');
 					}
 				}
 			}
 		},
 		createDropdown: function() {
 			// destroy previous dropdown if needed
 			if (this.dropdown) {
 				this.list.destroy();
 				this.dropdown.remove();
 			}

 			// create new drop container
 			this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
 			this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
 			makeUnselectable(this.dropdown);

 			// handle compact multiple style
 			if (this.realElement.prop('multiple')) {
 				this.dropdown.addClass('jcf-compact-multiple');
 			}

 			// set initial styles for dropdown in body
 			if (this.options.fakeDropInBody) {
 				this.dropdown.css({
 					position: 'absolute',
 					top: -9999
 				});
 			}

 			// create new select list instance
 			this.list = new SelectList({
 				useHoverClass: true,
 				handleResize: false,
 				alwaysPreventMouseWheel: true,
 				maxVisibleItems: this.options.maxVisibleItems,
 				useCustomScroll: this.options.useCustomScroll,
 				holder: this.dropdown.find(this.options.dropContentSelector),
 				multipleSelectWithoutKey: this.realElement.prop('multiple'),
 				element: this.realElement
 			});
 			$(this.list).on({
 				select: this.onSelect,
 				press: this.onSelectDropPress,
 				release: this.onSelectDropRelease
 			});
 		},
 		repositionDropdown: function() {
 			var selectOffset = this.fakeElement.offset(),
 				selectWidth = this.fakeElement.outerWidth(),
 				selectHeight = this.fakeElement.outerHeight(),
 				dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
 				winScrollTop = this.win.scrollTop(),
 				winHeight = this.win.height(),
 				calcTop, calcLeft, bodyOffset, needFlipDrop = false;

 			// check flip drop position
 			if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
 				needFlipDrop = true;
 			}

 			if (this.options.fakeDropInBody) {
 				bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
 				if (this.options.flipDropToFit && needFlipDrop) {
 					// calculate flipped dropdown position
 					calcLeft = selectOffset.left;
 					calcTop = selectOffset.top - dropHeight - bodyOffset;
 				} else {
 					// calculate default drop position
 					calcLeft = selectOffset.left;
 					calcTop = selectOffset.top + selectHeight - bodyOffset;
 				}

 				// update drop styles
 				this.dropdown.css({
 					width: selectWidth,
 					left: calcLeft,
 					top: calcTop
 				});
 			}

 			// refresh flipped class
 			this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
 		},
 		showDropdown: function() {
 			// do not show empty custom dropdown
 			if (!this.realElement.prop('options').length) {
 				return;
 			}

 			// create options list if not created
 			if (!this.dropdown) {
 				this.createDropdown();
 			}

 			// show dropdown
 			this.dropActive = true;
 			this.dropdown.appendTo(this.fakeDropTarget);
 			this.fakeElement.addClass(this.options.dropActiveClass);
 			this.refreshSelectedText();
 			this.repositionDropdown();
 			this.list.setScrollTop(this.savedScrollTop);
 			this.list.refresh();

 			// add temporary event handlers
 			this.win.on('resize', this.onResize);
 			this.doc.on('jcf-pointerdown', this.onOutsideClick);
 		},
 		hideDropdown: function() {
 			if (this.dropdown) {
 				this.savedScrollTop = this.list.getScrollTop();
 				this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
 				this.dropdown.removeClass(this.options.flipDropClass).detach();
 				this.doc.off('jcf-pointerdown', this.onOutsideClick);
 				this.win.off('resize', this.onResize);
 				this.dropActive = false;
 				if (this.selectOpenedByEvent === 'touch') {
 					this.onBlur();
 				}
 			}
 		},
 		toggleDropdown: function() {
 			if (this.dropActive) {
 				this.hideDropdown();
 			} else {
 				this.showDropdown();
 			}
 		},
 		refreshSelectedText: function() {
 			// redraw selected area
 			var selectedIndex = this.realElement.prop('selectedIndex'),
 				selectedOption = this.realElement.prop('options')[selectedIndex],
 				selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
 				selectedOptionText = '',
 				selectedOptionClasses,
 				self = this;

 			if (this.realElement.prop('multiple')) {
 				$.each(this.realElement.prop('options'), function(index, option) {
 					if (option.selected) {
 						selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML;
 					}
 				});
 				if (!selectedOptionText) {
 					selectedOptionText = self.realElement.attr('placeholder') || '';
 				}
 				this.selectText.removeAttr('class').html(selectedOptionText);
 			} else if (!selectedOption) {
 				if (this.selectImage) {
 					this.selectImage.hide();
 				}
 				this.selectText.removeAttr('class').empty();
 			} else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
 				selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
 				this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);

 				if (selectedOptionImage) {
 					if (!this.selectImage) {
 						this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
 					}
 					this.selectImage.attr('src', selectedOptionImage).show();
 				} else if (this.selectImage) {
 					this.selectImage.hide();
 				}

 				this.currentSelectedText = selectedOption.innerHTML;
 				this.currentSelectedImage = selectedOptionImage;
 			}
 		},
 		refresh: function() {
 			// refresh fake select visibility
 			if (this.realElement.prop('style').display === 'none') {
 				this.fakeElement.hide();
 			} else {
 				this.fakeElement.show();
 			}

 			// refresh selected text
 			this.refreshSelectedText();

 			// handle disabled state
 			this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
 		},
 		destroy: function() {
 			// restore structure
 			if (this.options.wrapNative) {
 				this.realElement.insertBefore(this.fakeElement).css({
 					position: '',
 					height: '',
 					width: ''
 				}).removeClass(this.options.resetAppearanceClass);
 			} else {
 				this.realElement.removeClass(this.options.hiddenClass);
 				if (this.realElement.is('[jcf-size]')) {
 					this.realElement.removeAttr('size jcf-size');
 				}
 			}

 			// removing element will also remove its event handlers
 			this.fakeElement.remove();

 			// remove other event handlers
 			this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
 			this.realElement.off({
 				focus: this.onFocus
 			});
 		}
 	});

 	// listbox module
 	function ListBox(options) {
 		this.options = $.extend({
 			wrapNative: true,
 			useCustomScroll: true,
 			fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
 			selectClassPrefix: 'jcf-select-',
 			listHolder: '.jcf-list-wrapper'
 		}, options);
 		this.init();
 	}
 	$.extend(ListBox.prototype, {
 		init: function() {
 			this.bindHandlers();
 			this.initStructure();
 			this.attachEvents();
 		},
 		initStructure: function() {
 			this.realElement = $(this.options.element);
 			this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
 			this.listHolder = this.fakeElement.find(this.options.listHolder);
 			makeUnselectable(this.fakeElement);

 			// copy classes from original select
 			this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
 			this.realElement.addClass(this.options.hiddenClass);

 			this.list = new SelectList({
 				useCustomScroll: this.options.useCustomScroll,
 				holder: this.listHolder,
 				selectOnClick: false,
 				element: this.realElement
 			});
 		},
 		attachEvents: function() {
 			// delayed refresh handler
 			var self = this;
 			this.delayedRefresh = function(e) {
 				if (e && e.which === 16) {
 					// ignore SHIFT key
 					return;
 				} else {
 					clearTimeout(self.refreshTimer);
 					self.refreshTimer = setTimeout(function() {
 						self.refresh();
 						self.list.scrollToActiveOption();
 					}, 1);
 				}
 			};

 			// other event handlers
 			this.realElement.on({
 				focus: this.onFocus,
 				click: this.delayedRefresh,
 				keydown: this.delayedRefresh
 			});

 			// select list event handlers
 			$(this.list).on({
 				select: this.onSelect,
 				press: this.onFakeOptionsPress,
 				release: this.onFakeOptionsRelease
 			});
 		},
 		onFakeOptionsPress: function(e, pointerEvent) {
 			this.pressedFlag = true;
 			if (pointerEvent.pointerType === 'mouse') {
 				this.realElement.focus();
 			}
 		},
 		onFakeOptionsRelease: function(e, pointerEvent) {
 			this.pressedFlag = false;
 			if (pointerEvent.pointerType === 'mouse') {
 				this.realElement.focus();
 			}
 		},
 		onSelect: function() {
 			this.fireNativeEvent(this.realElement, 'change');
 			this.fireNativeEvent(this.realElement, 'click');
 		},
 		onFocus: function() {
 			if (!this.pressedFlag || !this.focusedFlag) {
 				this.fakeElement.addClass(this.options.focusClass);
 				this.realElement.on('blur', this.onBlur);
 				this.focusedFlag = true;
 			}
 		},
 		onBlur: function() {
 			if (!this.pressedFlag) {
 				this.fakeElement.removeClass(this.options.focusClass);
 				this.realElement.off('blur', this.onBlur);
 				this.focusedFlag = false;
 			}
 		},
 		refresh: function() {
 			this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
 			this.list.refresh();
 		},
 		destroy: function() {
 			this.list.destroy();
 			this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
 			this.fakeElement.remove();
 		}
 	});

 	// options list module
 	function SelectList(options) {
 		this.options = $.extend({
 			holder: null,
 			maxVisibleItems: 10,
 			selectOnClick: true,
 			useHoverClass: false,
 			useCustomScroll: false,
 			handleResize: true,
 			multipleSelectWithoutKey: false,
 			alwaysPreventMouseWheel: false,
 			indexAttribute: 'data-index',
 			cloneClassPrefix: 'jcf-option-',
 			containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
 			containerSelector: '.jcf-list-content',
 			captionClass: 'jcf-optgroup-caption',
 			disabledClass: 'jcf-disabled',
 			optionClass: 'jcf-option',
 			groupClass: 'jcf-optgroup',
 			hoverClass: 'jcf-hover',
 			selectedClass: 'jcf-selected',
 			scrollClass: 'jcf-scroll-active'
 		}, options);
 		this.init();
 	}
 	$.extend(SelectList.prototype, {
 		init: function() {
 			this.initStructure();
 			this.refreshSelectedClass();
 			this.attachEvents();
 		},
 		initStructure: function() {
 			this.element = $(this.options.element);
 			this.indexSelector = '[' + this.options.indexAttribute + ']';
 			this.container = $(this.options.containerStructure).appendTo(this.options.holder);
 			this.listHolder = this.container.find(this.options.containerSelector);
 			this.lastClickedIndex = this.element.prop('selectedIndex');
 			this.rebuildList();
 		},
 		attachEvents: function() {
 			this.bindHandlers();
 			this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
 			this.listHolder.on('jcf-pointerdown', this.onPress);

 			if (this.options.useHoverClass) {
 				this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
 			}
 		},
 		onPress: function(e) {
 			$(this).trigger('press', e);
 			this.listHolder.on('jcf-pointerup', this.onRelease);
 		},
 		onRelease: function(e) {
 			$(this).trigger('release', e);
 			this.listHolder.off('jcf-pointerup', this.onRelease);
 		},
 		onHoverItem: function(e) {
 			var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
 			this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
 		},
 		onItemPress: function(e) {
 			if (e.pointerType === 'touch' || this.options.selectOnClick) {
 				// select option after "click"
 				this.tmpListOffsetTop = this.list.offset().top;
 				this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
 			} else {
 				// select option immediately
 				this.onSelectItem(e);
 			}
 		},
 		onItemRelease: function(e) {
 			// remove event handlers and temporary data
 			this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);

 			// simulate item selection
 			if (this.tmpListOffsetTop === this.list.offset().top) {
 				this.listHolder.on('click', this.indexSelector, { savedPointerType: e.pointerType }, this.onSelectItem);
 			}
 			delete this.tmpListOffsetTop;
 		},
 		onSelectItem: function(e) {
 			var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
 				pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
 				range;

 			// remove click event handler
 			this.listHolder.off('click', this.indexSelector, this.onSelectItem);

 			// ignore clicks on disabled options
 			if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
 				return;
 			}

 			if (this.element.prop('multiple')) {
 				if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey) {
 					// if CTRL/CMD pressed or touch devices - toggle selected option
 					this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
 				} else if (e.shiftKey) {
 					// if SHIFT pressed - update selection
 					range = [this.lastClickedIndex, clickedIndex].sort(function(a, b) {
 						return a - b;
 					});
 					this.realOptions.each(function(index, option) {
 						option.selected = (index >= range[0] && index <= range[1]);
 					});
 				} else {
 					// set single selected index
 					this.element.prop('selectedIndex', clickedIndex);
 				}
 			} else {
 				this.element.prop('selectedIndex', clickedIndex);
 			}

 			// save last clicked option
 			if (!e.shiftKey) {
 				this.lastClickedIndex = clickedIndex;
 			}

 			// refresh classes
 			this.refreshSelectedClass();

 			// scroll to active item in desktop browsers
 			if (pointerType === 'mouse') {
 				this.scrollToActiveOption();
 			}

 			// make callback when item selected
 			$(this).trigger('select');
 		},
 		rebuildList: function() {
 			// rebuild options
 			var self = this,
 				rootElement = this.element[0];

 			// recursively create fake options
 			this.storedSelectHTML = rootElement.innerHTML;
 			this.optionIndex = 0;
 			this.list = $(this.createOptionsList(rootElement));
 			this.listHolder.empty().append(this.list);
 			this.realOptions = this.element.find('option');
 			this.fakeOptions = this.list.find(this.indexSelector);
 			this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
 			delete this.optionIndex;

 			// detect max visible items
 			var maxCount = this.options.maxVisibleItems,
 				sizeValue = this.element.prop('size');
 			if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
 				maxCount = sizeValue;
 			}

 			// handle scrollbar
 			var needScrollBar = this.fakeOptions.length > maxCount;
 			this.container.toggleClass(this.options.scrollClass, needScrollBar);
 			if (needScrollBar) {
 				// change max-height
 				this.listHolder.css({
 					maxHeight: this.getOverflowHeight(maxCount),
 					overflow: 'auto'
 				});

 				if (this.options.useCustomScroll && jcf.modules.Scrollable) {
 					// add custom scrollbar if specified in options
 					jcf.replace(this.listHolder, 'Scrollable', {
 						handleResize: this.options.handleResize,
 						alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
 					});
 					return;
 				}
 			}

 			// disable edge wheel scrolling
 			if (this.options.alwaysPreventMouseWheel) {
 				this.preventWheelHandler = function(e) {
 					var currentScrollTop = self.listHolder.scrollTop(),
 						maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();

 					// check edge cases
 					if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
 						e.preventDefault();
 					}
 				};
 				this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
 			}
 		},
 		refreshSelectedClass: function() {
 			var self = this,
 				selectedItem,
 				isMultiple = this.element.prop('multiple'),
 				selectedIndex = this.element.prop('selectedIndex');

 			if (isMultiple) {
 				this.realOptions.each(function(index, option) {
 					self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
 				});
 			} else {
 				this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
 				selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
 				if (this.options.useHoverClass) {
 					selectedItem.addClass(this.options.hoverClass);
 				}
 			}
 		},
 		scrollToActiveOption: function() {
 			// scroll to target option
 			var targetOffset = this.getActiveOptionOffset();
 			if (typeof targetOffset === 'number') {
 				this.listHolder.prop('scrollTop', targetOffset);
 			}
 		},
 		getSelectedIndexRange: function() {
 			var firstSelected = -1, lastSelected = -1;
 			this.realOptions.each(function(index, option) {
 				if (option.selected) {
 					if (firstSelected < 0) {
 						firstSelected = index;
 					}
 					lastSelected = index;
 				}
 			});
 			return [firstSelected, lastSelected];
 		},
 		getChangedSelectedIndex: function() {
 			var selectedIndex = this.element.prop('selectedIndex'),
 				targetIndex;

 			if (this.element.prop('multiple')) {
 				// multiple selects handling
 				if (!this.previousRange) {
 					this.previousRange = [selectedIndex, selectedIndex];
 				}
 				this.currentRange = this.getSelectedIndexRange();
 				targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
 				this.previousRange = this.currentRange;
 				return targetIndex;
 			} else {
 				// single choice selects handling
 				return selectedIndex;
 			}
 		},
 		getActiveOptionOffset: function() {
 			// calc values
 			var dropHeight = this.listHolder.height(),
 				dropScrollTop = this.listHolder.prop('scrollTop'),
 				currentIndex = this.getChangedSelectedIndex(),
 				fakeOption = this.fakeOptions.eq(currentIndex),
 				fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
 				fakeOptionHeight = fakeOption.innerHeight();

 			// scroll list
 			if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
 				// scroll down (always scroll to option)
 				return fakeOptionOffset - dropHeight + fakeOptionHeight;
 			} else if (fakeOptionOffset < dropScrollTop) {
 				// scroll up to option
 				return fakeOptionOffset;
 			}
 		},
 		getOverflowHeight: function(sizeValue) {
 			var item = this.fakeListItems.eq(sizeValue - 1),
 				listOffset = this.list.offset().top,
 				itemOffset = item.offset().top,
 				itemHeight = item.innerHeight();

 			return itemOffset + itemHeight - listOffset;
 		},
 		getScrollTop: function() {
 			return this.listHolder.scrollTop();
 		},
 		setScrollTop: function(value) {
 			this.listHolder.scrollTop(value);
 		},
 		createOption: function(option) {
 			var newOption = document.createElement('span');
 			newOption.className = this.options.optionClass;
 			newOption.innerHTML = option.innerHTML;
 			newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

 			var optionImage, optionImageSrc = option.getAttribute('data-image');
 			if (optionImageSrc) {
 				optionImage = document.createElement('img');
 				optionImage.src = optionImageSrc;
 				newOption.insertBefore(optionImage, newOption.childNodes[0]);
 			}
 			if (option.disabled) {
 				newOption.className += ' ' + this.options.disabledClass;
 			}
 			if (option.className) {
 				newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
 			}
 			return newOption;
 		},
 		createOptGroup: function(optgroup) {
 			var optGroupContainer = document.createElement('span'),
 				optGroupName = optgroup.getAttribute('label'),
 				optGroupCaption, optGroupList;

 			// create caption
 			optGroupCaption = document.createElement('span');
 			optGroupCaption.className = this.options.captionClass;
 			optGroupCaption.innerHTML = optGroupName;
 			optGroupContainer.appendChild(optGroupCaption);

 			// create list of options
 			if (optgroup.children.length) {
 				optGroupList = this.createOptionsList(optgroup);
 				optGroupContainer.appendChild(optGroupList);
 			}

 			optGroupContainer.className = this.options.groupClass;
 			return optGroupContainer;
 		},
 		createOptionContainer: function() {
 			var optionContainer = document.createElement('li');
 			return optionContainer;
 		},
 		createOptionsList: function(container) {
 			var self = this,
 				list = document.createElement('ul');

 			$.each(container.children, function(index, currentNode) {
 				var item = self.createOptionContainer(currentNode),
 					newNode;

 				switch (currentNode.tagName.toLowerCase()) {
 					case 'option': newNode = self.createOption(currentNode); break;
 					case 'optgroup': newNode = self.createOptGroup(currentNode); break;
 				}
 				list.appendChild(item).appendChild(newNode);
 			});
 			return list;
 		},
 		refresh: function() {
 			// check for select innerHTML changes
 			if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
 				this.rebuildList();
 			}

 			// refresh custom scrollbar
 			var scrollInstance = jcf.getInstance(this.listHolder);
 			if (scrollInstance) {
 				scrollInstance.refresh();
 			}

 			// refresh selectes classes
 			this.refreshSelectedClass();
 		},
 		destroy: function() {
 			this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
 			this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
 			this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
 			this.listHolder.off('jcf-pointerdown', this.onPress);
 		}
 	});

 	// helper functions
 	var getPrefixedClasses = function(className, prefixToAdd) {
 		return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
 	};
 	var makeUnselectable = (function() {
 		var unselectableClass = jcf.getOptions().unselectableClass;
 		function preventHandler(e) {
 			e.preventDefault();
 		}
 		return function(node) {
 			node.addClass(unselectableClass).on('selectstart', preventHandler);
 		};
 	}());

 }(jQuery, this));

 /*!
  * SmoothScroll module
  */
 ;(function($, exports) {
 	// private variables
 	var page,
 		win = $(window),
 		activeBlock, activeWheelHandler,
 		wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll');

 	// animation handlers
 	function scrollTo(offset, options, callback) {
 		// initialize variables
 		var scrollBlock;
 		if (document.body) {
 			if (typeof options === 'number') {
 				options = {
 					duration: options
 				};
 			} else {
 				options = options || {};
 			}
 			page = page || $('html, body');
 			scrollBlock = options.container || page;
 		} else {
 			return;
 		}

 		// treat single number as scrollTop
 		if (typeof offset === 'number') {
 			offset = {
 				top: offset
 			};
 		}

 		// handle mousewheel/trackpad while animation is active
 		if (activeBlock && activeWheelHandler) {
 			activeBlock.off(wheelEvents, activeWheelHandler);
 		}
 		if (options.wheelBehavior && options.wheelBehavior !== 'none') {
 			activeWheelHandler = function(e) {
 				if (options.wheelBehavior === 'stop') {
 					scrollBlock.off(wheelEvents, activeWheelHandler);
 					scrollBlock.stop();
 				} else if (options.wheelBehavior === 'ignore') {
 					e.preventDefault();
 				}
 			};
 			activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
 		}

 		// start scrolling animation
 		scrollBlock.stop().animate({
 			scrollLeft: offset.left,
 			scrollTop: offset.top
 		}, options.duration, function() {
 			if (activeWheelHandler) {
 				scrollBlock.off(wheelEvents, activeWheelHandler);
 			}
 			if ($.isFunction(callback)) {
 				callback();
 			}
 		});
 	}

 	// smooth scroll contstructor
 	function SmoothScroll(options) {
 		this.options = $.extend({
 			anchorLinks: 'a[href^="#"]', // selector or jQuery object
 			container: null, // specify container for scrolling (default - whole page)
 			extraOffset: null, // function or fixed number
 			activeClasses: null, // null, "link", "parent"
 			easing: 'swing', // easing of scrolling
 			animMode: 'duration', // or "speed" mode
 			animDuration: 800, // total duration for scroll (any distance)
 			animSpeed: 1500, // pixels per second
 			anchorActiveClass: 'anchor-active',
 			sectionActiveClass: 'section-active',
 			wheelBehavior: 'stop', // "stop", "ignore" or "none"
 			useNativeAnchorScrolling: false // do not handle click in devices with native smooth scrolling
 		}, options);
 		this.init();
 	}
 	SmoothScroll.prototype = {
 		init: function() {
 			this.initStructure();
 			this.attachEvents();
 			this.isInit = true;
 		},
 		initStructure: function() {
 			var self = this;

 			this.container = this.options.container ? $(this.options.container) : $('html,body');
 			this.scrollContainer = this.options.container ? this.container : win;
 			this.anchorLinks = jQuery(this.options.anchorLinks).filter(function() {
 				return jQuery(self.getAnchorTarget(jQuery(this))).length;
 			});
 		},
 		getId: function(str) {
 			try {
 				return '#' + str.replace(/^.*?(#|$)/, '');
 			} catch (err) {
 				return null;
 			}
 		},
 		getAnchorTarget: function(link) {
 			// get target block from link href
 			var targetId = this.getId($(link).attr('href'));
 			return $(targetId.length > 1 ? targetId : 'html');
 		},
 		getTargetOffset: function(block) {
 			// get target offset
 			var blockOffset = block.offset().top;
 			if (this.options.container) {
 				blockOffset -= this.container.offset().top - this.container.prop('scrollTop');
 			}

 			// handle extra offset
 			if (typeof this.options.extraOffset === 'number') {
 				blockOffset -= this.options.extraOffset;
 			} else if (typeof this.options.extraOffset === 'function') {
 				blockOffset -= this.options.extraOffset(block);
 			}
 			return {
 				top: blockOffset
 			};
 		},
 		attachEvents: function() {
 			var self = this;

 			// handle active classes
 			if (this.options.activeClasses && this.anchorLinks.length) {
 				// cache structure
 				this.anchorData = [];

 				for (var i = 0; i < this.anchorLinks.length; i++) {
 					var link = jQuery(this.anchorLinks[i]),
 						targetBlock = self.getAnchorTarget(link),
 						anchorDataItem = null;

 					$.each(self.anchorData, function(index, item) {
 						if (item.block[0] === targetBlock[0]) {
 							anchorDataItem = item;
 						}
 					});

 					if (anchorDataItem) {
 						anchorDataItem.link = anchorDataItem.link.add(link);
 					} else {
 						self.anchorData.push({
 							link: link,
 							block: targetBlock
 						});
 					}
 				};

 				// add additional event handlers
 				this.resizeHandler = function() {
 					if (!self.isInit) return;
 					self.recalculateOffsets();
 				};
 				this.scrollHandler = function() {
 					self.refreshActiveClass();
 				};

 				this.recalculateOffsets();
 				this.scrollContainer.on('scroll', this.scrollHandler);
 				win.on('resize load orientationchange refreshAnchor', this.resizeHandler);
 			}

 			// handle click event
 			this.clickHandler = function(e) {
 				self.onClick(e);
 			};
 			if (!this.options.useNativeAnchorScrolling) {
 				this.anchorLinks.on('click', this.clickHandler);
 			}
 		},
 		recalculateOffsets: function() {
 			var self = this;
 			$.each(this.anchorData, function(index, data) {
 				data.offset = self.getTargetOffset(data.block);
 				data.height = data.block.outerHeight();
 			});
 			this.refreshActiveClass();
 		},
 		toggleActiveClass: function(anchor, block, state) {
 			anchor.toggleClass(this.options.anchorActiveClass, state);
 			block.toggleClass(this.options.sectionActiveClass, state);
 		},
 		refreshActiveClass: function() {
 			var self = this,
 				foundFlag = false,
 				containerHeight = this.container.prop('scrollHeight'),
 				viewPortHeight = this.scrollContainer.height(),
 				scrollTop = this.options.container ? this.container.prop('scrollTop') : win.scrollTop();

 			// user function instead of default handler
 			if (this.options.customScrollHandler) {
 				this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
 				return;
 			}

 			// sort anchor data by offsets
 			this.anchorData.sort(function(a, b) {
 				return a.offset.top - b.offset.top;
 			});

 			// default active class handler
 			$.each(this.anchorData, function(index) {
 				var reverseIndex = self.anchorData.length - index - 1,
 					data = self.anchorData[reverseIndex],
 					anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

 				if (scrollTop >= containerHeight - viewPortHeight) {
 					// handle last section
 					if (reverseIndex === self.anchorData.length - 1) {
 						self.toggleActiveClass(anchorElement, data.block, true);
 					} else {
 						self.toggleActiveClass(anchorElement, data.block, false);
 					}
 				} else {
 					// handle other sections
 					if (!foundFlag && (scrollTop >= data.offset.top - 1 || reverseIndex === 0)) {
 						foundFlag = true;
 						self.toggleActiveClass(anchorElement, data.block, true);
 					} else {
 						self.toggleActiveClass(anchorElement, data.block, false);
 					}
 				}
 			});
 		},
 		calculateScrollDuration: function(offset) {
 			var distance;
 			if (this.options.animMode === 'speed') {
 				distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
 				return (distance / this.options.animSpeed) * 1000;
 			} else {
 				return this.options.animDuration;
 			}
 		},
 		onClick: function(e) {
 			var targetBlock = this.getAnchorTarget(e.currentTarget),
 				targetOffset = this.getTargetOffset(targetBlock);

 			e.preventDefault();
 			scrollTo(targetOffset, {
 				container: this.container,
 				wheelBehavior: this.options.wheelBehavior,
 				duration: this.calculateScrollDuration(targetOffset)
 			});
 			this.makeCallback('onBeforeScroll', e.currentTarget);
 		},
 		makeCallback: function(name) {
 			if (typeof this.options[name] === 'function') {
 				var args = Array.prototype.slice.call(arguments);
 				args.shift();
 				this.options[name].apply(this, args);
 			}
 		},
 		destroy: function() {
 			var self = this;

 			this.isInit = false;
 			if (this.options.activeClasses) {
 				win.off('resize load orientationchange refreshAnchor', this.resizeHandler);
 				this.scrollContainer.off('scroll', this.scrollHandler);
 				$.each(this.anchorData, function(index) {
 					var reverseIndex = self.anchorData.length - index - 1,
 						data = self.anchorData[reverseIndex],
 						anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

 					self.toggleActiveClass(anchorElement, data.block, false);
 				});
 			}
 			this.anchorLinks.off('click', this.clickHandler);
 		}
 	};

 	// public API
 	$.extend(SmoothScroll, {
 		scrollTo: function(blockOrOffset, durationOrOptions, callback) {
 			scrollTo(blockOrOffset, durationOrOptions, callback);
 		}
 	});

 	// export module
 	exports.SmoothScroll = SmoothScroll;
 }(jQuery, this));

 /*
  * jQuery SameHeight plugin
  */
 ;(function($){
 	$.fn.sameHeight = function(opt) {
 		var options = $.extend({
 			skipClass: 'same-height-ignore',
 			leftEdgeClass: 'same-height-left',
 			rightEdgeClass: 'same-height-right',
 			elements: '>*',
 			flexible: false,
 			multiLine: false,
 			useMinHeight: false,
 			biggestHeight: false
 		},opt);
 		return this.each(function(){
 			var holder = $(this), postResizeTimer, ignoreResize;
 			var elements = holder.find(options.elements).not('.' + options.skipClass);
 			if(!elements.length) return;

 			// resize handler
 			function doResize() {
 				elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
 				if(options.multiLine) {
 					// resize elements row by row
 					resizeElementsByRows(elements, options);
 				} else {
 					// resize elements by holder
 					resizeElements(elements, holder, options);
 				}
 			}
 			doResize();

 			// handle flexible layout / font resize
 			var delayedResizeHandler = function() {
 				if(!ignoreResize) {
 					ignoreResize = true;
 					doResize();
 					clearTimeout(postResizeTimer);
 					postResizeTimer = setTimeout(function() {
 						doResize();
 						setTimeout(function(){
 							ignoreResize = false;
 						}, 10);
 					}, 100);
 				}
 			};

 			// handle flexible/responsive layout
 			if(options.flexible) {
 				$(window).bind('resize orientationchange fontresize', delayedResizeHandler);
 			}

 			// handle complete page load including images and fonts
 			$(window).bind('load', delayedResizeHandler);
 		});
 	};

 	// detect css min-height support
 	var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

 	// get elements by rows
 	function resizeElementsByRows(boxes, options) {
 		var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
 		boxes.each(function(ind){
 			var curItem = $(this);
 			if(curItem.offset().top === firstOffset) {
 				currentRow = currentRow.add(this);
 			} else {
 				maxHeight = getMaxHeight(currentRow);
 				maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
 				currentRow = curItem;
 				firstOffset = curItem.offset().top;
 			}
 		});
 		if(currentRow.length) {
 			maxHeight = getMaxHeight(currentRow);
 			maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
 		}
 		if(options.biggestHeight) {
 			boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
 		}
 	}

 	// calculate max element height
 	function getMaxHeight(boxes) {
 		var maxHeight = 0;
 		boxes.each(function(){
 			maxHeight = Math.max(maxHeight, $(this).outerHeight());
 		});
 		return maxHeight;
 	}

 	// resize helper function
 	function resizeElements(boxes, parent, options) {
 		var calcHeight;
 		var parentHeight = typeof parent === 'number' ? parent : parent.height();
 		boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function(i){
 			var element = $(this);
 			var depthDiffHeight = 0;
 			var isBorderBox = element.css('boxSizing') === 'border-box' || element.css('-moz-box-sizing') === 'border-box' || element.css('-webkit-box-sizing') === 'border-box';

 			if(typeof parent !== 'number') {
 				element.parents().each(function(){
 					var tmpParent = $(this);
 					if(parent.is(this)) {
 						return false;
 					} else {
 						depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
 					}
 				});
 			}
 			calcHeight = parentHeight - depthDiffHeight;
 			calcHeight -= isBorderBox ? 0 : element.outerHeight() - element.height();

 			if(calcHeight > 0) {
 				element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
 			}
 		});
 		boxes.filter(':first').addClass(options.leftEdgeClass);
 		boxes.filter(':last').addClass(options.rightEdgeClass);
 		return calcHeight;
 	}
 }(jQuery));


 // *! Picturefill - v3.0.1 - 2015-09-30
 //  * http://scottjehl.github.io/picturefill
 //  * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 //  */
 !function(a){var b=navigator.userAgent;a.HTMLPictureElement&&/ecko/.test(b)&&b.match(/rv\:(\d+)/)&&RegExp.$1<41&&addEventListener("resize",function(){var b,c=document.createElement("source"),d=function(a){var b,d,e=a.parentNode;"PICTURE"===e.nodeName.toUpperCase()?(b=c.cloneNode(),e.insertBefore(b,e.firstElementChild),setTimeout(function(){e.removeChild(b)})):(!a._pfLastSize||a.offsetWidth>a._pfLastSize)&&(a._pfLastSize=a.offsetWidth,d=a.sizes,a.sizes+=",100vw",setTimeout(function(){a.sizes=d}))},e=function(){var a,b=document.querySelectorAll("picture > img, img[srcset][sizes]");for(a=0;a<b.length;a++)d(b[a])},f=function(){clearTimeout(b),b=setTimeout(e,99)},g=a.matchMedia&&matchMedia("(orientation: landscape)"),h=function(){f(),g&&g.addListener&&g.addListener(f)};return c.srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",/^[c|i]|d$/.test(document.readyState||"")?h():document.addEventListener("DOMContentLoaded",h),f}())}(window),function(a,b,c){"use strict";function d(a){return" "===a||"	"===a||"\n"===a||"\f"===a||"\r"===a}function e(b,c){var d=new a.Image;return d.onerror=function(){z[b]=!1,aa()},d.onload=function(){z[b]=1===d.width,aa()},d.src=c,"pending"}function f(){L=!1,O=a.devicePixelRatio,M={},N={},s.DPR=O||1,P.width=Math.max(a.innerWidth||0,y.clientWidth),P.height=Math.max(a.innerHeight||0,y.clientHeight),P.vw=P.width/100,P.vh=P.height/100,r=[P.height,P.width,O].join("-"),P.em=s.getEmValue(),P.rem=P.em}function g(a,b,c,d){var e,f,g,h;return"saveData"===A.algorithm?a>2.7?h=c+1:(f=b-c,e=Math.pow(a-.6,1.5),g=f*e,d&&(g+=.1*e),h=a+g):h=c>1?Math.sqrt(a*b):a,h>c}function h(a){var b,c=s.getSet(a),d=!1;"pending"!==c&&(d=r,c&&(b=s.setRes(c),s.applySetCandidate(b,a))),a[s.ns].evaled=d}function i(a,b){return a.res-b.res}function j(a,b,c){var d;return!c&&b&&(c=a[s.ns].sets,c=c&&c[c.length-1]),d=k(b,c),d&&(b=s.makeUrl(b),a[s.ns].curSrc=b,a[s.ns].curCan=d,d.res||_(d,d.set.sizes)),d}function k(a,b){var c,d,e;if(a&&b)for(e=s.parseSet(b),a=s.makeUrl(a),c=0;c<e.length;c++)if(a===s.makeUrl(e[c].url)){d=e[c];break}return d}function l(a,b){var c,d,e,f,g=a.getElementsByTagName("source");for(c=0,d=g.length;d>c;c++)e=g[c],e[s.ns]=!0,f=e.getAttribute("srcset"),f&&b.push({srcset:f,media:e.getAttribute("media"),type:e.getAttribute("type"),sizes:e.getAttribute("sizes")})}function m(a,b){function c(b){var c,d=b.exec(a.substring(m));return d?(c=d[0],m+=c.length,c):void 0}function e(){var a,c,d,e,f,i,j,k,l,m=!1,o={};for(e=0;e<h.length;e++)f=h[e],i=f[f.length-1],j=f.substring(0,f.length-1),k=parseInt(j,10),l=parseFloat(j),W.test(j)&&"w"===i?((a||c)&&(m=!0),0===k?m=!0:a=k):X.test(j)&&"x"===i?((a||c||d)&&(m=!0),0>l?m=!0:c=l):W.test(j)&&"h"===i?((d||c)&&(m=!0),0===k?m=!0:d=k):m=!0;m||(o.url=g,a&&(o.w=a),c&&(o.d=c),d&&(o.h=d),d||c||a||(o.d=1),1===o.d&&(b.has1x=!0),o.set=b,n.push(o))}function f(){for(c(S),i="",j="in descriptor";;){if(k=a.charAt(m),"in descriptor"===j)if(d(k))i&&(h.push(i),i="",j="after descriptor");else{if(","===k)return m+=1,i&&h.push(i),void e();if("("===k)i+=k,j="in parens";else{if(""===k)return i&&h.push(i),void e();i+=k}}else if("in parens"===j)if(")"===k)i+=k,j="in descriptor";else{if(""===k)return h.push(i),void e();i+=k}else if("after descriptor"===j)if(d(k));else{if(""===k)return void e();j="in descriptor",m-=1}m+=1}}for(var g,h,i,j,k,l=a.length,m=0,n=[];;){if(c(T),m>=l)return n;g=c(U),h=[],","===g.slice(-1)?(g=g.replace(V,""),e()):f()}}function n(a){function b(a){function b(){f&&(g.push(f),f="")}function c(){g[0]&&(h.push(g),g=[])}for(var e,f="",g=[],h=[],i=0,j=0,k=!1;;){if(e=a.charAt(j),""===e)return b(),c(),h;if(k){if("*"===e&&"/"===a[j+1]){k=!1,j+=2,b();continue}j+=1}else{if(d(e)){if(a.charAt(j-1)&&d(a.charAt(j-1))||!f){j+=1;continue}if(0===i){b(),j+=1;continue}e=" "}else if("("===e)i+=1;else if(")"===e)i-=1;else{if(","===e){b(),c(),j+=1;continue}if("/"===e&&"*"===a.charAt(j+1)){k=!0,j+=2;continue}}f+=e,j+=1}}}function c(a){return k.test(a)&&parseFloat(a)>=0?!0:l.test(a)?!0:"0"===a||"-0"===a||"+0"===a?!0:!1}var e,f,g,h,i,j,k=/^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,l=/^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;for(f=b(a),g=f.length,e=0;g>e;e++)if(h=f[e],i=h[h.length-1],c(i)){if(j=i,h.pop(),0===h.length)return j;if(h=h.join(" "),s.matchesMedia(h))return j}return"100vw"}b.createElement("picture");var o,p,q,r,s={},t=function(){},u=b.createElement("img"),v=u.getAttribute,w=u.setAttribute,x=u.removeAttribute,y=b.documentElement,z={},A={algorithm:""},B="data-pfsrc",C=B+"set",D=navigator.userAgent,E=/rident/.test(D)||/ecko/.test(D)&&D.match(/rv\:(\d+)/)&&RegExp.$1>35,F="currentSrc",G=/\s+\+?\d+(e\d+)?w/,H=/(\([^)]+\))?\s*(.+)/,I=a.picturefillCFG,J="position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",K="font-size:100%!important;",L=!0,M={},N={},O=a.devicePixelRatio,P={px:1,"in":96},Q=b.createElement("a"),R=!1,S=/^[ \t\n\r\u000c]+/,T=/^[, \t\n\r\u000c]+/,U=/^[^ \t\n\r\u000c]+/,V=/[,]+$/,W=/^\d+$/,X=/^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,Y=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d||!1):a.attachEvent&&a.attachEvent("on"+b,c)},Z=function(a){var b={};return function(c){return c in b||(b[c]=a(c)),b[c]}},$=function(){var a=/^([\d\.]+)(em|vw|px)$/,b=function(){for(var a=arguments,b=0,c=a[0];++b in a;)c=c.replace(a[b],a[++b]);return c},c=Z(function(a){return"return "+b((a||"").toLowerCase(),/\band\b/g,"&&",/,/g,"||",/min-([a-z-\s]+):/g,"e.$1>=",/max-([a-z-\s]+):/g,"e.$1<=",/calc([^)]+)/g,"($1)",/(\d+[\.]*[\d]*)([a-z]+)/g,"($1 * e.$2)",/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,"")+";"});return function(b,d){var e;if(!(b in M))if(M[b]=!1,d&&(e=b.match(a)))M[b]=e[1]*P[e[2]];else try{M[b]=new Function("e",c(b))(P)}catch(f){}return M[b]}}(),_=function(a,b){return a.w?(a.cWidth=s.calcListLength(b||"100vw"),a.res=a.w/a.cWidth):a.res=a.d,a},aa=function(a){var c,d,e,f=a||{};if(f.elements&&1===f.elements.nodeType&&("IMG"===f.elements.nodeName.toUpperCase()?f.elements=[f.elements]:(f.context=f.elements,f.elements=null)),c=f.elements||s.qsa(f.context||b,f.reevaluate||f.reselect?s.sel:s.selShort),e=c.length){for(s.setupRun(f),R=!0,d=0;e>d;d++)s.fillImg(c[d],f);s.teardownRun(f)}};o=a.console&&console.warn?function(a){console.warn(a)}:t,F in u||(F="src"),z["image/jpeg"]=!0,z["image/gif"]=!0,z["image/png"]=!0,z["image/svg+xml"]=b.implementation.hasFeature("http://wwwindow.w3.org/TR/SVG11/feature#Image","1.1"),s.ns=("pf"+(new Date).getTime()).substr(0,9),s.supSrcset="srcset"in u,s.supSizes="sizes"in u,s.supPicture=!!a.HTMLPictureElement,s.supSrcset&&s.supPicture&&!s.supSizes&&!function(a){u.srcset="data:,a",a.src="data:,a",s.supSrcset=u.complete===a.complete,s.supPicture=s.supSrcset&&s.supPicture}(b.createElement("img")),s.selShort="picture>img,img[srcset]",s.sel=s.selShort,s.cfg=A,s.supSrcset&&(s.sel+=",img["+C+"]"),s.DPR=O||1,s.u=P,s.types=z,q=s.supSrcset&&!s.supSizes,s.setSize=t,s.makeUrl=Z(function(a){return Q.href=a,Q.href}),s.qsa=function(a,b){return a.querySelectorAll(b)},s.matchesMedia=function(){return a.matchMedia&&(matchMedia("(min-width: 0.1em)")||{}).matches?s.matchesMedia=function(a){return!a||matchMedia(a).matches}:s.matchesMedia=s.mMQ,s.matchesMedia.apply(this,arguments)},s.mMQ=function(a){return a?$(a):!0},s.calcLength=function(a){var b=$(a,!0)||!1;return 0>b&&(b=!1),b},s.supportsType=function(a){return a?z[a]:!0},s.parseSize=Z(function(a){var b=(a||"").match(H);return{media:b&&b[1],length:b&&b[2]}}),s.parseSet=function(a){return a.cands||(a.cands=m(a.srcset,a)),a.cands},s.getEmValue=function(){var a;if(!p&&(a=b.body)){var c=b.createElement("div"),d=y.style.cssText,e=a.style.cssText;c.style.cssText=J,y.style.cssText=K,a.style.cssText=K,a.appendChild(c),p=c.offsetWidth,a.removeChild(c),p=parseFloat(p,10),y.style.cssText=d,a.style.cssText=e}return p||16},s.calcListLength=function(a){if(!(a in N)||A.uT){var b=s.calcLength(n(a));N[a]=b?b:P.width}return N[a]},s.setRes=function(a){var b;if(a){b=s.parseSet(a);for(var c=0,d=b.length;d>c;c++)_(b[c],a.sizes)}return b},s.setRes.res=_,s.applySetCandidate=function(a,b){if(a.length){var c,d,e,f,h,k,l,m,n,o=b[s.ns],p=s.DPR;if(k=o.curSrc||b[F],l=o.curCan||j(b,k,a[0].set),l&&l.set===a[0].set&&(n=E&&!b.complete&&l.res-.1>p,n||(l.cached=!0,l.res>=p&&(h=l))),!h)for(a.sort(i),f=a.length,h=a[f-1],d=0;f>d;d++)if(c=a[d],c.res>=p){e=d-1,h=a[e]&&(n||k!==s.makeUrl(c.url))&&g(a[e].res,c.res,p,a[e].cached)?a[e]:c;break}h&&(m=s.makeUrl(h.url),o.curSrc=m,o.curCan=h,m!==k&&s.setSrc(b,h),s.setSize(b))}},s.setSrc=function(a,b){var c;a.src=b.url,"image/svg+xml"===b.set.type&&(c=a.style.width,a.style.width=a.offsetWidth+1+"px",a.offsetWidth+1&&(a.style.width=c))},s.getSet=function(a){var b,c,d,e=!1,f=a[s.ns].sets;for(b=0;b<f.length&&!e;b++)if(c=f[b],c.srcset&&s.matchesMedia(c.media)&&(d=s.supportsType(c.type))){"pending"===d&&(c=d),e=c;break}return e},s.parseSets=function(a,b,d){var e,f,g,h,i=b&&"PICTURE"===b.nodeName.toUpperCase(),j=a[s.ns];(j.src===c||d.src)&&(j.src=v.call(a,"src"),j.src?w.call(a,B,j.src):x.call(a,B)),(j.srcset===c||d.srcset||!s.supSrcset||a.srcset)&&(e=v.call(a,"srcset"),j.srcset=e,h=!0),j.sets=[],i&&(j.pic=!0,l(b,j.sets)),j.srcset?(f={srcset:j.srcset,sizes:v.call(a,"sizes")},j.sets.push(f),g=(q||j.src)&&G.test(j.srcset||""),g||!j.src||k(j.src,f)||f.has1x||(f.srcset+=", "+j.src,f.cands.push({url:j.src,d:1,set:f}))):j.src&&j.sets.push({srcset:j.src,sizes:null}),j.curCan=null,j.curSrc=c,j.supported=!(i||f&&!s.supSrcset||g),h&&s.supSrcset&&!j.supported&&(e?(w.call(a,C,e),a.srcset=""):x.call(a,C)),j.supported&&!j.srcset&&(!j.src&&a.src||a.src!==s.makeUrl(j.src))&&(null===j.src?a.removeAttribute("src"):a.src=j.src),j.parsed=!0},s.fillImg=function(a,b){var c,d=b.reselect||b.reevaluate;a[s.ns]||(a[s.ns]={}),c=a[s.ns],(d||c.evaled!==r)&&((!c.parsed||b.reevaluate)&&s.parseSets(a,a.parentNode,b),c.supported?c.evaled=r:h(a))},s.setupRun=function(){(!R||L||O!==a.devicePixelRatio)&&f()},s.supPicture?(aa=t,s.fillImg=t):!function(){var c,d=a.attachEvent?/d$|^c/:/d$|^c|^i/,e=function(){var a=b.readyState||"";f=setTimeout(e,"loading"===a?200:999),b.body&&(s.fillImgs(),c=c||d.test(a),c&&clearTimeout(f))},f=setTimeout(e,b.body?9:99),g=function(a,b){var c,d,e=function(){var f=new Date-d;b>f?c=setTimeout(e,b-f):(c=null,a())};return function(){d=new Date,c||(c=setTimeout(e,b))}},h=y.clientHeight,i=function(){L=Math.max(a.innerWidth||0,y.clientWidth)!==P.width||y.clientHeight!==h,h=y.clientHeight,L&&s.fillImgs()};Y(a,"resize",g(i,99)),Y(b,"readystatechange",e)}(),s.picturefill=aa,s.fillImgs=aa,s.teardownRun=t,aa._=s,a.picturefillCFG={pf:s,push:function(a){var b=a.shift();"function"==typeof s[b]?s[b].apply(s,a):(A[b]=a[0],R&&s.fillImgs({reselect:!0}))}};for(;I&&I.length;)a.picturefillCFG.push(I.shift());a.picturefill=aa,"object"==typeof module&&"object"==typeof module.exports?module.exports=aa:"function"==typeof define&&define.amd&&define("picturefill",function(){return aa}),s.supPicture||(z["image/webp"]=e("image/webp","data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="))}(window,document);

/*! skrollr 0.6.24 (2014-04-25) | Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr | Free to use under terms of MIT license */
(function(e,t,r){"use strict";function n(r){if(o=t.documentElement,a=t.body,K(),it=this,r=r||{},ut=r.constants||{},r.easing)for(var n in r.easing)U[n]=r.easing[n];yt=r.edgeStrategy||"set",ct={beforerender:r.beforerender,render:r.render,keyframe:r.keyframe},ft=r.forceHeight!==!1,ft&&(Vt=r.scale||1),mt=r.mobileDeceleration||x,gt=r.smoothScrolling!==!1,dt=r.smoothScrollingDuration||E,vt={targetTop:it.getScrollTop()},Gt=(r.mobileCheck||function(){return/Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent||navigator.vendor||e.opera)})(),Gt?(st=t.getElementById("skrollr-body"),st&&at(),X(),Dt(o,[y,S],[T])):Dt(o,[y,b],[T]),it.refresh(),St(e,"resize orientationchange",function(){var e=o.clientWidth,t=o.clientHeight;(t!==$t||e!==Mt)&&($t=t,Mt=e,_t=!0)});var i=Y();return function l(){Z(),bt=i(l)}(),it}var o,a,i={get:function(){return it},init:function(e){return it||new n(e)},VERSION:"0.6.22"},l=Object.prototype.hasOwnProperty,s=e.Math,c=e.getComputedStyle,f="touchstart",u="touchmove",m="touchcancel",p="touchend",g="skrollable",d=g+"-before",v=g+"-between",h=g+"-after",y="skrollr",T="no-"+y,b=y+"-desktop",S=y+"-mobile",k="linear",w=1e3,x=.004,E=200,A="start",F="end",C="center",D="bottom",H="___skrollable_id",I=/^(?:input|textarea|button|select)$/i,P=/^\s+|\s+$/g,N=/^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,O=/\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,V=/^([a-z\-]+)\[(\w+)\]$/,z=/-([a-z0-9_])/g,q=function(e,t){return t.toUpperCase()},L=/[\-+]?[\d]*\.?[\d]+/g,M=/\{\?\}/g,$=/rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,_=/[a-z\-]+-gradient/g,B="",G="",K=function(){var e=/^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;if(c){var t=c(a,null);for(var n in t)if(B=n.match(e)||+n==n&&t[n].match(e))break;if(!B)return B=G="",r;B=B[0],"-"===B.slice(0,1)?(G=B,B={"-webkit-":"webkit","-moz-":"Moz","-ms-":"ms","-o-":"O"}[B]):G="-"+B.toLowerCase()+"-"}},Y=function(){var t=e.requestAnimationFrame||e[B.toLowerCase()+"RequestAnimationFrame"],r=Pt();return(Gt||!t)&&(t=function(t){var n=Pt()-r,o=s.max(0,1e3/60-n);return e.setTimeout(function(){r=Pt(),t()},o)}),t},R=function(){var t=e.cancelAnimationFrame||e[B.toLowerCase()+"CancelAnimationFrame"];return(Gt||!t)&&(t=function(t){return e.clearTimeout(t)}),t},U={begin:function(){return 0},end:function(){return 1},linear:function(e){return e},quadratic:function(e){return e*e},cubic:function(e){return e*e*e},swing:function(e){return-s.cos(e*s.PI)/2+.5},sqrt:function(e){return s.sqrt(e)},outCubic:function(e){return s.pow(e-1,3)+1},bounce:function(e){var t;if(.5083>=e)t=3;else if(.8489>=e)t=9;else if(.96208>=e)t=27;else{if(!(.99981>=e))return 1;t=91}return 1-s.abs(3*s.cos(1.028*e*t)/t)}};n.prototype.refresh=function(e){var n,o,a=!1;for(e===r?(a=!0,lt=[],Bt=0,e=t.getElementsByTagName("*")):e.length===r&&(e=[e]),n=0,o=e.length;o>n;n++){var i=e[n],l=i,s=[],c=gt,f=yt,u=!1;if(a&&H in i&&delete i[H],i.attributes){for(var m=0,p=i.attributes.length;p>m;m++){var d=i.attributes[m];if("data-anchor-target"!==d.name)if("data-smooth-scrolling"!==d.name)if("data-edge-strategy"!==d.name)if("data-emit-events"!==d.name){var v=d.name.match(N);if(null!==v){var h={props:d.value,element:i,eventType:d.name.replace(z,q)};s.push(h);var y=v[1];y&&(h.constant=y.substr(1));var T=v[2];/p$/.test(T)?(h.isPercentage=!0,h.offset=(0|T.slice(0,-1))/100):h.offset=0|T;var b=v[3],S=v[4]||b;b&&b!==A&&b!==F?(h.mode="relative",h.anchors=[b,S]):(h.mode="absolute",b===F?h.isEnd=!0:h.isPercentage||(h.offset=h.offset*Vt))}}else u=!0;else f=d.value;else c="off"!==d.value;else if(l=t.querySelector(d.value),null===l)throw'Unable to find anchor target "'+d.value+'"'}if(s.length){var k,w,x;!a&&H in i?(x=i[H],k=lt[x].styleAttr,w=lt[x].classAttr):(x=i[H]=Bt++,k=i.style.cssText,w=Ct(i)),lt[x]={element:i,styleAttr:k,classAttr:w,anchorTarget:l,keyFrames:s,smoothScrolling:c,edgeStrategy:f,emitEvents:u,lastFrameIndex:-1},Dt(i,[g],[])}}}for(Et(),n=0,o=e.length;o>n;n++){var E=lt[e[n][H]];E!==r&&(J(E),et(E))}return it},n.prototype.relativeToAbsolute=function(e,t,r){var n=o.clientHeight,a=e.getBoundingClientRect(),i=a.top,l=a.bottom-a.top;return t===D?i-=n:t===C&&(i-=n/2),r===D?i+=l:r===C&&(i+=l/2),i+=it.getScrollTop(),0|i+.5},n.prototype.animateTo=function(e,t){t=t||{};var n=Pt(),o=it.getScrollTop();return pt={startTop:o,topDiff:e-o,targetTop:e,duration:t.duration||w,startTime:n,endTime:n+(t.duration||w),easing:U[t.easing||k],done:t.done},pt.topDiff||(pt.done&&pt.done.call(it,!1),pt=r),it},n.prototype.stopAnimateTo=function(){pt&&pt.done&&pt.done.call(it,!0),pt=r},n.prototype.isAnimatingTo=function(){return!!pt},n.prototype.isMobile=function(){return Gt},n.prototype.setScrollTop=function(t,r){return ht=r===!0,Gt?Kt=s.min(s.max(t,0),Ot):e.scrollTo(0,t),it},n.prototype.getScrollTop=function(){return Gt?Kt:e.pageYOffset||o.scrollTop||a.scrollTop||0},n.prototype.getMaxScrollTop=function(){return Ot},n.prototype.on=function(e,t){return ct[e]=t,it},n.prototype.off=function(e){return delete ct[e],it},n.prototype.destroy=function(){var e=R();e(bt),wt(),Dt(o,[T],[y,b,S]);for(var t=0,n=lt.length;n>t;t++)ot(lt[t].element);o.style.overflow=a.style.overflow="",o.style.height=a.style.height="",st&&i.setStyle(st,"transform","none"),it=r,st=r,ct=r,ft=r,Ot=0,Vt=1,ut=r,mt=r,zt="down",qt=-1,Mt=0,$t=0,_t=!1,pt=r,gt=r,dt=r,vt=r,ht=r,Bt=0,yt=r,Gt=!1,Kt=0,Tt=r};var X=function(){var n,i,l,c,g,d,v,h,y,T,b,S;St(o,[f,u,m,p].join(" "),function(e){var o=e.changedTouches[0];for(c=e.target;3===c.nodeType;)c=c.parentNode;switch(g=o.clientY,d=o.clientX,T=e.timeStamp,I.test(c.tagName)||e.preventDefault(),e.type){case f:n&&n.blur(),it.stopAnimateTo(),n=c,i=v=g,l=d,y=T;break;case u:I.test(c.tagName)&&t.activeElement!==c&&e.preventDefault(),h=g-v,S=T-b,it.setScrollTop(Kt-h,!0),v=g,b=T;break;default:case m:case p:var a=i-g,k=l-d,w=k*k+a*a;if(49>w){if(!I.test(n.tagName)){n.focus();var x=t.createEvent("MouseEvents");x.initMouseEvent("click",!0,!0,e.view,1,o.screenX,o.screenY,o.clientX,o.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,0,null),n.dispatchEvent(x)}return}n=r;var E=h/S;E=s.max(s.min(E,3),-3);var A=s.abs(E/mt),F=E*A+.5*mt*A*A,C=it.getScrollTop()-F,D=0;C>Ot?(D=(Ot-C)/F,C=Ot):0>C&&(D=-C/F,C=0),A*=1-D,it.animateTo(0|C+.5,{easing:"outCubic",duration:A})}}),e.scrollTo(0,0),o.style.overflow=a.style.overflow="hidden"},j=function(){var e,t,r,n,a,i,l,c,f,u,m,p=o.clientHeight,g=At();for(c=0,f=lt.length;f>c;c++)for(e=lt[c],t=e.element,r=e.anchorTarget,n=e.keyFrames,a=0,i=n.length;i>a;a++)l=n[a],u=l.offset,m=g[l.constant]||0,l.frame=u,l.isPercentage&&(u*=p,l.frame=u),"relative"===l.mode&&(ot(t),l.frame=it.relativeToAbsolute(r,l.anchors[0],l.anchors[1])-u,ot(t,!0)),l.frame+=m,ft&&!l.isEnd&&l.frame>Ot&&(Ot=l.frame);for(Ot=s.max(Ot,Ft()),c=0,f=lt.length;f>c;c++){for(e=lt[c],n=e.keyFrames,a=0,i=n.length;i>a;a++)l=n[a],m=g[l.constant]||0,l.isEnd&&(l.frame=Ot-l.offset+m);e.keyFrames.sort(Nt)}},W=function(e,t){for(var r=0,n=lt.length;n>r;r++){var o,a,s=lt[r],c=s.element,f=s.smoothScrolling?e:t,u=s.keyFrames,m=u.length,p=u[0],y=u[u.length-1],T=p.frame>f,b=f>y.frame,S=T?p:y,k=s.emitEvents,w=s.lastFrameIndex;if(T||b){if(T&&-1===s.edge||b&&1===s.edge)continue;switch(T?(Dt(c,[d],[h,v]),k&&w>-1&&(xt(c,p.eventType,zt),s.lastFrameIndex=-1)):(Dt(c,[h],[d,v]),k&&m>w&&(xt(c,y.eventType,zt),s.lastFrameIndex=m)),s.edge=T?-1:1,s.edgeStrategy){case"reset":ot(c);continue;case"ease":f=S.frame;break;default:case"set":var x=S.props;for(o in x)l.call(x,o)&&(a=nt(x[o].value),0===o.indexOf("@")?c.setAttribute(o.substr(1),a):i.setStyle(c,o,a));continue}}else 0!==s.edge&&(Dt(c,[g,v],[d,h]),s.edge=0);for(var E=0;m-1>E;E++)if(f>=u[E].frame&&u[E+1].frame>=f){var A=u[E],F=u[E+1];for(o in A.props)if(l.call(A.props,o)){var C=(f-A.frame)/(F.frame-A.frame);C=A.props[o].easing(C),a=rt(A.props[o].value,F.props[o].value,C),a=nt(a),0===o.indexOf("@")?c.setAttribute(o.substr(1),a):i.setStyle(c,o,a)}k&&w!==E&&("down"===zt?xt(c,A.eventType,zt):xt(c,F.eventType,zt),s.lastFrameIndex=E);break}}},Z=function(){_t&&(_t=!1,Et());var e,t,n=it.getScrollTop(),o=Pt();if(pt)o>=pt.endTime?(n=pt.targetTop,e=pt.done,pt=r):(t=pt.easing((o-pt.startTime)/pt.duration),n=0|pt.startTop+t*pt.topDiff),it.setScrollTop(n,!0);else if(!ht){var a=vt.targetTop-n;a&&(vt={startTop:qt,topDiff:n-qt,targetTop:n,startTime:Lt,endTime:Lt+dt}),vt.endTime>=o&&(t=U.sqrt((o-vt.startTime)/dt),n=0|vt.startTop+t*vt.topDiff)}if(Gt&&st&&i.setStyle(st,"transform","translate(0, "+-Kt+"px) "+Tt),ht||qt!==n){zt=n>qt?"down":qt>n?"up":zt,ht=!1;var l={curTop:n,lastTop:qt,maxTop:Ot,direction:zt},s=ct.beforerender&&ct.beforerender.call(it,l);s!==!1&&(W(n,it.getScrollTop()),qt=n,ct.render&&ct.render.call(it,l)),e&&e.call(it,!1)}Lt=o},J=function(e){for(var t=0,r=e.keyFrames.length;r>t;t++){for(var n,o,a,i,l=e.keyFrames[t],s={};null!==(i=O.exec(l.props));)a=i[1],o=i[2],n=a.match(V),null!==n?(a=n[1],n=n[2]):n=k,o=o.indexOf("!")?Q(o):[o.slice(1)],s[a]={value:o,easing:U[n]};l.props=s}},Q=function(e){var t=[];return $.lastIndex=0,e=e.replace($,function(e){return e.replace(L,function(e){return 100*(e/255)+"%"})}),G&&(_.lastIndex=0,e=e.replace(_,function(e){return G+e})),e=e.replace(L,function(e){return t.push(+e),"{?}"}),t.unshift(e),t},et=function(e){var t,r,n={};for(t=0,r=e.keyFrames.length;r>t;t++)tt(e.keyFrames[t],n);for(n={},t=e.keyFrames.length-1;t>=0;t--)tt(e.keyFrames[t],n)},tt=function(e,t){var r;for(r in t)l.call(e.props,r)||(e.props[r]=t[r]);for(r in e.props)t[r]=e.props[r]},rt=function(e,t,r){var n,o=e.length;if(o!==t.length)throw"Can't interpolate between \""+e[0]+'" and "'+t[0]+'"';var a=[e[0]];for(n=1;o>n;n++)a[n]=e[n]+(t[n]-e[n])*r;return a},nt=function(e){var t=1;return M.lastIndex=0,e[0].replace(M,function(){return e[t++]})},ot=function(e,t){e=[].concat(e);for(var r,n,o=0,a=e.length;a>o;o++)n=e[o],r=lt[n[H]],r&&(t?(n.style.cssText=r.dirtyStyleAttr,Dt(n,r.dirtyClassAttr)):(r.dirtyStyleAttr=n.style.cssText,r.dirtyClassAttr=Ct(n),n.style.cssText=r.styleAttr,Dt(n,r.classAttr)))},at=function(){Tt="translateZ(0)",i.setStyle(st,"transform",Tt);var e=c(st),t=e.getPropertyValue("transform"),r=e.getPropertyValue(G+"transform"),n=t&&"none"!==t||r&&"none"!==r;n||(Tt="")};i.setStyle=function(e,t,r){var n=e.style;if(t=t.replace(z,q).replace("-",""),"zIndex"===t)n[t]=isNaN(r)?r:""+(0|r);else if("float"===t)n.styleFloat=n.cssFloat=r;else try{B&&(n[B+t.slice(0,1).toUpperCase()+t.slice(1)]=r),n[t]=r}catch(o){}};var it,lt,st,ct,ft,ut,mt,pt,gt,dt,vt,ht,yt,Tt,bt,St=i.addEvent=function(t,r,n){var o=function(t){return t=t||e.event,t.target||(t.target=t.srcElement),t.preventDefault||(t.preventDefault=function(){t.returnValue=!1,t.defaultPrevented=!0}),n.call(this,t)};r=r.split(" ");for(var a,i=0,l=r.length;l>i;i++)a=r[i],t.addEventListener?t.addEventListener(a,n,!1):t.attachEvent("on"+a,o),Yt.push({element:t,name:a,listener:n})},kt=i.removeEvent=function(e,t,r){t=t.split(" ");for(var n=0,o=t.length;o>n;n++)e.removeEventListener?e.removeEventListener(t[n],r,!1):e.detachEvent("on"+t[n],r)},wt=function(){for(var e,t=0,r=Yt.length;r>t;t++)e=Yt[t],kt(e.element,e.name,e.listener);Yt=[]},xt=function(e,t,r){ct.keyframe&&ct.keyframe.call(it,e,t,r)},Et=function(){var e=it.getScrollTop();Ot=0,ft&&!Gt&&(a.style.height=""),j(),ft&&!Gt&&(a.style.height=Ot+o.clientHeight+"px"),Gt?it.setScrollTop(s.min(it.getScrollTop(),Ot)):it.setScrollTop(e,!0),ht=!0},At=function(){var e,t,r=o.clientHeight,n={};for(e in ut)t=ut[e],"function"==typeof t?t=t.call(it):/p$/.test(t)&&(t=t.slice(0,-1)/100*r),n[e]=t;return n},Ft=function(){var e=st&&st.offsetHeight||0,t=s.max(e,a.scrollHeight,a.offsetHeight,o.scrollHeight,o.offsetHeight,o.clientHeight);return t-o.clientHeight},Ct=function(t){var r="className";return e.SVGElement&&t instanceof e.SVGElement&&(t=t[r],r="baseVal"),t[r]},Dt=function(t,n,o){var a="className";if(e.SVGElement&&t instanceof e.SVGElement&&(t=t[a],a="baseVal"),o===r)return t[a]=n,r;for(var i=t[a],l=0,s=o.length;s>l;l++)i=It(i).replace(It(o[l])," ");i=Ht(i);for(var c=0,f=n.length;f>c;c++)-1===It(i).indexOf(It(n[c]))&&(i+=" "+n[c]);t[a]=Ht(i)},Ht=function(e){return e.replace(P,"")},It=function(e){return" "+e+" "},Pt=Date.now||function(){return+new Date},Nt=function(e,t){return e.frame-t.frame},Ot=0,Vt=1,zt="down",qt=-1,Lt=Pt(),Mt=0,$t=0,_t=!1,Bt=0,Gt=!1,Kt=0,Yt=[];"function"==typeof define&&define.amd?define("skrollr",function(){return i}):e.skrollr=i})(window,document);


 /*
  _ _      _       _
  ___| (_) ___| | __  (_)___
  / __| | |/ __| |/ /  | / __|
  \__ \ | | (__|   < _ | \__ \
  |___/_|_|\___|_|\_(_)/ |___/
  |__/

  Version: 1.6.0
  Author: Ken Wheeler
  Website: http://kenwheeler.github.io
  Docs: http://kenwheeler.github.io/slick
  Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

  */
 !function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,e=this;e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(b,c){return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.focussed=!1,e.interrupted=!1,e.hidden="hidden",e.paused=!0,e.positionProp=null,e.respondTo=null,e.rowCount=1,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.visibilityChange="visibilitychange",e.windowWidth=0,e.windowTimer=null,f=a(c).data("slick")||{},e.options=a.extend({},e.defaults,d,f),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,"undefined"!=typeof document.mozHidden?(e.hidden="mozHidden",e.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(e.hidden="webkitHidden",e.visibilityChange="webkitvisibilitychange"),e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.registerBreakpoints(),e.init(!0)}var b=0;return c}(),b.prototype.activateADA=function(){var a=this;a.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?(e.options.rtl===!0&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),e.options.vertical===!1?d[e.animType]="translate3d("+b+"px, 0px, 0px)":d[e.animType]="translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.getNavTarget=function(){var b=this,c=b.options.asNavFor;return c&&null!==c&&(c=a(c).not(b.$slider)),c},b.prototype.asNavFor=function(b){var c=this,d=c.getNavTarget();null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};b.options.fade===!1?c[b.transitionType]=b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:c[b.transitionType]="opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayClear(),a.slideCount>a.options.slidesToShow&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this,b=a.currentSlide+a.options.slidesToScroll;a.paused||a.interrupted||a.focussed||(a.options.infinite===!1&&(1===a.direction&&a.currentSlide+1===a.slideCount-1?a.direction=0:0===a.direction&&(b=a.currentSlide-a.options.slidesToScroll,a.currentSlide-1===0&&(a.direction=1))),a.slideHandler(b))},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&(b.$prevArrow=a(b.options.prevArrow).addClass("slick-arrow"),b.$nextArrow=a(b.options.nextArrow).addClass("slick-arrow"),b.slideCount>b.options.slidesToShow?(b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.prependTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(b.$slider.addClass("slick-dotted"),d=a("<ul />").addClass(b.options.dotsClass),c=0;c<=b.getDotCount();c+=1)d.append(a("<li />").append(b.options.customPaging.call(this,b,c)));b.$dots=d.appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b).data("originalStyling",a(c).attr("style")||"")}),b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(b.options.centerMode===!0||b.options.swipeToSlide===!0)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var b,c,d,e,f,g,h,a=this;if(e=document.createDocumentFragment(),g=a.$slider.children(),a.options.rows>1){for(h=a.options.slidesPerRow*a.options.rows,f=Math.ceil(g.length/h),b=0;f>b;b++){var i=document.createElement("div");for(c=0;c<a.options.rows;c++){var j=document.createElement("div");for(d=0;d<a.options.slidesPerRow;d++){var k=b*h+(c*a.options.slidesPerRow+d);g.get(k)&&j.appendChild(g.get(k))}i.appendChild(j)}e.appendChild(i)}a.$slider.empty().append(e),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},b.prototype.checkResponsive=function(b,c){var e,f,g,d=this,h=!1,i=d.$slider.width(),j=window.innerWidth||a(window).width();if("window"===d.respondTo?g=j:"slider"===d.respondTo?g=i:"min"===d.respondTo&&(g=Math.min(j,i)),d.options.responsive&&d.options.responsive.length&&null!==d.options.responsive){f=null;for(e in d.breakpoints)d.breakpoints.hasOwnProperty(e)&&(d.originalSettings.mobileFirst===!1?g<d.breakpoints[e]&&(f=d.breakpoints[e]):g>d.breakpoints[e]&&(f=d.breakpoints[e]));null!==f?null!==d.activeBreakpoint?(f!==d.activeBreakpoint||c)&&(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):null!==d.activeBreakpoint&&(d.activeBreakpoint=null,d.options=d.originalSettings,b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b),h=f),b||h===!1||d.$slider.trigger("breakpoint",[d,h])}},b.prototype.changeSlide=function(b,c){var f,g,h,d=this,e=a(b.currentTarget);switch(e.is("a")&&b.preventDefault(),e.is("li")||(e=e.closest("li")),h=d.slideCount%d.options.slidesToScroll!==0,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||e.index()*d.options.slidesToScroll;d.slideHandler(d.checkNavigable(i),!1,c),e.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var c,d,b=this;if(c=b.getNavigableIndexes(),d=0,a>c[c.length-1])a=c[c.length-1];else for(var e in c){if(a<c[e]){a=d;break}d=c[e]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots&&null!==b.$dots&&a("li",b.$dots).off("click.slick",b.changeSlide).off("mouseenter.slick",a.proxy(b.interrupt,b,!0)).off("mouseleave.slick",a.proxy(b.interrupt,b,!1)),b.$slider.off("focus.slick blur.slick"),b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.cleanUpSlideEvents(),b.options.accessibility===!0&&b.$list.off("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpSlideEvents=function(){var b=this;b.$list.off("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.cleanUpRows=function(){var b,a=this;a.options.rows>1&&(b=a.$slides.children().children(),b.removeAttr("style"),a.$slider.empty().append(b))},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(b){var c=this;c.autoPlayClear(),c.touchObject={},c.cleanUpEvents(),a(".slick-cloned",c.$slider).detach(),c.$dots&&c.$dots.remove(),c.$prevArrow&&c.$prevArrow.length&&(c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.prevArrow)&&c.$prevArrow.remove()),c.$nextArrow&&c.$nextArrow.length&&(c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.nextArrow)&&c.$nextArrow.remove()),c.$slides&&(c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){a(this).attr("style",a(this).data("originalStyling"))}),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.detach(),c.$list.detach(),c.$slider.append(c.$slides)),c.cleanUpRows(),c.$slider.removeClass("slick-slider"),c.$slider.removeClass("slick-initialized"),c.$slider.removeClass("slick-dotted"),c.unslicked=!0,b||c.$slider.trigger("destroy",[c])},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:c.options.zIndex}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:c.options.zIndex}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.fadeSlideOut=function(a){var b=this;b.cssTransitions===!1?b.$slides.eq(a).animate({opacity:0,zIndex:b.options.zIndex-2},b.options.speed,b.options.easing):(b.applyTransition(a),b.$slides.eq(a).css({opacity:0,zIndex:b.options.zIndex-2}))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.$slidesCache=b.$slides,b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.focusHandler=function(){var b=this;b.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*:not(.slick-arrow)",function(c){c.stopImmediatePropagation();var d=a(this);setTimeout(function(){b.options.pauseOnFocus&&(b.focussed=d.is(":focus"),b.autoPlay())},0)})},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(a.options.centerMode===!0)d=a.slideCount;else if(a.options.asNavFor)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else d=1+Math.ceil((a.slideCount-a.options.slidesToShow)/a.options.slidesToScroll);return d-1},b.prototype.getLeft=function(a){var c,d,f,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(!0),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=b.slideWidth*b.options.slidesToShow*-1,e=d*b.options.slidesToShow*-1),b.slideCount%b.options.slidesToScroll!==0&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth*-1,e=(b.options.slidesToShow-(a-b.slideCount))*d*-1):(b.slideOffset=b.slideCount%b.options.slidesToScroll*b.slideWidth*-1,e=b.slideCount%b.options.slidesToScroll*d*-1))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?a*b.slideWidth*-1+b.slideOffset:a*d*-1+e,b.options.variableWidth===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,b.options.centerMode===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,c+=(b.$list.width()-f.outerWidth())/2)),c},b.prototype.getOption=b.prototype.slickGetOption=function(a){var b=this;return b.options[a]},b.prototype.getNavigableIndexes=function(){var e,a=this,b=0,c=0,d=[];for(a.options.infinite===!1?e=a.slideCount:(b=-1*a.options.slidesToScroll,c=-1*a.options.slidesToScroll,e=2*a.slideCount);e>b;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var c,d,e,b=this;return e=b.options.centerMode===!0?b.slideWidth*Math.floor(b.options.slidesToShow/2):0,b.options.swipeToSlide===!0?(b.$slideTrack.find(".slick-slide").each(function(c,f){return f.offsetLeft-e+a(f).outerWidth()/2>-1*b.swipeLeft?(d=f,!1):void 0}),c=Math.abs(a(d).attr("data-slick-index")-b.currentSlide)||1):b.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){var c=this;c.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots(),c.checkResponsive(!0),c.focusHandler()),b&&c.$slider.trigger("init",[c]),c.options.accessibility===!0&&c.initADA(),c.options.autoplay&&(c.paused=!1,c.autoPlay())},b.prototype.initADA=function(){var b=this;b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),b.$slideTrack.attr("role","listbox"),b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c){a(this).attr({role:"option","aria-describedby":"slick-slide"+b.instanceUid+c})}),null!==b.$dots&&b.$dots.attr("role","tablist").find("li").each(function(c){a(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+b.instanceUid+c,id:"slick-slide"+b.instanceUid+c})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),b.activateADA()},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.off("click.slick").on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.interrupt,b,!0)).on("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.initSlideEvents=function(){var b=this;b.options.pauseOnHover&&(b.$list.on("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.interrupt,b,!1)))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.initSlideEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show()},b.prototype.keyHandler=function(a){var b=this;a.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:b.options.rtl===!0?"next":"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:b.options.rtl===!0?"previous":"next"}}))},b.prototype.lazyLoad=function(){function g(c){a("img[data-lazy]",c).each(function(){var c=a(this),d=a(this).attr("data-lazy"),e=document.createElement("img");e.onload=function(){c.animate({opacity:0},100,function(){c.attr("src",d).animate({opacity:1},200,function(){c.removeAttr("data-lazy").removeClass("slick-loading")}),b.$slider.trigger("lazyLoaded",[b,c,d])})},e.onerror=function(){c.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),b.$slider.trigger("lazyLoadError",[b,c,d])},e.src=d})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=Math.ceil(e+b.options.slidesToShow),b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){var a=this;a.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.autoPlay(),a.options.autoplay=!0,a.paused=!1,a.focussed=!1,a.interrupted=!1},b.prototype.postSlide=function(a){var b=this;b.unslicked||(b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay&&b.autoPlay(),b.options.accessibility===!0&&b.initADA())},b.prototype.prev=b.prototype.slickPrev=function(){var a=this;a.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(b){b=b||1;var e,f,g,c=this,d=a("img[data-lazy]",c.$slider);d.length?(e=d.first(),f=e.attr("data-lazy"),g=document.createElement("img"),g.onload=function(){e.attr("src",f).removeAttr("data-lazy").removeClass("slick-loading"),c.options.adaptiveHeight===!0&&c.setPosition(),c.$slider.trigger("lazyLoaded",[c,e,f]),c.progressiveLazyLoad()},g.onerror=function(){3>b?setTimeout(function(){c.progressiveLazyLoad(b+1)},500):(e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),c.$slider.trigger("lazyLoadError",[c,e,f]),c.progressiveLazyLoad())},g.src=f):c.$slider.trigger("allImagesLoaded",[c])},b.prototype.refresh=function(b){var d,e,c=this;e=c.slideCount-c.options.slidesToShow,!c.options.infinite&&c.currentSlide>e&&(c.currentSlide=e),c.slideCount<=c.options.slidesToShow&&(c.currentSlide=0),d=c.currentSlide,c.destroy(!0),a.extend(c,c.initials,{currentSlide:d}),c.init(),b||c.changeSlide({data:{message:"index",index:d}},!1)},b.prototype.registerBreakpoints=function(){var c,d,e,b=this,f=b.options.responsive||null;if("array"===a.type(f)&&f.length){b.respondTo=b.options.respondTo||"window";for(c in f)if(e=b.breakpoints.length-1,d=f[c].breakpoint,f.hasOwnProperty(c)){for(;e>=0;)b.breakpoints[e]&&b.breakpoints[e]===d&&b.breakpoints.splice(e,1),e--;b.breakpoints.push(d),b.breakpointSettings[d]=f[c].settings}b.breakpoints.sort(function(a,c){return b.options.mobileFirst?a-c:c-a})}},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.registerBreakpoints(),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.cleanUpSlideEvents(),b.initSlideEvents(),b.checkResponsive(!1,!0),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.setPosition(),b.focusHandler(),b.paused=!b.options.autoplay,b.autoPlay(),b.$slider.trigger("reInit",[b])},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.unslicked||b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,void d.reinit())},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?Math.ceil(a)+"px":"0px",e="top"==b.positionProp?Math.ceil(a)+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1&&a.options.variableWidth===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):a.options.variableWidth===!0?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.options.variableWidth===!1&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=b.slideWidth*d*-1,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:b.options.zIndex-2,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:b.options.zIndex-2,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:b.options.zIndex-1,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(){var c,d,e,f,h,b=this,g=!1;if("object"===a.type(arguments[0])?(e=arguments[0],g=arguments[1],h="multiple"):"string"===a.type(arguments[0])&&(e=arguments[0],f=arguments[1],g=arguments[2],"responsive"===arguments[0]&&"array"===a.type(arguments[1])?h="responsive":"undefined"!=typeof arguments[1]&&(h="single")),"single"===h)b.options[e]=f;else if("multiple"===h)a.each(e,function(a,c){b.options[a]=c});else if("responsive"===h)for(d in f)if("array"!==a.type(b.options.responsive))b.options.responsive=[f[d]];else{for(c=b.options.responsive.length-1;c>=0;)b.options.responsive[c].breakpoint===f[d].breakpoint&&b.options.responsive.splice(c,1),c--;b.options.responsive.push(f[d])}g&&(b.unload(),b.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),a.options.fade&&("number"==typeof a.options.zIndex?a.options.zIndex<3&&(a.options.zIndex=3):a.options.zIndex=a.defaults.zIndex),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=a.options.useTransform&&null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;d=b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),b.$slides.eq(a).addClass("slick-current"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active").attr("aria-hidden","false"):(e=b.options.slidesToShow+a,
 	d.slice(e-c+1,e+c+2).addClass("slick-active").attr("aria-hidden","false")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):d.length<=b.options.slidesToShow?d.addClass("slick-active").attr("aria-hidden","false"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active").attr("aria-hidden","false"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.interrupt=function(a){var b=this;a||b.autoPlay(),b.interrupted=a},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.setSlideClasses(e),void c.asNavFor(e)):void c.slideHandler(e)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,j,h=null,i=this;return b=b||!1,i.animating===!0&&i.options.waitForAnimate===!0||i.options.fade===!0&&i.currentSlide===a||i.slideCount<=i.options.slidesToShow?void 0:(b===!1&&i.asNavFor(a),d=a,h=i.getLeft(d),g=i.getLeft(i.currentSlide),i.currentLeft=null===i.swipeLeft?g:i.swipeLeft,i.options.infinite===!1&&i.options.centerMode===!1&&(0>a||a>i.getDotCount()*i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):i.options.infinite===!1&&i.options.centerMode===!0&&(0>a||a>i.slideCount-i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):(i.options.autoplay&&clearInterval(i.autoPlayTimer),e=0>d?i.slideCount%i.options.slidesToScroll!==0?i.slideCount-i.slideCount%i.options.slidesToScroll:i.slideCount+d:d>=i.slideCount?i.slideCount%i.options.slidesToScroll!==0?0:d-i.slideCount:d,i.animating=!0,i.$slider.trigger("beforeChange",[i,i.currentSlide,e]),f=i.currentSlide,i.currentSlide=e,i.setSlideClasses(i.currentSlide),i.options.asNavFor&&(j=i.getNavTarget(),j=j.slick("getSlick"),j.slideCount<=j.options.slidesToShow&&j.setSlideClasses(i.currentSlide)),i.updateDots(),i.updateArrows(),i.options.fade===!0?(c!==!0?(i.fadeSlideOut(f),i.fadeSlide(e,function(){i.postSlide(e)})):i.postSlide(e),void i.animateHeight()):void(c!==!0?i.animateSlide(h,function(){i.postSlide(e)}):i.postSlide(e))))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":e.options.verticalSwiping===!0?d>=35&&135>=d?"down":"up":"vertical"},b.prototype.swipeEnd=function(a){var c,d,b=this;if(b.dragging=!1,b.interrupted=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.edgeHit===!0&&b.$slider.trigger("edge",[b,b.swipeDirection()]),b.touchObject.swipeLength>=b.touchObject.minSwipe){switch(d=b.swipeDirection()){case"left":case"down":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide+b.getSlideCount()):b.currentSlide+b.getSlideCount(),b.currentDirection=0;break;case"right":case"up":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide-b.getSlideCount()):b.currentSlide-b.getSlideCount(),b.currentDirection=1}"vertical"!=d&&(b.slideHandler(c),b.touchObject={},b.$slider.trigger("swipe",[b,d]))}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,b.options.verticalSwiping===!0&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var d,e,f,g,h,b=this;return h=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||h&&1!==h.length?!1:(d=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==h?h[0].pageX:a.clientX,b.touchObject.curY=void 0!==h?h[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),b.options.verticalSwiping===!0&&(b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curY-b.touchObject.startY,2)))),e=b.swipeDirection(),"vertical"!==e?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),g=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.options.verticalSwiping===!0&&(g=b.touchObject.curY>b.touchObject.startY?1:-1),f=b.touchObject.swipeLength,b.touchObject.edgeHit=!1,b.options.infinite===!1&&(0===b.currentSlide&&"right"===e||b.currentSlide>=b.getDotCount()&&"left"===e)&&(f=b.touchObject.swipeLength*b.options.edgeFriction,b.touchObject.edgeHit=!0),b.options.vertical===!1?b.swipeLeft=d+f*g:b.swipeLeft=d+f*(b.$list.height()/b.listWidth)*g,b.options.verticalSwiping===!0&&(b.swipeLeft=d+f*g),b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):void b.setCSS(b.swipeLeft)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return b.interrupted=!0,1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,void(b.dragging=!0))},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.remove(),b.$nextArrow&&b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&!a.options.infinite&&(a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-1&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;a.options.autoplay&&(document[a.hidden]?a.interrupted=!0:a.interrupted=!1)},a.fn.slick=function(){var f,g,a=this,c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=a.length;for(f=0;e>f;f++)if("object"==typeof c||"undefined"==typeof c?a[f].slick=new b(a[f],c):g=a[f].slick[c].apply(a[f].slick,d),"undefined"!=typeof g)return g;return a}});