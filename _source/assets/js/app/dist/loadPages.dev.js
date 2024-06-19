"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadPages;

var _polyfills = require("./polyfills.js");

var _filters = require("./filters.js");

var _lazyLoadThumbnails = _interopRequireDefault(require("./lazyLoadThumbnails"));

var _schematic = require("./schematic");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    }) // .then(res => new Promise(resolve => setTimeout(() => resolve(res), 5000)))
    .then(function (data) {
      // body class
      (0, _polyfills.query)('body').classList.remove('shortcopy');

      if (data.content.length < contentThreshold && data.images[0].media && data.images[0].media != "video") {
        (0, _polyfills.query)('body').classList.add('shortcopy');
      } // page title


      document.title = data.title; // main content

      container.innerHTML = data.content; // header

      (0, _polyfills.query)('h1').innerHTML = data.title; // date

      (0, _polyfills.query)('.head time').innerHTML = (0, _filters.parseDate)(data.date); // prev / next links

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
      } // main image


      (0, _polyfills.query)('.hero__imagewrap').innerHTML = (0, _filters.heroTemplate)(data.images); // other images

      (0, _polyfills.query)('.photos').innerHTML = (0, _filters.imageList)(data.images, data.content.length > contentThreshold);
      (0, _lazyLoadThumbnails["default"])('hero__image'); // tags

      (0, _polyfills.query)('.tags ul').innerHTML = (0, _filters.tagTemplate)(data.tags); // reset scroll position

      window.scrollTo(0, 0); // need to manage focus

      document.querySelectorAll('h1')[0].setAttribute('tabindex', "-1");
      setTimeout(function () {
        document.querySelectorAll('h1')[0].focus();
      }, 500); // reattach event listeners

      hookLinks(); // schematic

      (0, _schematic.reInitialiseSchematic)();
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
        } // don't follow links that are loaded


        if (pathname === window.location.pathname) {
          return;
        }

        window.history.pushState(null, null, pathname);
        loadContent(pathname);
      }, false);
    });
  }
}