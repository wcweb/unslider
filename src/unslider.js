/**
 *   Unslider 2.0
 *   by @idiot and friends
 */
 
(function($) {
	//  Don't throw errors if we haven't included jQuery
	if(!$) return;
	
	//  Simple utility function, since we use a ton of callbacks
	$.callback = function(fn, context, params) {
		return $.isFunction(fn) && fn.apply(context, params);
	};
	
	//  Our main object with all its lovely 
	$.Unslider = function(el, opts) {
		//  Set our main element wrapper
		//  Should be surrounding the <ul> tag.
		this.el = el;
		
		//  This is the <ul> tag we were talking about.
		this.items = el.children('ul');
				
		//  Set the slides (the <li>) dynamically
		this.slides = this.items.children('li');
		
		//  Slide total
		this.total = this.slides.length;

		//  Move to the first <li> element
		this.index = 0;
				
		//  Set a default object to merge with the opts object.
		//  Don't ever call this.defaults, call this.opts instead.
		$.Unslider.defaults = this.defaults = {
			//  How fast to move between slides (in ms)
			speed: 500,
			
			//  The length of time to leave between moving slides (in ms)
			interval: 2000,
			
			//  Callback function for a slide has finished sliding
			//  parameters are:
			//   - this, the current active slide
			//   - "el", the base element"
			//   - "index", the current active slide's index
			complete: function(el, index) {},
			
			//  Add keyboard (L/R arrow) support?
			keys: true,
			
			//  Add navigation dots?
			//  This will only append a <nav> element with <ol> in.
			//  If you want to style the dots, you'll need to write
			//  some custom CSS to do that. It doesn't come included with
			//  Unslider, to keep things small.
			dots: false,
			
			//  Want the slider to start automatically? We can do that.
			autostart: true
		};
		
		//  This is the one to use. Merge in options with our defaults.
		this.opts = $.extend(this.defaults, opts);
		
		//  Used for setInterval et al.
		this.queue = false;
		
		//  Since jQuery takes away selector context sometimes, we can't always
		//  reliably use "this" to assume "Unslider", so we cache a copy of the
		//  "this" variable and call it "self". If there are variable problems,
		//  it's because you used "this" instead of "self".
		var self = this;
		
		//  Turn a standard <ul> into an unslider-friendly list
		this.build = function() {
			this.el.addClass('unslider').css('overflow', 'hidden');
			
			//  Turn off the auto overflow
			this.items.css('width', this.total * 100 + '%');
			
			//  Set the slide's widths
			this.slides.css('width', (100 / this.total) + '%');
			
			//  Build dots
			this.opts.dots && this.buildDots();
			
			//  Build arrow navigation
			this.opts.arrows && this.buildArrows();
			
			//  Handle keyboard navigation
			this.opts.keys && this.handleKeys();
			
			//  Update any custom hooks
			this.update(this.index);
			
			//  Listen to any post-build hooks
			return $.Unslider.hook.register('build', {
				context: this,
				params: [],
				fallback: this
			});
		};
		
		//  Create navigation dots
		//  Use data-title attributes on the slides to change the value
		this.buildDots = function() {
			var html = '<ol class="dots">';
			var target = this.findDots();
			
			//  Add our dots to the HTML string
			this.slides.not('.cloned').each(function(index) {
				html += '<li>' + ($(this).attr('data-title') || index + 1) + '</li>';
			});
			
			//  Finish the string off and add to wherever we're putting the dots
			target.append(html + '</ol>');
			
			//  Listen for clicking the dots
			this.handleDots();
			
			//  Handle any plugins
			return $.Unslider.hook.register('buildDots', {
				context: target,
				params: [html],
				fallback: false
			});
		};
		
		//  Listen to dot-clicking
		this.handleDots = function() {
			var target = self.findDots();
			
			//  Listen for any <li>s in .dots
			return target.find('.dots li').on('click', function() {
				//  Stop the auto-sliding functionality for now
				self.stop();
				
				var index = $(this).index();
				var offset = $.Unslider.hook.register('handleDots', {
					context: self, params: [index], fallback: index
				});
				
				//  $(this).index() matches the slide indexes
				self.move(offset);
			});
		};
		
		//  Find our dots even if they're not part of the normal
		//  Unslider DOM object
		this.findDots = function() {
			return this.opts.dots === true ? this.el : this.opts.dots;
		};
		
		//  Listen to keyboard navigation
		this.handleKeys = function() {
			var map;
			
			return $(document).on('keydown', function(e) {
				map = {
					37: self.index - 1, 39: self.index + 1
				};
				
				if(map[e.which]) {
					return self.move(map[e.which]);
				}
			});
		};
		
		//  Handle swiping
		//  requires labs.rampinteractive.co.uk/touchSwipe
		this.handleSwipe = function() {
			if(!$.fn.swipe) return;
			
			
		};
		
		//  Find a slide using either a slide index or a selector (such as an
		//  (such as an ID or attributes, whatever - I don't know).
		this.find = function(wut) {
			//  Checking the hash
			if(typeof wut == 'string') {
				//  If the slide doesn't exist, set back to whatever it was.
				if(self.items.find(wut).length == 0) wut = self.index;
			}
			
			//  If we're using an index to find it, assume it's an .eq() call 
			if($.isNumeric(wut)) {
				//  If it's more than the last slide, move it back to the start
				if(wut >= self.total) wut = 0;
				if(wut < 0) wut = self.total;
				
				wut = 'li:eq(' + wut + ')';
			}
						
			//  Find our element, either using a selector or index
			return $.Unslider.hook.register('find', {
				context: self.items,
				params: [wut],
				fallback: self.items.find(wut)
			});
		};
		
		//  Runs every time Unslider gets updated.
		//  Doesn't *move* the slider, just takes care of updating
		//  the internal index and the dots
		this.update = function(to) {
			//  Get any pre-update 
			var preUpdate = $.Unslider.hook.register('update', {
				context: self,
				params: [to]
			});
			
			//  Set the new target element
			var target = self.find(to);
			
			//  Update our index so we know what slide's active
			//  Listen to the preUpdate plugin first though
			self.index = $.isNumeric(preUpdate) ? preUpdate : target.index();
			
			//  Update dots
			if(self.opts.dots) {
				var dots = self.findDots();
				
				dots.find('.dots li:eq(' + self.index + ')').addClass('active')
					.siblings().removeClass('active');
			}
			
			return target.addClass('active').siblings().removeClass('active');
		};
		
		//  Move a slide to an index
		this.move = function(to) {
			//  Listen to custom hooks
			var hook;
			var target = self.update(to);

			//  And move it
			if(!self.items.queue('fx').length) {									
				//  Calculate the offset to move to
				var offset = -(self.index * 100) + '%';
				
				//  Listen to custom animations
			   	hook = $.Unslider.hook.register('move', {
			   		context: self,
			   		params: [offset, target],
			   		fallback: function() {
				   		self.animate(self.items, {left: offset}, self.opts.speed, function() {
				   			return $.callback(self.opts.complete, target, self.el, self.index);
				   		});
			   		}
			   	});
			   				   	
			   	//  It can either return a function to call or a jQuery animate object
			   	return $.isFunction(hook) ? hook() : hook;
			}
		};
		
		//  Let's go, yo.
		this.start = function() {
			this.queue = setInterval(function() {
				return self.move(self.index + 1);
			}, this.opts.interval);
		};
		
		//  Stop the slider for whatever reason
		this.stop = function() {
			return this.queue = clearInterval(this.queue);
		};
		
		//  Wrap jQuery's .animate() so it prefers velocity.js
		//  - it should already work with jQuery animate-enhanced
		this.animate = function(el, prop, duration, easing, complete) {
			var method = 'animate';
			
			if($.fn.velocity) {
				method = 'velocity';
			}
			
			return el[method](prop, duration, easing, complete);
		};
		
		//  If we're hyperlinking to a slide
		if(window.location.hash) {
			this.move(window.location.hash);
		}
		
		//  Go, go, go!
		this.build();
		
		//  Auto-start the slider
		if(this.opts.autostart) {
			this.start();
		}
	};
	
	//  Store our hooks in an object to use with plugins
	$.Unslider.bindings = {};
	
	//  Add extension functionality
	//  Listens to function hooks which are manually added in here.
	//  $.Unslider.hook({load: fn});
   	$.Unslider.hook = {
   		//  Add to the object and listen
   		register: function(hook, data) {
   			//  Try and find a hook
   			var fn = $.Unslider.bindings[hook];
   			
   			//  Set the default result
   			var result = data.fallback;
   			
   			//  If we've got something to return;
   			if(typeof fn !== 'undefined') {
   				$.each(fn, function() {
   					var bound = this.apply(data.context, data.params);
   					
   					//  Don't stop if there's no result
   					if(bound) {
   						return result = bound;
   					}
   				});
   			}
   			
   			//  And give it all back
   			return result;
   		},
   		
   		//  Attach to any listening objects
   		bind: function(hook, callback) {
   			if(!$.Unslider.bindings[hook]) {
   				$.Unslider.bindings[hook] = [];
   			}
   			
   			return $.Unslider.bindings[hook].push(callback);
   		}
   	};
	   
	//  And set up our jQuery plugin
	$.fn.unslider = function(opts) {
		return this.each(function() {
			var me = $(this);
			return me.data('unslider', new $.Unslider(me, opts));
		});
	};
	
})(window.jQuery || false);