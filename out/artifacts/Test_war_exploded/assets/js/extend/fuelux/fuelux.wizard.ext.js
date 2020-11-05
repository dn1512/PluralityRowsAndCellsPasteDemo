/*
 * Fuel UX Wizard Extension
 * 依赖：jquery, ace, elements.wizard.ext, fuelux.wizard.ext
 * 作者：well
 * 2016年4月1日18:14:28
 */
(function($, undefined) {
	var old = $.fn.wizard;
	var Wizard = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.wizard.defaults, options);
		this.options.disablePreviousStep = this.$element.data().restrict === "previous" ? true : false;
		this.currentStep = this.options.selectedItem.step;	// 当前节点
		this.currentStatus = this.options.status;	// 当前节点的状态
		this.prevDisableSteps = this.options.prevDisableSteps;	// 当前节点之前的不可用节点
		this.isColoringTitle = this.options.isColoringTitle;	// 是否着色
		this.isLineThrough = this.options.isLineThrough;	// 是否延长路径线
		this.numSteps = this.$element.find(".wizard-steps > li").length;
		this.$element.on("click", "li.complete", $.proxy(this.stepclicked, this));
		this.$element.on("click", "li.active", $.proxy(this.stepclicked, this));
		if (this.currentStep > 1) {
			this.selectedItem(this.options.selectedItem)
		}
		if (this.options.disablePreviousStep) {
			this.$element.find(".wizard-steps").addClass("previous-disabled")
		}
		this.$stepContainer = $(this.$element.data("target") || "body")
	};
	Wizard.prototype = {
		constructor : Wizard,
		initState : function() {
			this.currentStep = this.currentStep < 1 ? 1 : this.currentStep % (this.numSteps + 1);
			var $steps = this.$element.find(".wizard-steps > li");
			$steps.removeClass("active").removeClass("complete");
			$steps.find("span.badge").removeClass("badge-info").removeClass("badge-success");
			var prevSelector = ".wizard-steps > li:lt(" + (this.currentStep - 1) + ")";	// this.currentStep
			var $prevSteps = this.$element.find(prevSelector);
			$prevSteps.addClass("complete");
			$prevSteps.find("span.badge").addClass("badge-success");
			if(this.isArray(this.prevDisableSteps) && this.prevDisableSteps.length > 0) {
				var disableSteps = this.prevDisableSteps;
				var isColoringTitle = this.isColoringTitle;
				var isLineThrough = this.isLineThrough;
				$.each($prevSteps, function(i) {
					if($.inArray((i+1), disableSteps) > -1) {	// 从 1 开始
						$(this).removeClass("complete");
						$(this).find("span.badge").removeClass("badge-success");
						if(isLineThrough) {
							$(this).addClass('line-through');
						}
					} else if(isColoringTitle) {
						$(this).find("span.title").addClass("title-complete");
					}
				});
			} else if(this.isColoringTitle) {
				$.each($prevSteps, function() {
					$(this).find("span.title").addClass("title-complete");
				});
			}
			var currentSelector = ".wizard-steps > li:eq(" + (this.currentStep - 1) + ")";	// this.currentStep
			var $currentStep = this.$element.find(currentSelector);
			if(0 !== this.currentStatus) {
				$currentStep.addClass(1 === this.currentStatus ? "active" : "complete");
				$currentStep.find("span.badge").addClass(1 === this.currentStatus ? "badge-info" : "badge-success");
				if(1 === this.currentStatus && this.isColoringTitle) {
					$currentStep.find("span.title").addClass('title-active');
				}
			}
			var target = $currentStep.data().target;
			this.$stepContainer.find(".step-pane").removeClass("active");
			$(target).addClass("active");
			this.$element.trigger("changed", {
				currentStep : this.currentStep
			})
		},
		setState : function() {
			var currentSelector = ".wizard-steps > li:eq(" + (this.currentStep - 1) + ")";	// this.currentStep
			var $currentStep = this.$element.find(currentSelector);
			var target = $currentStep.data().target;
			this.$stepContainer.find(".step-pane").removeClass("active");
			$(target).addClass("active");
			this.$element.trigger("changed", {
				currentStep : this.currentStep
			})
		},
		stepclicked : function(e) {
			var li = $(e.currentTarget);
			var index = this.$element.find(".wizard-steps li").index(li);
			var canMovePrev = true;
			if (this.options.disablePreviousStep) {
				if (index < this.currentStep) {
					canMovePrev = false
				}
			}
			if (canMovePrev) {
				var evt = $.Event("stepclick");
				this.$element.trigger(evt, {
					step : index + 1
				});
				if (evt.isDefaultPrevented())
					return;
				this.currentStep = index + 1;
				this.setState()
			}
		},
		previous : function() {
			var canMovePrev = this.currentStep > 1;
			if (this.options.disablePreviousStep) {
				canMovePrev = false
			}
			if (canMovePrev) {
				var e = $.Event("change");
				this.$element.trigger(e, {
					step : this.currentStep,
					direction : "previous"
				});
				if (e.isDefaultPrevented())
					return;
				this.currentStep -= 1;
				this.setState()
			}
		},
		next : function() {
			var canMoveNext = this.currentStep + 1 <= this.numSteps;
			var lastStep = this.currentStep === this.numSteps;
			if (canMoveNext) {
				var e = $.Event("change");
				this.$element.trigger(e, {
					step : this.currentStep,
					direction : "next"
				});
				if (e.isDefaultPrevented())
					return;
				this.currentStep += 1;
				this.setState()
			} else if (lastStep) {
				this.$element.trigger("finished")
			}
		},
		selectedItem : function(selectedItem) {
			var retVal, step;
			if (selectedItem) {
				step = selectedItem.step || -1;
				if (step >= 1 && step <= this.numSteps) {
					this.currentStep = step;
					this.setState()
				}
				retVal = this
			} else {
				retVal = {
					step : this.currentStep
				}
			}
			return retVal
		},
		isArray : function(obj){
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
	};
	$.fn.wizard = function(option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;
		var $set = this.each(function() {
			var $this = $(this);
			var data = $this.data("wizard");
			var options = typeof option === "object" && option;
			if (!data)
				$this.data("wizard", data = new Wizard(this, options));
			if (typeof option === "string")
				methodReturn = data[option].apply(data, args)
		});
		return methodReturn === undefined ? $set : methodReturn
	};
	$.fn.wizard.defaults = {
		selectedItem : {
			step : 1
		}
	};
	$.fn.wizard.Constructor = Wizard;
	$.fn.wizard.noConflict = function() {
		$.fn.wizard = old;
		return this
	};
	$(function() {
		$("body").on("mouseover.wizard.data-api", ".wizard", function() {
			var $this = $(this);
			if ($this.data("wizard"))
				return;
			$this.wizard($this.data())
		})
	})
})(window.jQuery);