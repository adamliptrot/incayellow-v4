import {query, queryAll, siblings, upTo} from './polyfills.js';
import {parseDate, heroTemplate, imageList, tagTemplate} from './filters.js';
import lazyLoadThumbnails from "./lazyLoadThumbnails"
import {reInitialiseSchematic} from "./schematic"

export default function loadPages() {

    const contentThreshold = 1000;

    window.addEventListener('popstate', function(event) {
        loadContent(window.location.pathname);
    });


    hookLinks();

    function loadContent(pathname) {
        const article = query('.post');
        const container = query('.post .content');
        fetch(pathname + 'index.json')
            .then(res => res.json())
            // .then(res => new Promise(resolve => setTimeout(() => resolve(res), 5000)))
            .then(data => {
                // body class
                query('body').classList.remove('shortcopy');
                if(data.content.length < contentThreshold){
                    query('body').classList.add('shortcopy');
                }
                // page title
                document.title = data.title;
                // main content
                container.innerHTML = data.content;
                // header
                query('h1').innerHTML = data.title;
                // date
                query('.head time').innerHTML = parseDate(data.date);
                // prev / next links
                if(data.prevPost.title != undefined){
                    if(query('[rel="Previous"]')){
                        query('[rel="Previous"]').setAttribute('href',data.prevPost.url);
                        query('[rel="Previous"] .further-reading__title').innerHTML = data.prevPost.title;
                    } else {
                        // add previous link
                        query('.further-reading--post ul').insertAdjacentHTML('afterbegin', '<li class="further-reading__prev"><a title="read previous post" href="' + data.prevPost.url + '" rel="Previous"><span aria-hidden="true">&larr;&nbsp;</span><span class="further-reading__title">' + data.prevPost.title + '</span></a></li>')
                    }
                } else {
                    query('.further-reading__prev').remove();
                }
                if(data.nextPost.title != undefined){
                    if(query('[rel="Next"]')){
                        query('[rel="Next"]').setAttribute('href',data.nextPost.url);
                        query('[rel="Next"] .further-reading__title').innerHTML = data.nextPost.title;
                    } else {
                        // add next link
                        query('.further-reading--post ul').insertAdjacentHTML('beforeend', '<li class="further-reading__next"><a title="read next post" href="' + data.nextPost.url + '" rel="Next"><span class="further-reading__title">' + data.nextPost.title + '</span><span aria-hidden="true">&nbsp;&rarr;</span></a></li>')
                    }
                } else {
                    query('.further-reading__next').remove();
                }
                // main image
                query('.hero__imagewrap').innerHTML = heroTemplate(data.images);
                // other images
                query('.photos').innerHTML = imageList(data.images, (data.content.length > contentThreshold))
                lazyLoadThumbnails('hero__image');
                // tags
                query('.tags ul').innerHTML = tagTemplate(data.tags)
                // reset scroll position
                window.scrollTo(0, 0);
                // need to manage focus
                document.querySelectorAll('h1')[0].setAttribute('tabindex',"-1");
                setTimeout(function(){
                    document.querySelectorAll('h1')[0].focus();
                }, 500)
                // reattach event listeners
                hookLinks();
                // schematic
                reInitialiseSchematic();
            });
    }
    function hookLinks() {
        queryAll('.content a, .further-reading--post a').forEach(link => {
            if (link.origin !== window.location.origin) {
                return;
            }

            if (link.dataset.hooked) {
                return;
            }

            link.dataset.hooked = true;

            link.addEventListener('click',event => {
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        return; // let the browser deal with the click natively
                    }

                    event.preventDefault();

                    let { pathname } = link;

                    if (!pathname.endsWith('/')) {
                        pathname += '/';
                    }

                    // don't follow links that are loaded
                    if (pathname === window.location.pathname) {
                        return;
                    }

                    window.history.pushState(null, null, pathname);


                    loadContent(pathname);
                },
                false
            );
        });
    }


}
