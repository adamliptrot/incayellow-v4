"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reInitialiseSchematic = exports.initialiseSchematic = void 0;

var _polyfills = require("./polyfills.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Schematic =
/*#__PURE__*/
function () {
  function Schematic(options) {
    _classCallCheck(this, Schematic);

    this.el = options.el.getSVGDocument().querySelector('svg');
    this.arrayComponents = [];
    this.nav = options.nav; //set opacity etc ready for fade in

    this.reset(this.animate);
    this.assignEvents();
    this.findPageTags();
    this.findArchiveTags(); // set initial dark mode

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
      var _this = this; //console.log('animate')
      //fade in each component


      setTimeout(_this.fadeInComponent(_this.arrayComponents.pop()), 1000); //draw bodywork lines

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
      var _this = this; // reset nav


      [].slice.call((0, _polyfills.queryAll)(_this.nav + ' a')).forEach(function (n, i) {
        n.classList.remove('active');
        n.classList.add('inactive');
      }); // reset active components

      var activeComp = _this.el.querySelectorAll('#blueprint > g.active');

      if (activeComp.length > 0) {
        activeComp.forEach(function (c) {
          c.setAttribute('class', 'inactive');
        });
      } // line-draw each path


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
      comp.classList.add('layer-show'); //comp.style.opacity = 1;

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
      var _this = this; //MAP
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
        }); //add hover state to targeted component

        _this.el.querySelector('#' + comp).classList.add('hover'); // var mouseOver = new MouseEvent('mousemove', {
        //     'view': window,
        //     'bubbles': false,
        //     'cancelable': true
        //     });
        //set other components to inactive (this effectively just removes the hover/fade classes)


        [].slice.call((0, _polyfills.siblings)(_this.el.querySelector('#' + comp), _this.el.querySelectorAll('#blueprint  > g'))).forEach(function (n, i) {
          n.classList.remove('hover');
          n.classList.remove('fade');
        }); //if there are active components, fade them out a little

        var sib = [].slice.call((0, _polyfills.siblings)(_this.el.querySelector('#' + comp), _this.el.querySelectorAll('#blueprint > g.active')));

        if (sib.length > 0) {
          sib[0].classList.add('fade');
        }
      } //NAV
      //-----------
      //reset all nav items


      [].slice.call((0, _polyfills.queryAll)(_this.nav + ' a')).forEach(function (n, i) {
        n.classList.remove('hover');
        n.classList.remove('fade');
      }); //add hover state to target navigation item

      var hoverMenu = (0, _polyfills.query)(_this.nav + ' [data-system="' + comp + '"]');

      if (hoverMenu) {
        hoverMenu.classList.add('hover');
      } //fade out the active item a little if it isn't the one being targeted


      if (!(0, _polyfills.query)(_this.nav + ' [data-system="' + comp + '"].active') && (0, _polyfills.query)(_this.nav + ' a.active')) {
        (0, _polyfills.query)(_this.nav + ' a.active').classList.add('fade');
      }
    }
  }, {
    key: "resetComponents",
    value: function resetComponents() {
      var _this = this; // find active navigation items and highlight them


      var activeNav = [].slice.call((0, _polyfills.queryAll)(_this.nav + ' .active'));
      activeNav.forEach(function (nav) {
        var activeLayer = nav.getAttribute('data-system');

        _this.highlightComponent(activeLayer); // highlight in the schematic if a layer is present (ie not for general tags like 'driving')


        if ((0, _polyfills.query)('#' + activeLayer)) {
          var exantClass = (0, _polyfills.query)('#' + activeLayer).getAttribute('class');
          (0, _polyfills.query)('#' + activeLayer).setAttribute('class', exantClass + ' active');
        }
      }); // remove any hover effects

      [].slice.call((0, _polyfills.queryAll)(_this.nav + ' a')).forEach(function (n, i) {
        n.classList.remove('hover');
        n.classList.remove('fade');
      }); //handle schematic

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
        el.addEventListener('mousemove, focus', function (ev) {
          _this.highlightComponent(el.getAttribute('data-system'));
        });
        el.addEventListener('mouseout, blur', function (ev) {
          _this.resetComponents();
        });
      }, this);
      [].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function (el, i) {
        el.addEventListener('mousemove, focus', function (ev) {
          _this.highlightComponent(el.getAttribute('id'));
        });
      }, this);

      _this.el.addEventListener('mouseout, blur', function (ev) {
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