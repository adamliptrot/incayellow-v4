import {query, queryAll, siblings, upTo} from './polyfills.js';

class Schematic {
    constructor(options){
        this.el = options.el.getSVGDocument().querySelector('svg');
        this.arrayComponents = [];
        this.nav = options.nav;

        //set opacity etc ready for fade in
       this.reset(this.animate);
       this.assignEvents();
        this.findPageTags();
        this.findArchiveTags();

        // set initial dark mode
        if(document.querySelector('body').classList.contains('theme--dark')){
            this.el.classList.add("theme--dark")
        }

    }
    findPageTags(){
        var _this = this;
        let pageTags = document.querySelectorAll('.tags__tag');
        if(!pageTags) return;
        pageTags.forEach(function(tag){
            if(tag){
                tag = tag.innerText.split(" ").join("-")
                _this.activeTag(tag)
            }
        })
    }

    findArchiveTags(){
        var _this = this;
        let archiveTag = document.querySelector('body').getAttribute("data-tags");
        if(!archiveTag) return;
        if(archiveTag){
            archiveTag = archiveTag.split(" ").join("-")
            _this.activeTag(archiveTag)
        }
    }

    activeTag(tagName){
        let tagNav = query(`.archive-map [data-system="${tagName}"]`);
        if(tagNav){
            tagNav.classList.remove('inactive')
            tagNav.classList.add('active')
        }

        let tagSchematic = this.el.querySelector(`#${tagName}`)
        if(tagSchematic){
            tagSchematic.classList.remove('inactive')
            tagSchematic.classList.add('active')
        }
    }

