/**
 *   Vertical scroll
 *   (Default functionality is horizontal)
 */
(function($) {
	//  Don't float everything left
	//  Make sure everything's stacking equally
	$.Unslider.hook.bind('build', function() {
    	if(typeof this.opts['vertical'] == 'undefined') return;
    	
    	//  Set the width to be the same as container, not n times width
    	//  It's vertical, not horizontal
    	this.items.css({
    		width: '100%',
    		overflow: 'hidden'
    	});
    	
    	//  Get the slides adjusted
    	return this.slides.css({
    		float: 'none',
    		width: '100%',
    		height: '100%'
    	});
	});
    
    //  We're not sliding anything so piss about with the opacities
    $.Unslider.hook.bind('move', function(offset, target) {
    	if(typeof this.opts['vertical'] == 'undefined') return;
    	
    	//  Cache the "this" variable because jQuery animate changes context
    	var self = this;
    	
    	//  Move vertically
    	return this.items.animate({top: offset}, this.opts.speed, function() {
	    	return $.callback(self.opts.complete, target, self.el, self.index);
    	});
    });
})(window.jQuery);