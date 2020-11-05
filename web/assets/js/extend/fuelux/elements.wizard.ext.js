/*
 * Fuel UX Wizard Extension
 * 依赖：jquery, ace, elements.wizard.ext, fuelux.wizard.ext
 * 作者：well
 * 2016年4月1日18:14:28
 */
(function($ , undefined) {
	$.fn.well_wizard = function(options) {

		this.each(function() {
			var $this = $(this);
			$this.wizard();
			
			var $wizard = $this.data('wizard');
			var step = options && ((options.selectedItem && options.selectedItem.step) || options.step);
			var status = options && options.status;	// 默认是绿色完成状态
			var disableSteps = options && options.prevDisableSteps;
			var coloringTitle = options && options.isColoringTitle;
			var lineThrough = options && options.isLineThrough;
			if(step) {
				$wizard.currentStep = step;
				$wizard.currentStatus = status;
				$wizard.prevDisableSteps = disableSteps;
				$wizard.isColoringTitle = coloringTitle;
				$wizard.isLineThrough = lineThrough;
				$wizard.initState();
			}
		});

		return this;
	}

})(window.jQuery);
