/**
 *   Add infinite scroll functionality
 *   (Default functionality is to move back to the first slide)
 */
(function($) {
	//  Don't float everything left
	//  position: absolute it instead
	//  Might break some CSS so be careful
	$.Unslider.hook.bind('build', function() {
    	if(typeof this.opts['fade'] == 'undefined') return;

		console.log('build', this);
	});
    
    //  We're not sliding anything so piss about with the opacities
    $.Unslider.hook.bind('move', function() {
    	if(typeof this.opts['fade'] == 'undefined') return;
    	
    	return this.items.animate({
    		opacity: 0
    	}, 150).delay(250).animate({opacity: 1}, 150);
    });
})(window.jQuery);