    animate(){
        var _this = this;
        //console.log('animate')
        //fade in each component
        setTimeout(
            _this.fadeInComponent(_this.arrayComponents.pop())
		, 1000);

        //draw bodywork lines
        setTimeout(function(){
                //console.log(this.arrayComponents[this.arrayComponents.length - 1].getElementsByTagName('path')[0]);
                //this.arrayComponents[this.arrayComponents.length - 1].getElementsByTagName('path')[0].addEventListener('onend', function (e) {
                //this.unbind('onend');
                //console.log('ended');
                [].slice.call(_this.el.querySelectorAll('#bodywork path')).forEach(function(path, j){
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

                setTimeout(function(){
                    //fill bodywork
                    [].slice.call(_this.el.querySelectorAll('g path')).forEach(function(path, j){
                        path.removeAttribute("style");
                        path.style.strokeWidth = "4px";
                    });
                    _this.el.querySelector('g path').style.WebkitTransition = "fill 0.75s ease-in-out";
                    _this.el.querySelector('g path').style.fill = "#f7c606";

                }, 2000)

        },2000);

    }
    reset(callback){
        var _this = this;
        // reset nav
        [].slice.call(queryAll(_this.nav + ' a')).forEach(function(n, i){
            n.classList.remove('active');
            n.classList.add('inactive');
        });

        // reset active components
        var activeComp = _this.el.querySelectorAll('#blueprint > g.active');
        if(activeComp.length > 0){
            activeComp.forEach(function(c){
                c.setAttribute('class','inactive');
            });
        }
        // line-draw each path
		[].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function(el,i){
            // el.classList.add('layer-notrans');
            // el.classList.add('layer-hide');
			if(el.getAttribute('id') != 'bodywork-and-exterior'){
				[].slice.call(el.querySelectorAll('path')).forEach(function(path, j){
					path.style.stroke = "#333";
                    path.style.strokeWidth = "6px";

                    if(!el.classList.contains('active')){
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
    fadeInComponent(comp){
        var _this = this;
        comp.classList.remove('layer-notrans');
        comp.classList.remove('layer-hide');
        comp.classList.add('layer-show');
        //comp.style.opacity = 1;
        setTimeout(function(){
            if(_this.arrayComponents.length > 0){
                _this.fadeInComponent(_this.arrayComponents.pop());
                [].slice.call(comp.querySelectorAll('path')).forEach(function(line, i){
                    _this.drawBlueprint(line);
                });
            }
        }, 300);
    }
    drawBlueprint(thisPath){
        thisPath.style.transition = thisPath.style.WebkitTransition = 'all 1s ease-in-out';
        thisPath.style.strokeDashoffset = '0';
    }
    highlightComponent(comp){
        var _this = this;
        //MAP
        //-----------
        if(_this.el.querySelectorAll('#'+ comp).length == 0){
            //console.log('reset all');
            //set all components to inactive - one of the non-component nav items has been actioned (general, all, driving etc)
            [].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function(g, i){
                g.classList.add('fade');
            });
        }else{
            //remove fade
            [].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function(g, i){
                g.classList.remove('fade');
            });
            //add hover state to targeted component
            _this.el.querySelector('#'+comp).classList.add('hover');

            // var mouseOver = new MouseEvent('mousemove', {
            //     'view': window,
            //     'bubbles': false,
            //     'cancelable': true
            //     });

            //set other components to inactive (this effectively just removes the hover/fade classes)
            [].slice.call(siblings(_this.el.querySelector('#' + comp), _this.el.querySelectorAll('#blueprint  > g'))).forEach(function(n, i){
                n.classList.remove('hover');
                n.classList.remove('fade');
            });

            //if there are active components, fade them out a little
            var sib = [].slice.call(siblings(_this.el.querySelector('#' + comp), _this.el.querySelectorAll('#blueprint > g.active')))
            if(sib.length > 0){
                sib[0].classList.add('fade');
            }
        }


    	//NAV
    	//-----------
    	//reset all nav items
        [].slice.call(queryAll(_this.nav + ' a')).forEach(function(n, i){
            n.classList.remove('hover');
            n.classList.remove('fade');
        });

    	//add hover state to target navigation item
		var hoverMenu = query(_this.nav + ' [data-system="'+comp+'"]');
		if(hoverMenu){
			hoverMenu.classList.add('hover');
		}

		//fade out the active item a little if it isn't the one being targeted
		if(!query(_this.nav + ' [data-system="'+comp+'"].active') && query(_this.nav + ' a.active')){
			query(_this.nav + ' a.active').classList.add('fade');
		}


    }
    resetComponents(){
        var _this = this;

        // find active navigation items and highlight them
		var activeNav = [].slice.call(queryAll(_this.nav + ' .active'));
        activeNav.forEach(function(nav){
            let activeLayer = nav.getAttribute('data-system');
            _this.highlightComponent(activeLayer);
            // highlight in the schematic if a layer is present (ie not for general tags like 'driving')
            if(query('#'+ activeLayer)){
                var exantClass = query('#'+activeLayer).getAttribute('class');
                query('#'+ activeLayer).setAttribute('class', exantClass + ' active');
            }
        });

        // remove any hover effects
		[].slice.call(queryAll(_this.nav + ' a')).forEach(function(n, i){
			n.classList.remove('hover');
			n.classList.remove('fade');
        });

		//handle schematic
		if(_this.el.querySelectorAll('#blueprint > g.active').length == 0){
			[].slice.call(_this.el.querySelectorAll('#blueprint > g.active')).forEach(function(c, i){
				c.classList.remove('hover');
                c.classList.remove('fade');
			});
		} else {
			_this.el.querySelector('#blueprint > g.active').setAttribute('class','inactive');
		}
    }
    assignEvents(){
		//archive menu

		// var mouseOut = new MouseEvent('mouseout', {
        //     'view': window,
        //     'bubbles': false,
        //     'cancelable': true
        // });
		var _this = this;
		[].slice.call(queryAll(this.nav + ' a')).forEach(function(el,i){
			el.addEventListener('mousemove',function(ev){
				_this.highlightComponent(el.getAttribute('data-system'));
			});
            el.addEventListener('focus',function(ev){
				_this.highlightComponent(el.getAttribute('data-system'));
			});
			el.addEventListener('mouseout',function(ev){
				_this.resetComponents();
			});
            el.addEventListener('blur',function(ev){
				_this.resetComponents();
			});
		}, this);

		[].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function(el,i){
			el.addEventListener('mousemove',function(ev){
				_this.highlightComponent(el.getAttribute('id'));
			});
            el.addEventListener('focus',function(ev){
				_this.highlightComponent(el.getAttribute('id'));
			});
		}, this);

		_this.el.addEventListener('mouseout',function(ev){
			_this.resetComponents();
		});
        _this.el.addEventListener('blur',function(ev){
			_this.resetComponents();
		});



		[].slice.call(_this.el.querySelectorAll('#blueprint > g')).forEach(function(c, i){
			c.addEventListener('click', function(e){
				e.preventDefault();
				window.location.href='/archives/' + c.getAttribute('id');
			});
		});


    }
}

var schematicEl = document.querySelector('#schematic__host');
const initialiseSchematic = function(){
    if(schematicEl){
        document.querySelector(".schematic__blueprint").setAttribute("style", "zoom:1;");
        document.querySelector(".wrap").setAttribute("style", "zoom:1;");

        function runSchematic(entries, observer){
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    var schematic = new Schematic({el: schematicEl, nav: '.archive-map'});
                    observer.unobserve(entry.target)
                }
            })
        }

        var observer = new IntersectionObserver(runSchematic, {
            rootMargin: '0px',
            threshold: 0
        })
        observer.observe(schematicEl);
    }
}
const reInitialiseSchematic = function(){
    if(schematicEl){
        var schematic = new Schematic({el: schematicEl, nav: '.archive-map'});
    }
}

class SchematicSide {
    constructor(options){
        this.el = options.el;
        //console.log(this.el);
        this.supportsAnchor = CSS.supports('anchor-name: --myAnchor');
        this.anchorMediaQuery = window.matchMedia('(min-width: 1000px)')
        this.assignEvents();
        
    }
    
    assignEvents(){
        var _this = this;
        var sch = this.el;
        


        // schematic numbering
        //====================
        [].slice.call(sch.querySelectorAll('.schematic-side__blueprint .schematic__number')).forEach(function(point, i){    
            
            // open popup for this point
            //==================================
            point.addEventListener('click', function(){_this.relay(point)});

            // close any open popups when focus moves to a new point
            //==================================
            point.addEventListener('focus', function(){_this.unrelay()});

        });

        document.querySelector('body').addEventListener('keyup', function(event){
            if (event.key == "Escape") {
                _this.unrelay();
            }
        });
        

        // schematic photo numbers
        //========================
        [].slice.call(sch.querySelectorAll('.schematic-side__map .schematic__number')).forEach(function(point, i){   
        //     // expand click listener to the image
        //     var fig = upTo(point, 'figure');
        //     if(fig){
        //         fig.addEventListener('click', function(){_this.relay(point)});
        //     }            
            point.addEventListener('click', function(){_this.relay(point)});
            
        });
    }
    
    unrelay(){
        var _this = this.el;
        //console.log('unrelay ' + _this);
        [].slice.call(_this.querySelectorAll('.schematic-focus')).forEach(function(n){
            n.classList.remove('schematic-focus');
            //console.log('rem from ' + n)
        });
    }
    
    relay(point){
        var _this = this;
        _this.unrelay();
        // allow time for unrelay to work
        setTimeout(function(){
            var dataImgID = point.getAttribute("data-img");
            var img = document.querySelectorAll('#' + dataImgID);
            if(_this.supportsAnchor && _this.anchorMediaQuery.matches){
                // show image popup
                if(img){
                    img[0].classList.add("schematic-focus");
                }                
            } else {
                // jump focus to image grid
                img[2].focus();
            }
        },50);
    }
}

const initialiseSchematicSide = function(){
    [].slice.call(queryAll('.schematic-side')).forEach(function(s){
        new SchematicSide({el: s});
    });
}

export { initialiseSchematic, reInitialiseSchematic, initialiseSchematicSide };