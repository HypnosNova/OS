/*-------------------------- +
  获取id, class, tagName
 +-------------------------- */
var get = {
	byId: function(id) {
		return typeof id === "string" ? document.getElementById(id) : id
	},
	byClass: function(sClass, oParent) {
		var aClass = [];
		var reClass = new RegExp("(^| )" + sClass + "( |$)");
		var aElem = this.byTagName("*", oParent);
		for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
		return aClass
	},
	byTagName: function(elem, obj) {
		return (obj || document).getElementsByTagName(elem)
	}
};
var dragMinWidth = 250;
var dragMinHeight = 124;
var windowsArray = [];
/*-------------------------- +
  拖拽函数
 +-------------------------- */
function drag(oDrag, handle) {
		var disX = dixY = 0;
		var oMin = get.byClass("min", oDrag)[0];
		var oMax = get.byClass("max", oDrag)[0];
		var oRevert = get.byClass("revert", oDrag)[0];
		var oClose = get.byClass("close", oDrag)[0];
		handle = handle || oDrag;
		handle.style.cursor = "move";
		handle.onmousedown = function(event) {
				var event = event || window.event;
				disX = event.clientX - oDrag.offsetLeft;
				disY = event.clientY - oDrag.offsetTop;
				zIndexChange(oDrag);
				document.onmousemove = function(event) {
					var event = event || window.event;
					var iL = event.clientX - disX;
					var iT = event.clientY - disY;
					var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
					var maxT = document.documentElement.clientHeight - oDrag.offsetHeight;

					iL <= 0 && (iL = 0);
					iT <= 0 && (iT = 0);
					iL >= maxL && (iL = maxL);
					iT >= maxT && (iT = maxT);

					oDrag.style.left = iL + "px";
					oDrag.style.top = iT + "px";

					return false
				};

				document.onmouseup = function() {
					document.onmousemove = null;
					document.onmouseup = null;
					this.releaseCapture && this.releaseCapture()
				};
				this.setCapture && this.setCapture();
				return false
			}
			//最大化按钮
		oMax.onclick = function() {
				oDrag.style.top = oDrag.style.left = 0;
				oDrag.style.width = document.documentElement.clientWidth - 2 + "px";
				oDrag.style.height = document.documentElement.clientHeight - 2 + "px";
				this.style.display = "none";
				oRevert.style.display = "block";
			}
			//还原按钮
		oRevert.onclick = function() {
				oDrag.style.width = dragMinWidth + "px";
				oDrag.style.height = dragMinHeight + "px";
				oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
				oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";
				this.style.display = "none";
				oMax.style.display = "block";
			}
			//最小化按钮
		oMin.onclick = function() {
			$(oDrag).fadeOut(300, function() {
				oDrag.style.display = "none";
			})
			var oA = document.createElement("li");
			var tmpdiv = document.createElement("div");
			$(tmpdiv).addClass("item");
			$(tmpdiv).append('<img src="img/icons/' + $(oDrag).attr("appIcon") + '"/>');
			oA.appendChild(tmpdiv);
			oA.title = "还原";
			document.getElementById("sideBarContainer").appendChild(oA);
			oA.onclick = function() {
					$(oDrag).fadeIn(300);
					$(this).fadeOut(300, function() {
						document.getElementById("sideBarContainer").removeChild(this);
					})
					this.onclick = null;
				}
				//add2();
		}
		oClose.onclick = function() {
				html2canvas(oDrag).then(function(canvas) {
					var strDataURI = canvas.toDataURL();
					var div = document.createElement("div")
					var img = document.createElement("img")
					img.src = strDataURI;
					div.appendChild(img);
					div.style.position="absolute";
					div.style.zIndex=2;
					div.style.left=oDrag.style.left;
					div.style.top=oDrag.style.top;
					document.body.appendChild(div);
					$(oDrag).remove();
					explore(div,strDataURI);
				});
				
			}
			//阻止冒泡
		oMin.onmousedown = oMax.onmousedown = oClose.onmousedown = function(event) {
			this.onfocus = function() {
				this.blur()
			};
			(event || window.event).cancelBubble = true
		}
	}
	/*-------------------------- +
	  改变大小函数
	 +-------------------------- */

