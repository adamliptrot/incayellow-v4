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
      ret = ret + "<li><a href=\"/archives/".concat(slugify(tag), "\" data-tag=\"").concat(tag, "\"><span class=\"hide\">see more posts related to </span><span class=\"tags__tag\">").concat(tag, "</span></a></li>");
    });
  }

  return ret;
};

exports.heroTemplate = function (images, thresholdExceeded) {
  var ret = "";

  if (images[0].media && images[0].media == "video") {
    ret = "<video src=\"https://live.staticflickr.com/video/".concat(images[0].id, "/").concat(images[0].secret, "/appletv.mp4\" width=\"100%\" poster=\"https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_d.jpg\" controls=\"\"></video>");
  } else {
    ret = "\n            <img aria-hidden=\"true\" class=\"placeholder\" src=\"https://farm9.static.flickr.com/".concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_m.jpg\" alt=\"\" />\n            <img class=\"hero__image\" data-source=\"https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "\"\n                srcset=\"https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_m.jpg 500w,\n                https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_z.jpg 640w,\n                https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_c.jpg 800w,\n                https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_b.jpg 1024w\"\n                ").concat(thresholdExceeded ? 'sizes="(max-width: 2000px) 100%"' : 'sizes="(max-width: 999px) 100%, (max-width: 1999px) 33vw"', "\n                data-orient=\"landscape\" src=\"https://farm9.static.flickr.com/").concat(images[0].server, "/").concat(images[0].id, "_").concat(images[0].secret, "_b.jpg\" alt=\"\" />\n            ");
  }

  return ret;
};

exports.imageList = function (images, thresholdExceeded) {
  var ret = "";
  images.forEach(function (image, currentItemIndex) {
    var videoImage = "";

    if (image.media == "video") {
      videoImage = "data-video=\"".concat(image.secret, ",").concat(image.id, "\"");
    }

    if (currentItemIndex % 2 == 0) {
      ret = ret + "<div class=\"photoinsert\">";
    }

    ret = ret + "\n                <figure>\n                    <a href=\"https://flickr.com/photos/adamliptrot/".concat(image.id, "\">\n                        <img loading=\"lazy\" data-source=\"https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "\"\n                                    srcset=\"https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_m.jpg 500w,\n                                    https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_z.jpg 640w,\n                                    https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_c.jpg 800w,\n                                    https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_b.jpg 1024w\"\n                                    ").concat(thresholdExceeded ? 'sizes="(max-width: 2000px) 100%"' : 'sizes="(max-width: 799px) 100%, (min-width: 800px) 440px"', "\n                                    ").concat(videoImage, "\n                                    data-orient=\"landscape\" src=\"https://farm9.static.flickr.com/").concat(image.server, "/").concat(image.id, "_").concat(image.secret, "_b.jpg\" alt=\"").concat(image.alt ? image.alt : '', "\" />\n                    </a>\n                    <figcaption>").concat(image.caption, "</figcaption>\n                </figure>");

    if (currentItemIndex % 2 != 0 || currentItemIndex == images.length - 1) {
      ret = ret + "</div>";
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