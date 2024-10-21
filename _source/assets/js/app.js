(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var slugify = require('../lib/slugify');
exports.parseDate = function (stringDate) {
  var theDate = new Date(stringDate);
  var theDateFormatted = theDate.getDate() + " " + allMonthNames('short')[theDate.getMonth()] + " " + theDate.getFullYear();
  return theDateFormatted;
};
exports.allMonthNames = function (format) {
  return allMonthNames(format);
};
exports.tagTemplate = function (tags) {
  var ret = '';
  if (tags.length > 0) {
    tags.forEach(function (tag, i) {
      ret = ret + "<li><a href=\"/archives/".concat(slugify(tag), "\" data-tag=\"").concat(tag, "\"><span class=\"tags__tag\">").concat(tag, "</span></a></li>");
    });
  }
  return ret;
};
exports.heroTemplate = function (images, thresholdExceeded) {
  var ret = "";
  if (images[0].media && images[0].media == "video") {
    //ret = `<video src="https://live.staticflickr.com/video/${ images[0].id }/${images[0].secret }/appletv.mp4" width="100%" poster="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_d.jpg" controls=""></video>`
    //ret = `<video src="/assets/videos/${images[0].url}" width="100%" poster="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_d.jpg" controls=""></video>`
    ret = "\n        <div style=\"padding:75% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/".concat(images[0].url, "?title=0&byline=0&portrait=0\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"></script>\n            ");
  } else {
    if (images.length == 1 && images[0].caption && images[0].caption > "") {
      ret = ret + "<figure><div class=\"hero__imagewrap--inner\">";
    } else {
      ret = ret + "<div class=\"hero__imagewrap--inner\">";
    }
    ret = ret + "\n            <img aria-hidden=\"true\" class=\"placeholder\" src=\"https://farm9.static.flickr.com/".concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_m.jpg\" alt=\"\" />\n            <img class=\"hero__image\" data-source=\"https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "\"\n                srcset=\"https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_m.jpg 500w,\n                https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_z.jpg 640w,\n                https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_c.jpg 800w,\n                https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_b.jpg 1024w\"\n                ").concat(thresholdExceeded ? 'sizes="(max-width: 2000px) 100%"' : 'sizes="(max-width: 999px) 100%, (max-width: 1999px) 33vw"', "\n                data-orient=\"landscape\" src=\"https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_b.jpg\" alt=\"").concat(images.length == 1 && images[0].alt ? images[0].alt : '', "\" />");
    if (images.length == 1 && images[0].caption && images[0].caption > "") {
      ret = ret + "</div><figcaption>".concat(images[0].caption, " <a href=\"https://flickr.com/photos/adamliptrot/").concat(images[0].id, "\">View photo</a></figcaption></figure>");
    } else {
      ret = ret + "</div>";
    }
  }
  return ret;
};
exports.mediaDisplay = function (image, passthrough) {
  return mediaDisplay(image, passthrough);
};
exports.placeholders = function (content, imgs) {
  var newContent = content;
  imgs.forEach(function (image) {
    // let re = new RegExp('\/\/PH+' + image.marker + '}\b', "g");
    newContent = newContent.replace("//PH".concat(image.marker), mediaDisplay(image));
  });
  return newContent;
};
exports.imageList = function (images, thresholdExceeded) {
  var ret = "";
  var imgCount = 0;
  images.forEach(function (image, currentItemIndex) {
    if (!image.marker) {
      if (imgCount % 2 == 0) {
        ret = ret + "<div class=\"photoinsert\">";
      }
      ret = ret + mediaDisplay(image);
      if (imgCount % 2 != 0 || imgCount == images.length - 1) {
        ret = ret + "</div>";
      }
      imgCount++;
    }
  });
  return ret;
};
var allMonthNames = function allMonthNames(format) {
  var monthNames;
  if (format == 'long') {
    monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  } else {
    monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  }
  return monthNames;
};
var mediaDisplay = function mediaDisplay(image) {
  var passthrough = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var videoImage = "";
  if (image.media == "video") {
    videoImage = "data-video=\"".concat(image.secret, ",").concat(image.id, "\"");
  }
  var ret = "\n            <figure>                \n                <img loading=\"lazy\" data-source=\"https://farm9.static.flickr.com/".concat(image.server, "/").concat(image.id, "_").concat(image.secret, "\"\n                            srcset=\"https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_m.jpg 500w,\n                            https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_z.jpg 640w,\n                            https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_c.jpg 800w,\n                            https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_b.jpg 1024w\"\n                            'sizes=\"(max-width: 799px) 100%, (min-width: 800px) 440px\"' \n                            ").concat(videoImage, "\n                            data-orient=\"").concat(image.orient || "landscape", "\" src=\"https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_b.jpg\" alt=\"").concat(image.alt ? image.alt : '', "\" />                \n                <figcaption>").concat(passthrough, " ").concat(image.caption, " <a href=\"https://flickr.com/photos/adamliptrot/").concat(image.id, "\">View photo</a></figcaption>\n            </figure>");
  return ret;
};

},{"../lib/slugify":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadPages;
var _polyfills = require("./polyfills.js");
var _filters = require("./filters.js");
var _lazyLoadThumbnails = _interopRequireDefault(require("./lazyLoadThumbnails"));
var _schematic = require("./schematic");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function loadPages() {
  var contentThreshold = 1000;
  window.addEventListener('popstate', function (event) {
    loadContent(window.location.pathname);
  });
  hookLinks();
  function loadContent(pathname) {
    var article = (0, _polyfills.query)('.post');
    var container = (0, _polyfills.query)('.post .content');
    fetch(pathname + 'index.json').then(function (res) {
      return res.json();
    })
    // .then(res => new Promise(resolve => setTimeout(() => resolve(res), 5000)))
    .then(function (data) {
      // body class
      (0, _polyfills.query)('body').classList.remove('shortcopy');
      if (data.content.length < contentThreshold && data.images[0].media && data.images[0].media != "video") {
        (0, _polyfills.query)('body').classList.add('shortcopy');
      }
      // page title
      document.title = data.title;
      // main content
      console.log(data.content);
      container.innerHTML = (0, _filters.placeholders)(data.content, data.images);
      // header
      (0, _polyfills.query)('h1').innerHTML = data.title;
      // date
      (0, _polyfills.query)('.head time').innerHTML = (0, _filters.parseDate)(data.date);
      // prev / next links
      if (data.prevPost.title != undefined) {
        if ((0, _polyfills.query)('[rel="Previous"]')) {
          (0, _polyfills.query)('[rel="Previous"]').setAttribute('href', data.prevPost.url);
          (0, _polyfills.query)('[rel="Previous"] .further-reading__title').innerHTML = data.prevPost.title;
        } else {
          // add previous link
          (0, _polyfills.query)('.further-reading--post ul').insertAdjacentHTML('afterbegin', '<li class="further-reading__prev"><a title="read previous post" href="' + data.prevPost.url + '" rel="Previous"><span aria-hidden="true">&larr;&nbsp;</span><span class="further-reading__title">' + data.prevPost.title + '</span></a></li>');
        }
      } else {
        (0, _polyfills.query)('.further-reading__prev').remove();
      }
      if (data.nextPost.title != undefined) {
        if ((0, _polyfills.query)('[rel="Next"]')) {
          (0, _polyfills.query)('[rel="Next"]').setAttribute('href', data.nextPost.url);
          (0, _polyfills.query)('[rel="Next"] .further-reading__title').innerHTML = data.nextPost.title;
        } else {
          // add next link
          (0, _polyfills.query)('.further-reading--post ul').insertAdjacentHTML('beforeend', '<li class="further-reading__next"><a title="read next post" href="' + data.nextPost.url + '" rel="Next"><span class="further-reading__title">' + data.nextPost.title + '</span><span aria-hidden="true">&nbsp;&rarr;</span></a></li>');
        }
      } else {
        (0, _polyfills.query)('.further-reading__next').remove();
      }
      // main image
      (0, _polyfills.query)('.hero__imagewrap').innerHTML = (0, _filters.heroTemplate)(data.images);
      // other images
      (0, _polyfills.query)('.photos').innerHTML = (0, _filters.imageList)(data.images, data.content.length > contentThreshold);
      (0, _lazyLoadThumbnails.default)('hero__image');
      // tags
      (0, _polyfills.query)('.tags ul').innerHTML = (0, _filters.tagTemplate)(data.tags);
      // reset scroll position
      window.scrollTo(0, 0);
      // need to manage focus
      document.querySelectorAll('h1')[0].setAttribute('tabindex', "-1");
      setTimeout(function () {
        document.querySelectorAll('h1')[0].focus();
      }, 500);
      // reattach event listeners
      hookLinks();
      // schematic
      (0, _schematic.reInitialiseSchematic)();
      (0, _schematic.initialiseSchematicSide)();
    });
  }
  function hookLinks() {
    (0, _polyfills.queryAll)('.content a, .further-reading--post a').forEach(function (link) {
      if (link.origin !== window.location.origin) {
        return;
      }
      if (link.dataset.hooked) {
        return;
      }
      link.dataset.hooked = true;
      link.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          return; // let the browser deal with the click natively
        }
        event.preventDefault();
        var pathname = link.pathname;
        if (!pathname.endsWith('/')) {
          pathname += '/';
        }

        // don't follow links that are loaded
        if (pathname === window.location.pathname) {
          return;
        }
        window.history.pushState(null, null, pathname);
        loadContent(pathname);
      }, false);
    });
  }
}

},{"./filters.js":1,"./lazyLoadThumbnails":2,"./polyfills.js":4,"./schematic":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
    this.assignEvents();
  }
  _createClass(SchematicSide, [{
    key: "assignEvents",
    value: function assignEvents() {
      var _this = this;
      var sch = this.el;
      var supportsAnchor = CSS.supports('anchor-name: --myAnchor');

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
      setTimeout(function () {
        var dataImgID = point.getAttribute("data-img");
        var img = document.querySelector('#' + dataImgID);
        if (img) {
          img.classList.add("schematic-focus");
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

},{"./polyfills.js":4}],6:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
;
(function (name, root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
    module.exports['default'] = factory();
  }
  /* istanbul ignore next */else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root[name] = factory();
  }
})('slugify', void 0, function () {
  /* eslint-disable */
  var charMap = JSON.parse('{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","џ":"dz","Ґ":"G","ґ":"g","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₹":"indian rupee","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial"}');
  /* eslint-enable */

  function replace(string, options) {
    if (typeof string !== 'string') {
      throw new Error('slugify: string argument expected');
    }
    options = typeof options === 'string' ? {
      replacement: options
    } : options || {};
    var slug = string.split('').reduce(function (result, ch) {
      return result + (charMap[ch] || ch
      // allowed
      ).replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]/g, '');
    }, '')
    // trim leading/trailing spaces
    .trim()
    // convert spaces
    .replace(/[-\s]+/g, options.replacement || '-');
    return options.lower ? slug.toLowerCase() : slug;
  }
  replace.extend = function (customMap) {
    for (var key in customMap) {
      charMap[key] = customMap[key];
    }
  };
  return replace;
});

},{}],7:[function(require,module,exports){
"use strict";

var _schematic = require("./app/schematic");
var _lazyLoadThumbnails = _interopRequireDefault(require("./app/lazyLoadThumbnails"));
var _loadPages = _interopRequireDefault(require("./app/loadPages"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//import Moments from "./app/moments"

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
  (0, _loadPages.default)();
}); // eslint-disable-line no-unused-vars, max-len

window.onload = function () {
  (0, _schematic.initialiseSchematic)();
  (0, _schematic.initialiseSchematicSide)();
};
//resize, needs debouncing
addEventListener('resize', function () {
  (0, _schematic.initialiseSchematic)();
});

},{"./app/lazyLoadThumbnails":2,"./app/loadPages":3,"./app/schematic":5}]},{},[7]);
