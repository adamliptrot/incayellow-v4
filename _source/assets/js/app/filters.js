const slugify = require('../lib/slugify');
const path = require("node:path");
const fs = require("node:fs");
// var glob = require( 'glob' ), path = require( 'path' );

// glob.sync( './_source/_data/sizes/*.json' ).forEach( function( file ) {
//     console.log("FILE: " + file);
//     require( path.resolve( file ) );
// });


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

exports.heroTemplate = function(images, thresholdExceeded, sizes){
    var ret = "";
    var mediaType = images[0].media || "photo";
    // ret = ret + mediaType;
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
        const j = "photo" + images[0].id;
        // ret = "HERO";
        // ret + JSON.stringify(sizes.photo54967195914);
        // if(sizes[j]){
        //             // if(sizes[j].sizes.size.length > 0){
        //             //  if(data_file_exists("sizes",j)){
        //     // JSON SIZES
            
        //     var size320, size640, size800, size1024, size1600;
        //     sizes[j].sizes.size.forEach(function(s){
        //         // console.log(JSON.stringify(sizes[j].sizes.size));
        //         switch(s.label){
        //         case "Small 320":
        //             size320 = s.source;
        //             break;
        //         case "Small 400":
        //             size640 = s.source;
        //             break;
        //         case "Medium 800":
        //             size800 = s.source;
        //             break;
        //         case "Large":
        //             size1024 = s.source;
        //             break;
        //         case "Large 1600":
        //             size1600 = s.source;
        //             break;
        //         case "Large 2048":
        //             size2048 = s.source;
        //             break;
        //         default:
        //         }
        //     })
        // } else {
            size640 = `https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_m.jpg`;
            size800 = `https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_z.jpg`;
            size1024 = `https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_c.jpg`;
            size2048 = `https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }_b.jpg`;
        // }
        ret = ret + `
            <img aria-hidden="true" class="placeholder" src="${size640}" alt="" />
            <img class="hero__image" data-source="https://farm9.static.flickr.com/${ images[0].server }/${ images[0].id }_${ images[0].secret }"
                srcset="${size640} 500w,${size640} 640w, ${size800} 800w, ${size1024} 1024w, ${size2048} 2048w"                
                ${ thresholdExceeded? 'sizes="(max-width: 2000px) 100vw"' : 'sizes="(max-width: 999px) 100vw, (max-width: 1999px) 33vw"' }
                data-orient="landscape" src="${size2048}" alt="${ images.length == 1 && images[0].alt? images[0].alt : '' }" />`
        if (images.length == 1 && images[0].caption && images[0].caption > ""){
            ret = ret + `</div><figcaption>${ images[0].caption } <a href="https://flickr.com/photos/adamliptrot/${ images[0].id }">View photo</a></figcaption></figure>`;
        } else {
            ret = ret + `</div>`;
        }
    }
    return ret;
}

exports.mediaDisplay = function(image, passthrough, sizes){
    return mediaDisplay(image, passthrough, sizes);

}

exports.placeholders = function(content, imgs, sizes){
    var newContent = content;
    imgs.forEach(function(image){
        // let re = new RegExp('\/\/PH+' + image.marker + '}\b', "g");
        newContent = newContent.replace(`//PH${image.marker}`, mediaDisplay(image, "", sizes))
    });
    return newContent;
}

exports.imageList = function(images, thresholdExceeded, sizes){
    var ret = "";
    var imgCount = 0;
    images.forEach(function(image, currentItemIndex){
        if(!image.marker){
            if (imgCount % 2 == 0){
                ret = ret + `<div class="photoinsert">`
            }

            ret = ret + mediaDisplay(image, "", sizes);

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

function data_file_exists(folder, file) {
    const dataFile = path.join("_source/_data/", folder, `${file}.json`);
    if (!fs.existsSync(dataFile)) {
        return false;      
    } else {
        return true;
    }
}

var mediaDisplay = function(image, passthrough = "", sizes){
    var j = "photo" + image.id;
    var ret = "";  
    //ret = JSON.stringify(sizes.photo54967195914);
    //return "MEDIA<br>" + ret;
    var videoImage = "";
    var ret = "";    
    //if ((image.media) && (image.media == "video")){
    // var media = image.media ? image.media : "photo";
    var media = image.media || "photo";
    if(media == "video"){
        //videoImage = `data-video="${ image.secret },${ image.id }"`;
        ret = `<figure style="padding:75% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${ image.url }?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe><script src="https://player.vimeo.com/api/player.js"></script><figcaption>${ image.caption }</figure>`;
    } else {
        const j = "photo" + image.id;
        //ret = "MEDIA2";//JSON.stringify(sizes.photo54967195914);
        //ret = ret + "<br>-----<br>" + JSON.stringify(sizes[j]);
        // if(sizes[j]){
        //     var size320 = "", size640 = "", size800 = "", size1024 = "", size1600 = "";
        //     sizes[j].sizes.size.forEach(function(s){
        //         switch(s.label){
        //         case "Small 320":
        //             size320 = s.source;
        //             break;
        //         case "Small 400":
        //             size640 = s.source;
        //             break;
        //         case "Medium 800":
        //             size800 = s.source;
        //             break;
        //         case "Large":
        //             size1024 = s.source;
        //             break;
        //         case "Large 1600":
        //             size1600 = s.source;
        //             break;
        //         default:
        //         }
        //     })
                                    
        //     ret = `<figure>              
        //                 <img loading="lazy" srcset="${size640} 500w,${size640} 640w, ${size800} 800w, ${size1024} 1024w"
        //                             'sizes="(max-width: 799px) 100%, (min-width: 800px) 440px"' 
        //                             ${ videoImage }
        //                             data-orient="${ image.orient || "landscape" }" src="${size1024}" alt="${ image.alt? image.alt : '' }" />                
        //                 <figcaption>${passthrough} ${ image.caption } 
        //                     <button data-target="photo-${ image.id }" class="photoZoom">View</button>
        //                     <dialog id="photo-${ image.id }"><img src="${size1600}" alt="${ image.alt? image.alt : '' }" /></dialog>
        //                     <a href="https://flickr.com/photos/adamliptrot/${ image.id }">View photo</a>
        //                 </figcaption>
        //             </figure>`;                
        // }// else {
        //     // NOT JSON
            ret = `<figure>              
                        <img loading="lazy" srcset="https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_m.jpg 500w,
                                    https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_z.jpg 640w,
                                    https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_c.jpg 800w,
                                    https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_b.jpg 1024w"
                                    'sizes="(max-width: 799px) 100%, (min-width: 800px) 440px"' 
                                    ${ videoImage }
                                    data-orient="${ image.orient || "landscape" }" src="https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_b.jpg" alt="${ image.alt? image.alt : '' }" />                
                        <figcaption>${passthrough} ${ image.caption } 
                            <button data-target="photo-${ image.id }" class="photoZoom">Zoom</button>
                            <dialog id="photo-${ image.id }"><button>Close</button><img src="https://farm9.static.flickr.com/${ image.server }/${ image.id }_${ image.secret }_b.jpg" alt="${ image.alt? image.alt : '' }" /></dialog>
                            <div><a href="https://flickr.com/photos/adamliptrot/${ image.id }">View on Flickr</a></div></figcaption>
                    </figure>`;
        // }



       


    }
    return ret;
}