/**
 *   Add infinite scroll functionality
 *   (Default functionality is to move back to the first slide)
 */
(function($) {
	var total;
	var calculate = function(index) {
		if(index < 1) {
			return 1;
		}
		
		if(index > (total - 1)) {
			return total - 1;
		}
		
		return index;
	};
	
	$.Unslider.hook.bind('build', function() {
    	if(typeof this.opts['infinite'] == 'undefined') return;

		//  Cache the slides because we're gonna use this a lot
		var slides = this.slides;
		
		//  Double up on first and last slides
		this.items.prepend(slides.last().clone().attr('class', 'cloned'));
		this.items.append(slides.first().clone().attr('class', 'cloned'));
		
		//  Change the total
		this.total = this.total + 2;
		
		//  Set the default index to not be the buffer slides
		this.index = 1;
		
		//  Auto-hide the first slide
		this.items.css({
			width: this.total * 100 + '%',
			left: '-100%'
		});
				
		return this.el.find('ul li').css('width', (100 / this.total) + '%');
	});
	
	
	$.Unslider.hook.bind('handleDots', function(index) {
		if(typeof this.opts['infinite'] == 'undefined') return;
		return index + 1;
	});
	
	$.Unslider.hook.bind('update', function(to) {
		if(typeof this.opts['infinite'] == 'undefined') return;
		return to;
	});
    
    $.Unslider.hook.bind('move', function(offset,target) {
    	if(typeof this.opts['infinite'] == 'undefined') return;
    	
    	//  Cache for jQuery animate
    	var self = this;
    	
    	//  Account for the first slide
    	if(this.index <= 0) {
    		this.index = 1;
    	}
    	
    	return self.animate(self.items, {left: offset}, self.opts.speed, function() {
    		if(self.index + 1 == self.total) {
    			self.index = 1;
    			self.items.css('left', '-100%');
    		}
    	    
    	    return $.callback(self.opts.complete, target, self.el, self.index);
    	});
    });
})(window.jQuery);