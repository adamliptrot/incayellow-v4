export default function lazyLoadThumbnails(selector){
    //console.log('load thumbs')
    let thumbs = [].slice.call(document.querySelectorAll("." + selector))
    processArray(thumbs, loadImage);

    function processArray(items) {
        var todo = items.concat();
        //console.log(todo)
        setTimeout(function() {
            loadImage(todo.shift());
            if(todo.length > 0) {
                setTimeout(processArray(todo), 25);
            }
        }, 25);
    }

    function loadImage(img){
        //console.log(img.src);
        if (img) {
            if (img.complete) {
                //console.log('immediately loaded ' + img.src);
                loaded(img);
            } else {
                //setTimeout(function(){
                    //console.log('adding listener')
                    img.addEventListener('load', () => {
                        //console.log('lazy loaded ' + img.src);
                        loaded(img);
                    });
                    img.addEventListener('error', (loaderror) => console.log(loaderror)); // eslint-disable-line no-console, max-len
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
