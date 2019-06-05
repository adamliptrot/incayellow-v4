import {query, queryAll, siblings, upTo} from './polyfills.js';

class Schematic {
    constructor(options){
        this.el = options.el;
        this.arrayComponents = [];
        this.nav = options.nav;

        //set opacity etc ready for fade in
        this.reset(this.animate);
        this.assignEvents();
        this.findPageTags();

    }
    findPageTags(){
        var _this = this;
        let pageTags = document.querySelector('body').getAttribute('data-tags')
        if(!pageTags) return;
        pageTags = pageTags.split(",")
        pageTags.forEach(function(tag){
            if(tag){
                tag = tag.split(" ").join("-")
                //console.log(tag)
                _this.activeTag(tag)
            }
        })
    }

    activeTag(tagName){
        let tagNav = query(`.archive-map [data-system="${tagName}"]`);
        if(tagNav){
            tagNav.classList.remove('inactive')
            tagNav.classList.add('active')
        }

        let tagSchematic = query(`#${tagName}`)
        if(tagSchematic){
            tagSchematic.classList.remove('inactive')
            tagSchematic.classList.add('active')
        }
    }

    animate(){
        //console.log('animate')
        //fade in each component
        setTimeout(
			this.fadeInComponent(this.arrayComponents.pop())
		, 1000);

        //draw bodywork lines
        setTimeout(function(){
                //console.log(this.arrayComponents[this.arrayComponents.length - 1].getElementsByTagName('path')[0]);
                //this.arrayComponents[this.arrayComponents.length - 1].getElementsByTagName('path')[0].addEventListener('onend', function (e) {
                //this.unbind('onend');
                //console.log('ended');
                [].slice.call(queryAll('#bodywork path')).forEach(function(path, j){
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

        },2000);
        //fill bodywork
		setTimeout(function(){
			[].slice.call(queryAll('#schematic g path')).forEach(function(path, j){
				path.removeAttribute("style");
				path.style.strokeWidth = "4px";
			});
			query('#schematic g path').style.WebkitTransition = "fill 0.75s ease-in-out";
			query('#schematic g path').style.fill = "#f7c606";
		}, 3000);
    }
    reset(callback){
        var _this = this;
        query(_this.el + ' g path').style.fill = "transparent";
        // hide the body
		[].slice.call(queryAll(_this.el + ' #bodywork-and-exterior path')).forEach(function(el,i){
			el.style.stroke = "none";
		});
        // line-draw each path
		[].slice.call(queryAll(_this.el + ' #blueprint > g')).forEach(function(el,i){
			el.style.opacity = 0;
			if(el.getAttribute('id') != 'bodywork-and-exterior'){
				[].slice.call(el.querySelectorAll('path')).forEach(function(path, j){
					path.style.stroke = "#333";
					path.style.strokeWidth = "4px";

					var length = path.getTotalLength();
					path.style.transition = path.style.WebkitTransition = 'none';
					path.style.strokeDasharray = length + ' ' + length;
					path.style.strokeDashoffset = length;
					path.getBoundingClientRect();

				});
			}
			_this.arrayComponents.push(el);

		});
        callback.call(_this);
    }
    fadeInComponent(comp){
        var _this = this;
        comp.style.opacity = 1;
        setTimeout(function(){
            if(_this.arrayComponents.length > 0){
                _this.fadeInComponent(_this.arrayComponents.pop());
                [].slice.call(comp.querySelectorAll('path[fill="none"]')).forEach(function(line, i){
                    _this.drawBlueprint(line);
                });
            }
        }, 300);
    }
    drawBlueprint(thisPath){
        thisPath.style.transition = thisPath.style.WebkitTransition = 'all 2s ease-in-out';
        thisPath.style.strokeDashoffset = '0';
    }
    highlightComponent(comp){
        var _this = this;
        //MAP
        //-----------
        if(queryAll('#'+ comp).length == 0){
            //console.log('reset all');
            //set all components to inactive - one of the non-component nav items has been actioned (general, all, driving etc)
            [].slice.call(queryAll(_this.el + ' #blueprint > g')).forEach(function(g, i){
                g.setAttribute('class', 'inactive');
            });
        }else{

            //add hover state to targeted component
            var exantClass = query('#'+comp).getAttribute('class');
            query('#'+ comp).setAttribute('class', exantClass + ' hover');

            // var mouseOver = new MouseEvent('mousemove', {
            //     'view': window,
            //     'bubbles': false,
            //     'cancelable': true
            //     });

                //set other components to inactive (this effectively just removes the hover/fade classes)
                [].slice.call(siblings(query('#' + comp), queryAll(_this.el + ' #blueprint  > g'))).forEach(function(n, i){
                    n.classList.remove('hover');
                    n.classList.remove('fade');
                });

            var sib = [].slice.call(siblings(query('#' + comp), queryAll(_this.el + ' #blueprint > g.active')))
            if(sib.length > 0){
                sib[0].setAttribute('class','active fade');
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
		if(queryAll(_this.el + ' #blueprint > g.active').length == 0){
			[].slice.call(queryAll(_this.el + ' #blueprint > g.active')).forEach(function(c, i){
				c.classList.remove('hover');
                c.classList.remove('fade');
			});
		} else {
			query(_this.el + ' #blueprint > g.active').setAttribute('class','active');
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
			el.addEventListener('mouseout',function(ev){
				_this.resetComponents();
			});
		}, this);

		[].slice.call(queryAll('svg #blueprint > g')).forEach(function(el,i){
			el.addEventListener('mousemove',function(ev){
				_this.highlightComponent(el.getAttribute('id'));
			});
		}, this);

		query('svg').addEventListener('mouseout',function(ev){
			_this.resetComponents();
		});



		[].slice.call(queryAll(_this.el + ' #blueprint > g')).forEach(function(c, i){
			c.addEventListener('click', function(e){
				e.preventDefault();
				window.location.href='/archives/' + c.getAttribute('id');
			});
		});


    }
}

export { Schematic as default };