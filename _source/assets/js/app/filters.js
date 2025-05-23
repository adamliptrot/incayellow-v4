const slugify = require('../lib/slugify');

exports.parseDate = function(stringDate){
    var theDate = new Date(stringDate);
    var theDateFormatted = theDate.getDate() + " " + allMonthNames('short')[theDate.getMonth()] + " " + theDate.getFullYear();
    return theDateFormatted;
}

exports.allMonthNames = function(format){
    return allMonthNames(format);
}

exports.tagTemplate = function(tags){
    var ret = '';
    if(tags.length > 0){
        tags.forEach(function(tag, i){
            ret = ret + `<li><a href="/archives/${ slugify(tag) }" data-tag="${ tag }"><span class="tags__tag">${ tag }</span></a></li>`
        });
    }
    return ret;
}

exports.heroTemplate = function(images, thresholdExceeded){
    var ret = "";
    if ((images[0].media) && (images[0].media == "video")){
        //ret = `<video src="https://live.staticflickr.com/video/${ images[0].id }/${images[0].secret }/appletv.mp4" width="100%" poster="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_d.jpg" controls=""></video>`
        //ret = `<video src="/assets/videos/${images[0].url}" width="100%" poster="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_d.jpg" controls=""></video>`
        ret = `
        <div style="padding:75% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${ images[0].url }?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe><script src="https://player.vimeo.com/api/player.js"></script></div>
            `
    } else {
        if (images.length == 1 && images[0].caption && images[0].caption > ""){
            ret = ret + `<figure><div class="hero__imagewrap--inner">`;
        } else {
            ret = ret + `<div class="hero__imagewrap--inner">`;
        }
        ret = ret + `
            <img aria-hidden="true" class="placeholder" src="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_m.jpg" alt="" />
            <img class="hero__image" data-source="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }"
                srcset="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_m.jpg 500w,
                https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_z.jpg 640w,
                https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_c.jpg 800w,
                https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_b.jpg 1024w"
                ${ thresholdExceeded? 'sizes="(max-width: 2000px) 100%"' : 'sizes="(max-width: 999px) 100%, (max-width: 1999px) 33vw"' }
                data-orient="landscape" src="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_b.jpg" alt="${ images.length == 1 && images[0].alt? images[0].alt : '' }" />`
        if (images.length == 1 && images[0].caption && images[0].caption > ""){
            ret = ret + `</div><figcaption>${ images[0].caption } <a href="https://flickr.com/photos/adamliptrot/${ images[0].id }">View photo</a></figcaption></figure>`;
        } else {
            ret = ret + `</div>`;
        }
    }
    return ret;
}

exports.mediaDisplay = function(image, passthrough){
    return mediaDisplay(image, passthrough);

}

exports.placeholders = function(content, imgs){
    var newContent = content;
    imgs.forEach(function(image){
        // let re = new RegExp('\/\/PH+' + image.marker + '}\b', "g");
        newContent = newContent.replace(`//PH${image.marker}`, mediaDisplay(image))
    });
    return newContent;
}

exports.imageList = function(images, thresholdExceeded){
    var ret = "";
    var imgCount = 0;
    images.forEach(function(image, currentItemIndex){
        if(!image.marker){
            if (imgCount % 2 == 0){
                ret = ret + `<div class="photoinsert">`
            }

            ret = ret + mediaDisplay(image);

            if ((imgCount % 2 != 0) || (imgCount == images.length - 1)){
                ret = ret + `</div>`
            }
            imgCount ++;
        }

    });
    return ret;
}

var allMonthNames = function(format){
    var monthNames;
    if(format == 'long'){
        monthNames = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"];
    }else{
        monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sept", "Oct","Nov", "Dec"];
    }
    return monthNames;
}

var mediaDisplay = function(image, passthrough = ""){
    var videoImage = "";
    var ret = "";
    if(image.media == "video"){
        videoImage = `data-video="${ image.secret },${ image.id }"`;
        ret = `<figure style="padding:75% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${ image.url }?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe><script src="https://player.vimeo.com/api/player.js"></script><figcaption>${ image.caption }</figure>`

    } else {

    ret = `<figure>                
                <img loading="lazy" data-source="https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }"
                            srcset="https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_m.jpg 500w,
                            https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_z.jpg 640w,
                            https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_c.jpg 800w,
                            https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_b.jpg 1024w"
                            'sizes="(max-width: 799px) 100%, (min-width: 800px) 440px"' 
                            ${ videoImage }
                            data-orient="${ image.orient || "landscape" }" src="https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_b.jpg" alt="${ image.alt? image.alt : '' }" />                
                <figcaption>${passthrough} ${ image.caption } <a href="https://flickr.com/photos/adamliptrot/${ image.id }">View photo</a></figcaption>
            </figure>`
    }
    return ret;
}