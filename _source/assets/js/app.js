(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lazyLoadThumbnails;
function lazyLoadThumbnails(selector) {
  //console.log('load thumbs')
  var thumbs = [].slice.call(document.querySelectorAll("." + selector));
  processArray(thumbs, loadImage);
  function processArray(items) {
    var todo = items.concat();
    //console.log(todo)
    setTimeout(function () {
      loadImage(todo.shift());
      if (todo.length > 0) {
        setTimeout(processArray(todo), 25);
      }
    }, 25);
  }
  function loadImage(img) {
    //console.log(img.src);
    if (img) {
      if (img.complete) {
        //console.log('immediately loaded ' + img.src);
        loaded(img);
      } else {
        //setTimeout(function(){
        //console.log('adding listener')
        img.addEventListener('load', function () {
          //console.log('lazy loaded ' + img.src);
          loaded(img);
        });
        img.addEventListener('error', function (loaderror) {
          return console.log(loaderror);
        }); // eslint-disable-line no-console, max-len
        //}, 25)
      }
    }
  }
  function loaded(image) {
    //console.log('loaded ' + image.src);
    image.classList.add(selector + '--loaded');
  }
  // let thumbs = document.querySelectorAll('.moment__thumb')
  // thumbs.forEach(function(img){
  //   console.log(img.src);
  //   if (img) {
  //     if (img.complete) {
  //       // console.log('immediately loaded ' + img.src);
  //       loaded(img);
  //     } else {
  //       img.addEventListener('load', () => {
  //         // console.log('lazy loaded ' + img.src);
  //         loaded(img);
  //       });
  //       img.addEventListener('error', (loaderror) => console.log(loaderror)); // eslint-disable-line no-console, max-len
  //     }
  //   }
  // })
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.siblings = siblings;
exports.upTo = upTo;
exports.queryAll = exports.query = void 0;
var query = document.querySelector.bind(document);
exports.query = query;
var queryAll = document.querySelectorAll.bind(document);
// var fromId = document.getElementById.bind(document);
// var fromClass = document.getElementsByClassName.bind(document);
// var fromTag = document.getElementsByTagName.bind(document);
exports.queryAll = queryAll;
function siblings(node, children) {
  children = [].slice.call(children);
  var siblingList = children.filter(function (val) {
    return [node].indexOf(val) == -1;
  });
  return siblingList;
}

// Find first ancestor of el with tagName
// or undefined if not found
function upTo(el, tagName) {
  tagName = tagName.toLowerCase();
  while (el && el.parentNode) {
    el = el.parentNode;
    if (el.tagName && el.tagName.toLowerCase() == tagName) {
      return el;
    }
  }

  // Many DOM methods return null if they don't
  // find the element they are searching for
  // It would be OK to omit the following and just
  // return undefined
  return null;
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialiseSchematicSide = exports.reInitialiseSchematic = exports.initialiseSchematic = void 0;
var _polyfills = require("./polyfills.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
var Schematic = /*#__PURE__*/function () {
  function Schematic(options) {
    _classCallCheck(this, Schematic);
    this.el = options.el.getSVGDocument().querySelector('svg');
    this.arrayComponents = [];
    this.nav = options.nav;

    //set opacity etc ready for fade in
    this.reset(this.animate);
    this.assignEvents();
    this.findPageTags();
    this.findArchiveTags();

    // set initial dark mode
    if (document.querySelector('body').classList.contains('theme--dark')) {
      this.el.classList.add("theme--dark");
    }
  }
  _createClass(Schematic, [{
    key: "findPageTags",
    value: function findPageTags() {
      var _this = this;
      var pageTags = document.querySelectorAll('.tags__tag');
      if (!pageTags) return;
      pageTags.forEach(function (tag) {
        if (tag) {
          tag = tag.innerText.split(" ").join("-");
          _this.activeTag(tag);
        }
      });
    }
  }, {
    key: "findArchiveTags",
    value: function findArchiveTags() {
      var _this = this;
      var archiveTag = document.querySelector('body').getAttribute("data-tags");
      if (!archiveTag) return;
      if (archiveTag) {
        archiveTag = archiveTag.split(" ").join("-");
        _this.activeTag(archiveTag);
      }
    }
  }, {
    key: "activeTag",
    value: function activeTag(tagName) {
      var tagNav = (0, _polyfills.query)(".archive-map [data-system=\"".concat(tagName, "\"]"));
      if (tagNav) {
        tagNav.classList.remove('inactive');
        tagNav.classList.add('active');
      }
      var tagSchematic = this.el.querySelector("#".concat(tagName));
      if (tagSchematic) {
        tagSchematic.classList.remove('inactive');
        tagSchematic.classList.add('active');
      }
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this = this;
      //console.log('animate')
      //fade in each component
      setTimeout(_this.fadeInComponent(_this.arrayComponents.pop()), 1000);

      //draw bodywork lines
      setTimeout(function () {
        //console.log(this.arrayComponents[this.arrayComponents.length - 1].getElementsByTagName('path')[0]);
        //this.arrayComponents[this.arrayComponents.length - 1].getElementsByTagName('path')[0].addEventListener('onend', function (e) {
        //this.unbind('onend');
        //console.log('ended');
        [].slice.call(_this.el.querySelectorAll('#bodywork path')).forEach(function (path, j) {
          //path.style.opacity = 1;
          path.style.stroke = "#999";
          path.style.strokeWidth = "4px";
          var length = path.getTotalLength();
          path.style.transition = path.style.WebkitTransition = 'none';
          path.style.strokeDasharray = length + ' ' + length;
          path.style.strokeDashoffset = length;
          path.getBoundingClientRect();
          path.style.transition = path.style.WebkitTransition = 'all 4s ease-in-out';
          path.style.strokeDashoffset = '0';
        });
        setTimeout(function () {
          //fill bodywork
          [].slice.call(_this.el.querySelectorAll('g path')).forEach(function (path, j) {
            path.removeAttribute("style");
            path.style.strokeWidth = "4px";
          });
          _this.el.querySelector('g path').style.WebkitTransition = "fill 0.75s ease-in-out";
          _this.el.querySelector('g path').style.fill = "#f7c606";
        }, 2000);
      }, 2000);
    }
  }, {
    key: "reset",
    value: function reset(callback) {
      var _this = this;
      // reset nav
      [].slice.call((0, _polyfills.queryAll)(_this.nav + ' a')).forEach(function (n, i) {
        n.classList.remove('active');
        n.classList.add('inactive');
      });

      // reset active components
      var activeComp = _this.el.querySelectorAll('#blueprint > g.active');
      if (activeComp.length > 0) {
        activeComp.forEach(function (c) {
          c.setAttribute('class', 'inactive');
        });
      }
      // line-draw each path
      [].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function (el, i) {
        // el.classList.add('layer-notrans');
        // el.classList.add('layer-hide');
        if (el.getAttribute('id') != 'bodywork-and-exterior') {
          [].slice.call(el.querySelectorAll('path')).forEach(function (path, j) {
            path.style.stroke = "#333";
            path.style.strokeWidth = "6px";
            if (!el.classList.contains('active')) {
              var length = path.getTotalLength();
              path.style.transition = path.style.WebkitTransition = 'none';
              path.style.strokeDasharray = length + ' ' + length;
              path.style.strokeDashoffset = length;
              path.getBoundingClientRect();
            }
          });
        }
        _this.arrayComponents.push(el);
      });
      callback.call(_this);
    }
  }, {
    key: "fadeInComponent",
    value: function fadeInComponent(comp) {
      var _this = this;
      comp.classList.remove('layer-notrans');
      comp.classList.remove('layer-hide');
      comp.classList.add('layer-show');
      //comp.style.opacity = 1;
      setTimeout(function () {
        if (_this.arrayComponents.length > 0) {
          _this.fadeInComponent(_this.arrayComponents.pop());
          [].slice.call(comp.querySelectorAll('path')).forEach(function (line, i) {
            _this.drawBlueprint(line);
          });
        }
      }, 300);
    }
  }, {
    key: "drawBlueprint",
    value: function drawBlueprint(thisPath) {
      thisPath.style.transition = thisPath.style.WebkitTransition = 'all 1s ease-in-out';
      thisPath.style.strokeDashoffset = '0';
    }
  }, {
    key: "highlightComponent",
    value: function highlightComponent(comp) {
      var _this = this;
      //MAP
      //-----------
      if (_this.el.querySelectorAll('#' + comp).length == 0) {
        //console.log('reset all');
        //set all components to inactive - one of the non-component nav items has been actioned (general, all, driving etc)
        [].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function (g, i) {
          g.classList.add('fade');
        });
      } else {
        //remove fade
        [].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function (g, i) {
          g.classList.remove('fade');
        });
        //add hover state to targeted component
        _this.el.querySelector('#' + comp).classList.add('hover');

        // var mouseOver = new MouseEvent('mousemove', {
        //     'view': window,
        //     'bubbles': false,
        //     'cancelable': true
        //     });

        //set other components to inactive (this effectively just removes the hover/fade classes)
        [].slice.call((0, _polyfills.siblings)(_this.el.querySelector('#' + comp), _this.el.querySelectorAll('#blueprint  > g'))).forEach(function (n, i) {
          n.classList.remove('hover');
          n.classList.remove('fade');
        });

        //if there are active components, fade them out a little
        var sib = [].slice.call((0, _polyfills.siblings)(_this.el.querySelector('#' + comp), _this.el.querySelectorAll('#blueprint > g.active')));
        if (sib.length > 0) {
          sib[0].classList.add('fade');
        }
      }

      //NAV
      //-----------
      //reset all nav items
      [].slice.call((0, _polyfills.queryAll)(_this.nav + ' a')).forEach(function (n, i) {
        n.classList.remove('hover');
        n.classList.remove('fade');
      });

      //add hover state to target navigation item
      var hoverMenu = (0, _polyfills.query)(_this.nav + ' [data-system="' + comp + '"]');
      if (hoverMenu) {
        hoverMenu.classList.add('hover');
      }

      //fade out the active item a little if it isn't the one being targeted
      if (!(0, _polyfills.query)(_this.nav + ' [data-system="' + comp + '"].active') && (0, _polyfills.query)(_this.nav + ' a.active')) {
        (0, _polyfills.query)(_this.nav + ' a.active').classList.add('fade');
      }
    }
  }, {
    key: "resetComponents",
    value: function resetComponents() {
      var _this = this;

      // find active navigation items and highlight them
      var activeNav = [].slice.call((0, _polyfills.queryAll)(_this.nav + ' .active'));
      activeNav.forEach(function (nav) {
        var activeLayer = nav.getAttribute('data-system');
        _this.highlightComponent(activeLayer);
        // highlight in the schematic if a layer is present (ie not for general tags like 'driving')
        if ((0, _polyfills.query)('#' + activeLayer)) {
          var exantClass = (0, _polyfills.query)('#' + activeLayer).getAttribute('class');
          (0, _polyfills.query)('#' + activeLayer).setAttribute('class', exantClass + ' active');
        }
      });

      // remove any hover effects
      [].slice.call((0, _polyfills.queryAll)(_this.nav + ' a')).forEach(function (n, i) {
        n.classList.remove('hover');
        n.classList.remove('fade');
      });

      //handle schematic
      if (_this.el.querySelectorAll('#blueprint > g.active').length == 0) {
        [].slice.call(_this.el.querySelectorAll('#blueprint > g.active')).forEach(function (c, i) {
          c.classList.remove('hover');
          c.classList.remove('fade');
        });
      } else {
        _this.el.querySelector('#blueprint > g.active').setAttribute('class', 'inactive');
      }
    }
  }, {
    key: "assignEvents",
    value: function assignEvents() {
      //archive menu

      // var mouseOut = new MouseEvent('mouseout', {
      //     'view': window,
      //     'bubbles': false,
      //     'cancelable': true
      // });
      var _this = this;
      [].slice.call((0, _polyfills.queryAll)(this.nav + ' a')).forEach(function (el, i) {
        el.addEventListener('mousemove', function (ev) {
          _this.highlightComponent(el.getAttribute('data-system'));
        });
        el.addEventListener('focus', function (ev) {
          _this.highlightComponent(el.getAttribute('data-system'));
        });
        el.addEventListener('mouseout', function (ev) {
          _this.resetComponents();
        });
        el.addEventListener('blur', function (ev) {
          _this.resetComponents();
        });
      }, this);
      [].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function (el, i) {
        el.addEventListener('mousemove', function (ev) {
          _this.highlightComponent(el.getAttribute('id'));
        });
        el.addEventListener('focus', function (ev) {
          _this.highlightComponent(el.getAttribute('id'));
        });
      }, this);
      _this.el.addEventListener('mouseout', function (ev) {
        _this.resetComponents();
      });
      _this.el.addEventListener('blur', function (ev) {
        _this.resetComponents();
      });
      [].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function (c, i) {
        c.addEventListener('click', function (e) {
          e.preventDefault();
          window.location.href = '/archives/' + c.getAttribute('id');
        });
      });
    }
  }]);
  return Schematic;
}();
var schematicEl = document.querySelector('#schematic__host');
var initialiseSchematic = function initialiseSchematic() {
  if (schematicEl) {
    var runSchematic = function runSchematic(entries, observer) {
      entries.forEach(function (entry) {
        if (entry.intersectionRatio > 0) {
          var schematic = new Schematic({
            el: schematicEl,
            nav: '.archive-map'
          });
          observer.unobserve(entry.target);
        }
      });
    };
    document.querySelector(".schematic__blueprint").setAttribute("style", "zoom:1;");
    document.querySelector(".wrap").setAttribute("style", "zoom:1;");
    var observer = new IntersectionObserver(runSchematic, {
      rootMargin: '0px',
      threshold: 0
    });
    observer.observe(schematicEl);
  }
};
exports.initialiseSchematic = initialiseSchematic;
var reInitialiseSchematic = function reInitialiseSchematic() {
  if (schematicEl) {
    var schematic = new Schematic({
      el: schematicEl,
      nav: '.archive-map'
    });
  }
};
exports.reInitialiseSchematic = reInitialiseSchematic;
var SchematicSide = /*#__PURE__*/function () {
  function SchematicSide(options) {
    _classCallCheck(this, SchematicSide);
    this.el = options.el;
    //console.log(this.el);
    this.supportsAnchor = CSS.supports('anchor-name: --myAnchor');
    this.anchorMediaQuery = window.matchMedia('(min-width: 1000px)');
    this.assignEvents();
  }
  _createClass(SchematicSide, [{
    key: "assignEvents",
    value: function assignEvents() {
      var _this = this;
      var sch = this.el;

      // schematic numbering
      //====================
      [].slice.call(sch.querySelectorAll('.schematic-side__blueprint .schematic__number')).forEach(function (point, i) {
        // open popup for this point
        //==================================
        point.addEventListener('click', function () {
          _this.relay(point);
        });

        // close any open popups when focus moves to a new point
        //==================================
        point.addEventListener('focus', function () {
          _this.unrelay();
        });
      });
      document.querySelector('body').addEventListener('keyup', function (event) {
        if (event.key == "Escape") {
          _this.unrelay();
        }
      });

      // schematic photo numbers
      //========================
      [].slice.call(sch.querySelectorAll('.schematic-side__map .schematic__number')).forEach(function (point, i) {
        //     // expand click listener to the image
        //     var fig = upTo(point, 'figure');
        //     if(fig){
        //         fig.addEventListener('click', function(){_this.relay(point)});
        //     }            
        point.addEventListener('click', function () {
          _this.relay(point);
        });
      });
    }
  }, {
    key: "unrelay",
    value: function unrelay() {
      var _this = this.el;
      //console.log('unrelay ' + _this);
      [].slice.call(_this.querySelectorAll('.schematic-focus')).forEach(function (n) {
        n.classList.remove('schematic-focus');
        //console.log('rem from ' + n)
      });
    }
  }, {
    key: "relay",
    value: function relay(point) {
      var _this = this;
      _this.unrelay();
      // allow time for unrelay to work
      setTimeout(function () {
        var dataImgID = point.getAttribute("data-img");
        var img = document.querySelectorAll('#' + dataImgID);
        if (_this.supportsAnchor && _this.anchorMediaQuery.matches) {
          // show image popup
          if (img) {
            img[0].classList.add("schematic-focus");
          }
        } else {
          // jump focus to image grid
          img[2].focus();
        }
      }, 50);
    }
  }]);
  return SchematicSide;
}();
var initialiseSchematicSide = function initialiseSchematicSide() {
  [].slice.call((0, _polyfills.queryAll)('.schematic-side')).forEach(function (s) {
    new SchematicSide({
      el: s
    });
  });
};
exports.initialiseSchematicSide = initialiseSchematicSide;

},{"./polyfills.js":2}],4:[function(require,module,exports){
"use strict";

var _schematic = require("./app/schematic");
var _lazyLoadThumbnails = _interopRequireDefault(require("./app/lazyLoadThumbnails"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//import Moments from "./app/moments"

//import loadPages from "./app/loadPages"

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
"document" in self && ("classList" in document.createElement("_") && (!document.createElementNS || "classList" in document.createElementNS("http://www.w3.org/2000/svg", "g")) || !function (t) {
  "use strict";

  if ("Element" in t) {
    var e = "classList",
      n = "prototype",
      i = t.Element[n],
      s = Object,
      r = String[n].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
      },
      o = Array[n].indexOf || function (t) {
        for (var e = 0, n = this.length; n > e; e++) {
          if (e in this && this[e] === t) return e;
        }
        return -1;
      },
      c = function c(t, e) {
        this.name = t, this.code = DOMException[t], this.message = e;
      },
      a = function a(t, e) {
        if ("" === e) throw new c("SYNTAX_ERR", "The token must not be empty.");
        if (/\s/.test(e)) throw new c("INVALID_CHARACTER_ERR", "The token must not contain space characters.");
        return o.call(t, e);
      },
      l = function l(t) {
        for (var e = r.call(t.getAttribute("class") || ""), n = e ? e.split(/\s+/) : [], i = 0, s = n.length; s > i; i++) {
          this.push(n[i]);
        }
        this._updateClassName = function () {
          t.setAttribute("class", this.toString());
        };
      },
      u = l[n] = [],
      h = function h() {
        return new l(this);
      };
    if (c[n] = Error[n], u.item = function (t) {
      return this[t] || null;
    }, u.contains = function (t) {
      return ~a(this, t + "");
    }, u.add = function () {
      var t,
        e = arguments,
        n = 0,
        i = e.length,
        s = !1;
      do {
        t = e[n] + "", ~a(this, t) || (this.push(t), s = !0);
      } while (++n < i);
      s && this._updateClassName();
    }, u.remove = function () {
      var t,
        e,
        n = arguments,
        i = 0,
        s = n.length,
        r = !1;
      do {
        for (t = n[i] + "", e = a(this, t); ~e;) {
          this.splice(e, 1), r = !0, e = a(this, t);
        }
      } while (++i < s);
      r && this._updateClassName();
    }, u.toggle = function (t, e) {
      var n = this.contains(t),
        i = n ? e !== !0 && "remove" : e !== !1 && "add";
      return i && this[i](t), e === !0 || e === !1 ? e : !n;
    }, u.replace = function (t, e) {
      var n = a(t + "");
      ~n && (this.splice(n, 1, e), this._updateClassName());
    }, u.toString = function () {
      return this.join(" ");
    }, s.defineProperty) {
      var f = {
        get: h,
        enumerable: !0,
        configurable: !0
      };
      try {
        s.defineProperty(i, e, f);
      } catch (p) {
        void 0 !== p.number && -2146823252 !== p.number || (f.enumerable = !1, s.defineProperty(i, e, f));
      }
    } else s[n].__defineGetter__ && i.__defineGetter__(e, h);
  }
}(self), function () {
  "use strict";

  var t = document.createElement("_");
  if (t.classList.add("c1", "c2"), !t.classList.contains("c2")) {
    var e = function e(t) {
      var e = DOMTokenList.prototype[t];
      DOMTokenList.prototype[t] = function (t) {
        var n,
          i = arguments.length;
        for (n = 0; i > n; n++) {
          t = arguments[n], e.call(this, t);
        }
      };
    };
    e("add"), e("remove");
  }
  if (t.classList.toggle("c3", !1), t.classList.contains("c3")) {
    var n = DOMTokenList.prototype.toggle;
    DOMTokenList.prototype.toggle = function (t, e) {
      return 1 in arguments && !this.contains(t) == !e ? e : n.call(this, t);
    };
  }
  "replace" in document.createElement("_").classList || (DOMTokenList.prototype.replace = function (t, e) {
    var n = this.toString().split(" "),
      i = n.indexOf(t + "");
    ~i && (n = n.slice(i), this.remove.apply(this, n), this.add(e), this.add.apply(this, n.slice(1)));
  }), t = null;
}());
window.addEventListener('DOMContentLoaded', function () {
  //  const moment = new Moments()
  if (document.querySelector('.moment__thumb')) {
    (0, _lazyLoadThumbnails.default)('moment__thumb');
  }
  if (document.querySelector('.hero__image')) {
    (0, _lazyLoadThumbnails.default)('hero__image');
  }
  //loadPages();
}); // eslint-disable-line no-unused-vars, max-len

window.onload = function () {
  (0, _schematic.initialiseSchematic)();
  (0, _schematic.initialiseSchematicSide)();
};
//resize, needs debouncing
addEventListener('resize', function () {
  (0, _schematic.initialiseSchematic)();
});

},{"./app/lazyLoadThumbnails":1,"./app/schematic":3}]},{},[4]);
