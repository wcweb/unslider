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
			height: '100%' // position: absolute kills height calculation
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
    $.Unslider.hook.bind('move', function() {
    	if(typeof this.opts['fade'] == 'undefined') return;
    	
    	return this.slides.filter('.active').animate({opacity: 1}, this.opts.speed)
    			   .siblings().animate({opacity: 0}, this.opts.speed);
    	
    	//return this.items.animate({
    	//	opacity: 0
    	//}, 150).delay(250).animate({opacity: 1}, 150);
    });
})(window.jQuery);