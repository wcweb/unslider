/**
 *   Add fade transitions
 *   (Default functionality is to slide the slides)
 */
(function($) {
	//  Don't float everything left
	//  position: absolute it instead
	//  Might break some CSS so be careful
	$.Unslider.hook.bind('build', function() {
    	if(typeof this.opts['fade'] == 'undefined') return;

		//  Make sure we're wrapped to the container
		this.items.css({
			position: 'relative',
			height: Math.max.apply(null, this.slides.map(function() {
				return $(this).height();
			}).get())
		});
		
		//  And put all our slides on top of each other
		this.slides.css({
			position: 'absolute',
			left: 0,
			top: 0,
			opacity: 0
		});
		
		return this.slides.filter('.active').css('opacity', 1);
	});
    
    //  We're not sliding anything so piss about with the opacities
    $.Unslider.hook.bind('move', function(offset,target) {
    	if(typeof this.opts['fade'] == 'undefined') return;
    	
    	var self = this;
    	var active = this.slides.filter('.active')
    	
    	//  Make the current slide appear
    	self.animate(active, {opacity: 1}, this.opts.speed, function() {
    		return $.callback(self.opts.complete, target, self.el, self.index);
    	});
    	
    	//  And the other slides disappear
    	self.animate(active.siblings(), {opacity: 0}, this.opts.speed);
    	
    	return active;
    });
})(window.jQuery);