function resize(oParent, handle, isLeft, isTop, lockX, lockY) {
	handle.onmousedown = function(event) {
		var event = event || window.event;
		var disX = event.clientX - handle.offsetLeft;
		var disY = event.clientY - handle.offsetTop;
		var iParentTop = oParent.offsetTop;
		var iParentLeft = oParent.offsetLeft;
		var iParentWidth = oParent.offsetWidth;
		var iParentHeight = oParent.offsetHeight;

		document.onmousemove = function(event) {
			var event = event || window.event;

			var iL = event.clientX - disX;
			var iT = event.clientY - disY;
			var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;
			var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;
			var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
			var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;

			isLeft && (oParent.style.left = iParentLeft + iL + "px");
			isTop && (oParent.style.top = iParentTop + iT + "px");

			iW < dragMinWidth && (iW = dragMinWidth);
			iW > maxW && (iW = maxW);
			lockX || (oParent.style.width = iW + "px");

			iH < dragMinHeight && (iH = dragMinHeight);
			iH > maxH && (iH = maxH);
			lockY || (oParent.style.height = iH + "px");

			if ((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;

			return false;
		};
		document.onmouseup = function() {
			document.onmousemove = null;
			document.onmouseup = null;
		};
		return false;
	}
};

function zIndexChange(oDrag) {
	var theIndex;
	for (var i = 0; i < windowsArray.length; i++) {
		if (windowsArray[i] == oDrag) {
			theIndex = i;
			break;
		}
	}
	windowsArray.splice(theIndex, 1);
	windowsArray.push(oDrag);

	for (var i = 0; i < windowsArray.length; i++) {
		$(windowsArray[i]).css("zIndex", "" + (i + 1));
	}
}

function createWindows(app) {
	var oDrag = document.createElement("div");
	document.body.appendChild(oDrag);
	windowsArray.push(oDrag);
	$(oDrag).css("zIndex", "" + windowsArray.length);
	oDrag.setAttribute("id", "drag");
	oDrag.setAttribute("name", "drag");
	oDrag.setAttribute("appIcon", app.appIcon);
	$(oDrag).append('<div class="title"><h2>' + app.appTitle + '</h2><div><a class="min" href="javascript:;" title="最小化"></a><a class="max" href="javascript:;" title="最大化"></a><a class="revert" href="javascript:;" title="还原"></a><a class="close" href="javascript:;" title="关闭"></a></div>')
		.append('<div class="resizeL"></div>')
		.append('<div class="resizeT"></div>')
		.append('<div class="resizeR"></div>')
		.append('<div class="resizeB"></div>')
		.append('<div class="resizeLT"></div>')
		.append('<div class="resizeTR"></div>')
		.append('<div class="resizeBR"></div>')
		.append('<div class="resizeLB"></div>')
		.append('<div class="content"><iframe name="appframe" src=' + app.appUrl + ' width="100%" frameborder="no" border="0"></iframe></div>');
	var oTitle = get.byClass("title", oDrag)[0];
	var oL = get.byClass("resizeL", oDrag)[0];
	var oT = get.byClass("resizeT", oDrag)[0];
	var oR = get.byClass("resizeR", oDrag)[0];
	var oB = get.byClass("resizeB", oDrag)[0];
	var oLT = get.byClass("resizeLT", oDrag)[0];
	var oTR = get.byClass("resizeTR", oDrag)[0];
	var oBR = get.byClass("resizeBR", oDrag)[0];
	var oLB = get.byClass("resizeLB", oDrag)[0];

	drag(oDrag, oTitle);
	//四角
	resize(oDrag, oLT, true, true, false, false);
	resize(oDrag, oTR, false, true, false, false);
	resize(oDrag, oBR, false, false, false, false);
	resize(oDrag, oLB, true, false, false, false);
	//四边
	resize(oDrag, oL, true, false, false, true);
	resize(oDrag, oT, false, true, true, false);
	resize(oDrag, oR, false, false, false, true);
	resize(oDrag, oB, false, false, true, false);

	oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
	oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";
}