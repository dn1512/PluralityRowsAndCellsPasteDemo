// function fileUpload() {
// }

var addLoadingDom = $('<div class="ajaxLoadBox"><div class="loadBoxWidth"><div class="modal-content">正在上传，请稍等。。。</div></div></div>');

//文件上传
fileUpload = function (inputId, url, maxSize, suffixs) {
	var result = '';
	var files = $("#" + inputId).prop('files');
	if (files.length != 0) {
		var param = new FormData();
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (suffixs != undefined && suffixs) {
				var fileSuffixs = suffixs.split(",");
				var type = (file.name.substr(file.name.lastIndexOf("."))).toLowerCase();
				var flag = false;
				for (var j = 0; j < fileSuffixs.length; j++) {
					if (fileSuffixs[j].replace(/(^\s*)|(\s*$)/g, "") == type) {
						flag = true;
						break;
					}
				}
				if (!flag) {
					AmmsDialog.alert("上传失败，文件不符合类型(" + suffixs + ")");
					$("#" + inputId).val('');
					return;
				}
			}
			if (maxSize) {
				var fileSize = file.size;
				if (fileSize > maxSize) {
					AmmsDialog.alert("上传失败，文件太大，最大40M");
					$("#" + inputId).val('');
					return;
				}
			};
			param.append('files', file, file.name);
			//param.append('file', file); //参数名：file
		};
		
		$.ajax({
			url: url,
			type: 'POST',
			data: param,
			async: false, // 同步操作
			cache: false, //禁止浏览器对该URL的缓存
			contentType: false,
			processData: false,
			beforeSend: function () {
				$('body').append(addLoadingDom);
			},
			success: function (data) {
				result = data;
				addLoadingDom.remove();
			},
			error: function () {
				AmmsDialog.alert("服务器连接失败，请重新上传！");
				$("#" + inputId).val('');
				addLoadingDom.remove();
			}
		});
	}
	return result
}

fileDownload = function (param, downloadUrl) {
	var form = $("<form>");
	form.attr("style", "display:none");
	form.attr("target", "");
	form.attr("action", downloadUrl);
	form.append($("<input>").attr("type", "hidden").attr("name", "param").attr("value", param));
	form.appendTo('body').submit().remove();
}

initFileList = function (domId, files, uploadUrl, downloadUrl, inputDomId, maxSize, suffixs) {
	if (domId) {
		if (files && files != '') {
			var fileArray = JSON.parse(files);
			for (var j = 0; j < fileArray.length; j++) {
				var docId = fileArray[j].docId;
				var docName = fileArray[j].docName;
				var param = downloadUrl + "?docId=" + docId + "&docName=" + docName;
				var html = '<li for="message-text" class="control-label">' +
					'<span class="filesN">' +
					'<a href=' + param + ' target="_blank" class="alink" docName=' + docName + ' docId=' + docId + '>' + docName + '</a>' +
					'</span>'
				if (uploadUrl && inputDomId) {
					html = html + '<span onclick="filesDelete(this,\'' + inputDomId + '\')" class="delBtn">删除</span>' + '</li >'
				} else {
					html = html + '</li >'
				}
				$("#" + domId).append(html);
			}
		}
		if (uploadUrl && inputDomId) {
			bindOnChange(domId, inputDomId, uploadUrl, downloadUrl, maxSize, suffixs);
		}
	}
}

bindOnChange = function (domId, inputDomId, uploadUrl, downloadUrl, maxSize, suffixs) {
	if (inputDomId && uploadUrl) {
		$("#" + inputDomId).change(function () {
			// $('body').append(addLoadingDom);
			var files = fileUpload(inputDomId, uploadUrl, maxSize, suffixs);
			var fileArray = JSON.parse(files);
			for (var k = 0; k < fileArray.length; k++) {
				var docId = fileArray[k].docId;
				var docName = fileArray[k].docName;
				var param = downloadUrl + "?docId=" + docId + "&docName=" + docName;
				$("#" + domId).append(
					'<li for="message-text" class="control-label">' +
					'<span class="filesN">' +
					'<a href=' + param + ' target="_blank" class="alink" docName=' + docName + ' docId=' + docId + '>' + docName + '</a>' +
					'</span>' +
					'<span onclick="filesDelete(this, \'' + inputDomId + '\')" class="delBtn">删除</span>' +
					'</li >'
				);
			}
			addLoadingDom.remove();
		})
	}
}

getFileList = function (domId) {
	var fileList;
	if ($("#" + domId + " a")) {
		fileList = [];
		$.each($("#" + domId + " a"), function (index, value) {
			var str = {};
			str.docId = $(value).attr('docId')
			str.docName = $(value).attr('docName')
			fileList.push(str)
		});
	}

	return fileList.length > 0 ? JSON.stringify(fileList) : null;
}

filesDelete = function (docDom, inputDomId) {
	$("#" + inputDomId).val('');
	$(docDom).closest("li").remove();
}
