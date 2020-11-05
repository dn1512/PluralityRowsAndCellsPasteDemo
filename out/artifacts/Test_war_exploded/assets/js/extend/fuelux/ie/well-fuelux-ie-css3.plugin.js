/*
 * Fuel UX Wizard Extension
 * 依赖：jquery, ace, elements.wizard.ext, fuelux.wizard.ext
 * 作者：well
 * 2016年4月1日18:14:28
 */
(function($,  undefined) {
	$.fn.well_wizard_ie = function(options) {

		this.each(function() {
			//js获取项目根路径，如： http://localhost:8080/ems
	        var getRootPath = function () {
	            //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
	            var curWwwPath = window.document.location.href;
	            //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
	            var pathName = window.document.location.pathname;
	            var pos = curWwwPath.indexOf(pathName);
	            //获取主机地址，如： http://localhost:8080
	            var localhostPath = curWwwPath.substring(0, pos);
	            //获取带"/"的项目名，如：/ems
	            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	            return (localhostPath + projectName);
	        };
			var rootPath = getRootPath();
			
			// 可以添加 options 的扩展，完善插件的自定义使用 var step = options && ((options.selectedItem && options.selectedItem.step) || options.step);
			$('head').append('<style type="text/css">.wizard-steps li.ie-last:before { max-width: 50%; width: 50%; }</style>');
			$('head').append('<style type="text/css">.wizard-steps li.ie-first:before { max-width: 100%; width: 100%; margin-left: 50%; }</style>');
			$('head').append('<style type="text/css">.wizard-steps li .step { behavior: url(' + rootPath + '/assets/js/extend/fuelux/ie/ie-css3.htc); }</style>');
			
			var $this = $(this);
			// 添加动画效果以恢复正常
			$this.css({ width: ($this.width() - 80) }).animate({
				width : '+=80px'
			}, 2000);
			// 添加效果
			setTimeout(function() {
				// 添加鼠标点击效果
				var $competeAndActiveNodes = $this.find('.wizard-steps li.complete, .wizard-steps li.active');
				$competeAndActiveNodes.unbind('click').bind('click', function() {
					$competeAndActiveNodes.find('.title').css({ 'font-weight' : 'normal' });
					$(this).find('.title').css({ 'font-weight' : 'bold' });	// 标题粗体
					// 是否点击 修理中 [初始化方法 nodeNo, 从 1 开始; tabNo, 从 1 开始]
					var tag = ($(this).attr('data-target')).toString();
					if(!$(this).hasClass('well-current-click')) {	// 未点击过
						if(tag.indexOf('Step1') > -1) {			// 初始化 确认发货 详情面板
							// 加载页面数据
							$(trackingDetailFirstNodeTabs).trigger('click');
						} else if(tag.indexOf('Step2') > -1) {	// 初始化 出口报关 详情面板
							// 加载页面数据
							$(trackingDetailSecondNodeTabs).trigger('click');
						} else if(tag.indexOf('Step3') > -1) {	// 初始化 修理中 详情面板
							// 加载第1个 tab 的页面数据
							$(trackingDetailThirdNodeTabs + ' li:first a').trigger('click');
						} else if(tag.indexOf('Step4') > -1) {	// 初始化 发货 详情面板
							// 加载页面数据
							$(trackingDetailFourthNodeTabs).trigger('click');
						} else if(tag.indexOf('Step5') > -1) {	// 初始化 进口报关 详情面板
							// 加载页面数据
							$(trackingDetailFifthNodeTabs).trigger('click');
						} else {								// 初始化 入库 详情面板
							// 加载页面数据
							$(trackingDetailSixthNodeTabs).trigger('click');
						}
					}
					// 添加点击标记
					$competeAndActiveNodes.removeClass('well-current-click');
					$(this).addClass('well-current-click');
				});
			}, 300);
		});

		return this;
	}

})(window.jQuery);
