var fx = {
	buffer: function(obj, cur, target, fnDo, fnEnd, fs) {
		if (!fs) fs = 6;
		var now = {};
		var x = 0;
		var v = 0;

		if (!obj.__last_timer) obj.__last_timer = 0;
		var t = new Date().getTime();
		if (t - obj.__last_timer > 20) {
			fnMove();
			obj.__last_timer = t;
		}

		clearInterval(obj.timer);
		obj.timer = setInterval(fnMove, 20);

		function fnMove() {
			v = Math.ceil((100 - x) / fs);
			x += v;
			for (var i in cur) {
				now[i] = (target[i] - cur[i]) * x / 100 + cur[i];
			}
			if (fnDo) fnDo.call(obj, now);

			if (Math.abs(v) < 1 && Math.abs(100 - x) < 1) {
				clearInterval(obj.timer);
				if (fnEnd) fnEnd.call(obj, target);
			}
		}
	}
};

//监听css3运动终止
(function() {
	var aListener = []; //{obj, fn, arg}
	if (!Modernizr.csstransitions) return;
	if (window.navigator.userAgent.toLowerCase().search('webkit') != -1) {
		document.addEventListener('webkitTransitionEnd', endListrner, false);
	} else {
		document.addEventListener('transitionend', endListrner, false);
	}

	function endListrner(ev) {
		var oEvObj = ev.srcElement || ev.target;
		//alert(aListener.length);
		for (var i = 0; i < aListener.length; i++) {
			if (oEvObj == aListener[i].obj) {
				aListener[i].fn.call(aListener[i].obj, aListener[i].arg);
				aListener.remove(aListener[i--]);
			}
		}
	}

	fx.addEnd = function(obj, fn, arg) {
		if (!obj || !fn) return;
		aListener.push({
			obj: obj,
			fn: fn,
			arg: arg
		});
	}
})();

function explore(div,imgu) {
	var oDiv = div;
	var now = 0;
	var ready = true;
	var W = div.offsetWidth;
	var H = div.offsetHeight;
	
	
	//爆炸


	if (!ready) return;
	ready = false;

	var R = 4;
	var C = 7;
	var cw = W / 2;
	var ch = H / 2;

	oDiv.innerHTML = '';
	oDiv.style.background = 'url('+imgu+') center no-repeat';
	//img.style.background = "transparent";
	var aData = [];

	var wait = R * C;

	for (var i = 0; i < R; i++) {
		for (var j = 0, k = 0; j < C; j++, k++) {
			aData[i] = {
				left: W * j / C,
				top: H * i / R
			};
			var oNewDiv = $('<div>');
			oNewDiv.css({
				position: 'absolute',
				width: Math.ceil(W / C) + 'px',
				height: Math.ceil(H / R) + 'px',
				background: 'url(' + imgu + ') ' + -aData[i].left + 'px ' + -aData[i].top + 'px no-repeat',
				left: aData[i].left + 'px',
				top: aData[i].top + 'px'
			});


			oDiv.appendChild(oNewDiv[0]);

			var l = ((aData[i].left + W / (2 * C)) - cw) * Utils.rnd(2, 3) + cw - W / (2 * C);
			var t = ((aData[i].top + H / (2 * R)) - ch) * Utils.rnd(2, 3) + ch - H / (2 * R);

			setTimeout((function(oNewDiv, l, t) {
				return function() {
					fx.buffer(
						oNewDiv, {
							left: oNewDiv.offsetLeft,
							top: oNewDiv.offsetTop,
							opacity: 100,
							x: 0,
							y: 0,
							z: 0,
							scale: 1,
							a: 0
						}, {
							left: l,
							top: t,
							opacity: 0,
							x: Utils.rnd(-180, 180),
							y: Utils.rnd(-180, 180),
							z: Utils.rnd(-180, 180),
							scale: Utils.rnd(1.5, 3),
							a: 1
						},
						function(now) {
							this.style.left = now.left + 'px';
							this.style.top = now.top + 'px';
							this.style.opacity = now.opacity / 100;
							Utils.setStyle3(oNewDiv, 'transform', 'perspective(500px) rotateX(' + now.x + 'deg) rotateY(' + now.y + 'deg) rotateZ(' + now.z + 'deg) scale(' + now.scale + ')');
						}, function() {
							setTimeout(function() {
								oDiv.removeChild(oNewDiv);
							}, 200);
							if (--wait == 0) {
								ready = true;
								//now = next();
								$(div).remove();
							}
						}, 10
					);
				};
			})(oNewDiv[0], l, t), Utils.rnd(0, 200));
		}
	}





	var setStyle3 = function(obj, name, value) {
		obj.style['Webkit' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
		obj.style['Moz' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
		obj.style['ms' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
		obj.style['O' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
		obj.style[name] = value;
	};

	var rnd = function(n, m) {
		return Math.random() * (m - n) + n;
	};



}

var Utils = {
	setStyle3: function(obj, name, value) {
		obj.style['Webkit' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
		obj.style['Moz' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
		obj.style['ms' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
		obj.style['O' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
		obj.style[name] = value;
	},
	rnd: function(n, m) {
		return Math.random() * (m - n) + n;
	}
}