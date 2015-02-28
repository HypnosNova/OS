// Create an instance of Meny
var meny = Meny.create({
	// The element that will be animated in from off screen
	menuElement: document.querySelector('.meny'),

	// The contents that gets pushed aside while Meny is active
	contentsElement: document.querySelector('.contents'),

	// [optional] The alignment of the menu (top/right/bottom/left)
	position: Meny.getQuery().p || 'left',

	// [optional] The height of the menu (when using top/bottom position)
	height: 200,

	// [optional] The width of the menu (when using left/right position)
	width: 260,

	// [optional] Distance from mouse (in pixels) when menu should open
	threshold: 40,

	// [optional] Use mouse movement to automatically open/close
	mouse: true,

	// [optional] Use touch swipe events to open/close
	touch: true
});

// API Methods:
// meny.open();
// meny.close();
// meny.isOpen();

// Events:
// meny.addEventListener( 'open', function(){ console.log( 'open' ); } );
// meny.addEventListener( 'close', function(){ console.log( 'close' ); } );

// Embed an iframe if a URL is passed in
if (Meny.getQuery().u && Meny.getQuery().u.match(/^http/gi)) {
	var contents = document.querySelector('.contents');
	contents.style.padding = '0px';
	contents.innerHTML = '<div class="cover"></div><iframe src="' + Meny.getQuery().u + '" style="width: 100%; height: 100%; border: 0; position: absolute;"></iframe>';
}

var Icon, Screen, Stage,
	__hasProp = {}.hasOwnProperty,
	__extends = function(child, parent) {
		for (var key in parent) {
			if (__hasProp.call(parent, key)) child[key] = parent[key];
		}

		function ctor() {
			this.constructor = child;
		}
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		child.__super__ = parent.prototype;
		return child;
	};

Icon = (function() {
	function Icon(id, title) {
		this.id = id;
		this.title = title;
		this.markup = "<div class='icon' style='background-image:url(img/icons/" + this.id + ".png)' title='" + this.title + "' id='"+this.title+"'></div>";
	}

	return Icon;

})();

Screen = (function() {
	function Screen(icons) {
		if (icons == null) {
			icons = [];
		}
		this.icons = icons;
	}

	Screen.prototype.attachIcons = function(icons) {
		if (icons == null) {
			icons = [];
		}
		return Array.prototype.push.apply(this.icons, icons);
	};

	Screen.prototype.generate = function() {
		var icon, markup, _i, _len, _ref;
		markup = [];
		_ref = this.icons;
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			icon = _ref[_i];
			markup.push(icon.markup);
		}
		return "<div class='screen'>" + (markup.join('')) + "</div>";
	};

	return Screen;

})();

Stage = (function() {
	Stage.prototype.screenWidth = 800;

	function Stage(icons) {
		var i, num, s;
		this.currentScreen = 0;
		this.screens = [];
		num = Math.ceil(icons.length / 15);
		i = 0;
		while (num--) {
			s = new Screen(icons.slice(i, i + 15));
			this.screens.push(s);
			i += 9;
		}
	}

	Stage.prototype.addScreensTo = function(element) {
		var screen, _i, _len, _ref, _results;
		this.element = $(element);
		this.element.width(this.screens.length * this.screenWidth);
		_ref = this.screens;
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			screen = _ref[_i];
			_results.push(this.element.append(screen.generate()));
		}
		return _results;
	};

	Stage.prototype.addIndicatorsTo = function(elem) {
		var screen, _i, _len, _ref;
		this.ul = $(elem);
		_ref = this.screens;
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			screen = _ref[_i];
			this.ul.append('<li>');
		}
		return this.ul.find('li:first').addClass('active');
	};

	Stage.prototype.goTo = function(screenNum) {
		var from, to, _ref, _ref1;
		if (this.element.is(':animated')) {
			return false;
		}
		if (this.currentScreen === screenNum) {
			_ref = ['+=15', '-=15'], from = _ref[0], to = _ref[1];
			if (this.currentScreen !== 0) {
				_ref1 = [to, from], from = _ref1[0], to = _ref1[1];
			}
			return this.element.animate({
				marginLeft: from
			}, 200).animate({
				marginLeft: to
			}, 200);
		} else {
			this.element.animate({
				marginLeft: -screenNum * this.screenWidth
			}, 600, (function(_this) {
				return function() {
					return _this.currentScreen = screenNum;
				};
			})(this));
			return this.ul.find('li').removeClass('active').eq(screenNum).addClass('active');
		}
	};

	Stage.prototype.next = function() {
		var toShow;
		toShow = this.currentScreen + 1;
		if (toShow === this.screens.length) {
			toShow = this.screens.length - 1;
		}
		return this.goTo(toShow);
	};

	Stage.prototype.previous = function() {
		var toShow;
		toShow = this.currentScreen - 1;
		if (toShow === -1) {
			toShow = 0;
		}
		return this.goTo(toShow);
	};

	return Stage;

})();

$(function() {
	var allIcons, allScreens, icon, stage, _i, _len, _results;
	allIcons = [new Icon('BallMaze', '3D_Ball_Maze'),new Icon('spider', 'Spider_Solitaire'),new Icon('PDFReader', 'PDF_Reader'),new Icon('map3D', '3D_Map')];
	allScreens = $('#allScreens');
	allScreens.Touchable();
	stage = new Stage(allIcons);
	stage.addScreensTo(allScreens);
	stage.addIndicatorsTo('#indicators');
	allScreens.bind('touchablemove', function(e, touch) {
		if (touch.currentDelta.x < -15) {
			stage.next();
		}
		if (touch.currentDelta.x > 15) {
			return stage.previous();
		}
	});
	_results = [];
	return _results;
});