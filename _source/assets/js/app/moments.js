// import $ from '../lib/jquery';
import scrollPageTo from './scroll.js';

class Moments {
  constructor() {
    this.momentsList = $('.moments__list');

    this.moments = [];

    // expando
    this.containerEl = $('.moments');
    this.activeMoment = null;
    this.lastRow = null; // last moment in the currently active row
    this.prevLastRow = null;
    // this.spacerTop = 0; // location of the spacer, for positioning the active moment
    this.preserveSpacer = null;
    this.momentMargin = 0;
    this.clearTimeout;

    this.scrollAdjust = 0;//$('.banner__inner').outerHeight();

    this.supportsGrid = false; // set to feature testing (supports: grid) once 'display: contents' bugs have all been fixed by browsers
                                // see: https://hiddedevries.nl/en/blog/2018-04-21-more-accessible-markup-with-display-contents
    this.init();
  }

  init() {
    this.addEvents();
  }



  formatDate(unixTime) {
    return new Date(unixTime * 1000);
  }

  updateVideoUI(videoPlayer, videoTime) {
    // console.log('update video');
    if (!videoPlayer.paused) {
      videoTime.find('.videotime__elapsed').html(Math.round(videoPlayer.currentTime));
      videoTime.find('.videotime__bar--elapsed')
              .css({ width: `${((100 / videoPlayer.duration) * videoPlayer.currentTime)}%` });
    }
  }

  stopVideoUIUpdate(moment) {
    // console.log('stop ui');
    clearInterval(this.videoUpdater);
    const videoTime = moment.find('.videotime').attr('data-time');
    moment.find('.moment__play').removeClass('moment__play--playing');
    if (videoTime) {
      videoTime.find('.videotime__elapsed').html(0);
      videoTime.find('.videotime__bar--elapsed').css({ width: 0 });
    }
  }

  addEvents() {
    const self = this;

    // close moment
    $('body').on('click', '.moment__close', (e) => {
      e.preventDefault();
      self.closeMoment();
    });

    // next / prev movement
    $('body').on('click', '.further-reading--archive [rel="Previous"]', function(e){
      e.preventDefault();
      self.activeMoment.prevAll('.monthArchive__post').first().find('.moment__preview').trigger('click');
    })
    $('body').on('click', '.further-reading--archive [rel="Next"]', function(e){
      e.preventDefault();
      self.activeMoment.nextAll('.monthArchive__post').first().find('.moment__preview').trigger('click');
    })

    // play audio media
    $('body').on('click', '.moment--music ~ .moment__detail .js-moment__play', function (e) { // eslint-disable-line max-len
      e.preventDefault();
      const playIcon = $(this);
      const audioPlayer = $(this).next('audio')[0];
      if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.addClass('moment__play--playing');
      } else {
        audioPlayer.pause();
        playIcon.removeClass('moment__play--playing');
      }
      audioPlayer.addEventListener('ended', () => playIcon.removeClass('moment__play--playing'));
    });

    // play video media
    $('body').on('click', '.moment--video ~ .moment__detail .js-moment__play', function (e) {
      e.preventDefault();
      const playIcon = $(this);
      self.videoUpdater = null;
      const videoPlayer = $(this).next('video')[0];
      const videoTime = $(`#${$(videoPlayer).attr('data-time')}`);

      if (videoPlayer.paused) {
        if (videoTime) {
          videoTime.find('.videotime__length').html(Math.round(videoPlayer.duration));
          self.videoUpdater = window.setInterval(() => self.updateVideoUI(videoPlayer, videoTime), 100);
        }
        videoPlayer.play();
        playIcon.removeClass('moment__play--paused');
        playIcon.addClass('moment__play--playing');
      } else {
        videoPlayer.pause();
        if (videoTime) {
          clearInterval(self.videoUpdater);
        }
        playIcon.addClass('moment__play--paused');
        playIcon.removeClass('moment__play--playing');
      }
      videoPlayer.addEventListener('ended', () => {
        self.stopVideo();
      });
    });

    function loadMoment(mom){
      // console.log('loadMoment')
      const thismoment = mom.parents('li').first();
      if (thismoment.hasClass('moment--active')) {
        self.closeMoment();
      } else {
        //console.log('load moment',thismoment);
        self.openMoment(thismoment, true);
      }
    }

    // $('body').on('click', '.moment', function (e) {
    //   e.preventDefault();
    //   console.log($(e.target));
    //   loadMoment($(this))
    // });
    $('body').on('click', '.moment__preview', function (e) {
      e.preventDefault();
      //console.log($(e.target));
      loadMoment($(this))
    });

    self.resize();
  }


  stopVideo() {
    const self = this;
    const video = self.activeMoment.find('video')[0];
    if (video) {
      video.pause();
      video.currentTime = 0;
      self.activeMoment.find('.moment__play--playing').removeClass('moment__play--playing');
      self.activeMoment.find('.videotime__elapsed').html(0);
      self.activeMoment.find('.videotime__bar--elapsed').css({ width: 0 });
      self.stopVideoUIUpdate(self.activeMoment);
    }
  }

  stopAudio() {
    const self = this;
    const audio = self.activeMoment.find('audio')[0];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      self.activeMoment.find('.moment__play--playing').removeClass('moment__play--playing');
    }
  }

  cleanUp() {
    // de-activate the currently active moment
    const self = this;
    //self.lastRow = null;
    if (self.activeMoment) {
      self.activeMoment.find('.moment--active').removeClass('moment--active');
      self.activeMoment.find('.moment__detail')
          .removeClass('moment__detail--show')
          .removeClass('moment__detail--active')
          .removeAttr('style');
      self.stopVideo();
      self.stopAudio();

      self.activeMoment = null;
    }
  }

  findLastItemInRow(el) {
    const self = this;
    if (el == null) return;
    // store old item
    self.prevLastRow = self.lastRow;

    const activeMomentTop = el.position().top;
    let keepchecking = true;
    // loop over moments after current one to find start of next row
    if (el.nextAll(".monthArchive__post").length > 0) {
      el.nextAll(".monthArchive__post").each(function () {
        if (keepchecking) {
          // compare offset positions
          //console.log($(this).attr('id'), $(this).position().top, activeMomentTop)
          if ($(this).position().top > activeMomentTop) {
            // console.log($(this))
            // new row found
            keepchecking = false;
            // assign last item as previous non-spacer
            self.lastRow = $(this).prevAll(".monthArchive__post").first();
            // console.log('Last item in row is', self.lastRow)
          }
        }
      });
      if (keepchecking) {
        // this is the last row in the set
        self.lastRow = el.nextAll(".monthArchive__post").last();
      }
    } else {
      // we are already at the last moment in the set
      self.lastRow = el;
    }

    //console.log('last item is ' + self.lastRow.find('figcaption').text())
  }

  removeSpacer() {
    // animate out the spacer
    // console.log('spacer leaves')
    const self = this;
    self.containerEl.find('.spacer').removeAttr('style').addClass('spacer--leaving');
    setTimeout(function() {
      self.containerEl.find('.spacer--leaving').remove();
    }, 250);
  }

  createSpacer(optclasses) {
    // spacer gets added after the last item in the active row to maintain the grid
    if (this.activeMoment == null) return;
    let optionClass = optclasses;
    if (!optclasses) { optionClass = ''; }
    this.lastRow.after(`<li class="spacer ${optionClass}"></li>`);
  }


  repositionSpacer() {
    const self = this;
    // verify last item in row and move spacer if needed

    if (self.activeMoment != null) {

      // hide spacer
      let spacer = self.containerEl.find('.spacer');
      //spacer.addClass('hidden spacer--notrans');
      // find last row item

      self.findLastItemInRow(self.activeMoment);
      //spacer.removeClass('hidden');
      //setTimeout(() => {


        if(self.prevLastRow[0] === self.lastRow[0]){
          // console.log('no change')
        } else {
          // reposition spacer, reshow
          spacer.insertAfter(self.lastRow)
        }

        self.setSpacerHeight();
        self.setMomentPos();
        spacer.removeClass('spacer--notrans');
      //}, 5);

    }

  }

  setSpacerHeight() {
    const self = this;
    if (self.activeMoment != null) {
      const momentDetail = self.activeMoment.find('.moment__detail');
      momentDetail.addClass('moment__detail--checksize');
      setTimeout(function(){
        const momentHeight = momentDetail.outerHeight() + self.momentMargin;
        momentDetail.removeClass('moment__detail--checksize');
        self.newSpacer.css({ height: `${momentHeight}px` });
      }, 25)
    }
  }

  setMomentPos() {
    const self = this;
    if (self.activeMoment != null) {
      const momentPosTop = self.newSpacer[0].offsetTop;
      self.momentDetail.css({ top: `${momentPosTop}px` });
    }
  }

  closeMoment() {
    this.cleanUp();
    this.removeSpacer();
    this.activeMoment = null;
  }

  openEnd(moment, scrollUI) {
    // once moment has been opened ...
    const self = this;
    // load the main image
    const momPhoto = moment.find('.moment__photo');
    const momImg = momPhoto.find('img').first();



    if (momImg.attr('data-src') != momImg.attr('src')) {
      if (momPhoto.complete) {
          console.log('immediately loaded ' + momImg[0].src);
          loadSpacer();
      } else {
          //setTimeout(function(){
              console.log('adding listener')
              momImg[0].addEventListener('load', () => {
                  console.log('lazy loaded ' + momImg[0].src);
                  loadSpacer();
              });
              momImg[0].addEventListener('error', (loaderror) => function(){console.log("Error loading image: " + loaderror); loadSpacer()}); // eslint-disable-line no-console, max-len
          //}, 25)
      }
      const loadSrc = momImg.attr('data-src');
      if (momImg) {
        momImg.attr('src', loadSrc);
      }

    } else {
      loadSpacer();
    }


    let hasFinished = false;
    function loadSpacer(){
      // position the spacer and moment
      if(!self.supportsGrid){
        self.setSpacerHeight();
        self.setMomentPos();
      }
      moment.find('.moment').removeClass('moment--loading');


      self.newSpacer[0].ontransitionend = () => finishLoad();

      setTimeout(function(){
        if(!hasFinished) {
          finishLoad();
        }
      }, 250);
    }

    function finishLoad(){
      if(hasFinished) return;
      hasFinished = true;
      self.momentDetail.addClass('moment__detail--show');
      //self.repositionSpacer();
      if (momPhoto) {
        momPhoto.addClass('moment__photo--loaded');
      }
      if (scrollUI) {
        setTimeout(() => {
          const newpos = self.activeMoment.offset().top// + (self.activeMoment.outerHeight() / 2);
          // console.log(newpos)
          // scrollPageTo(newpos, 1000);
          window.scroll({
            top: newpos - self.scrollAdjust,
            left: 0,
            behavior: 'smooth'
          });
        }, 250);
      }
    }
  }

  openMoment(moment, scrollUI) {
    const self = this;
    let keepspacer;

    // close any existing active moment
    self.cleanUp();

    // add animation class
    const momentInner = moment.find('.moment');
    momentInner.addClass('moment--loading');

    if(!self.supportsGrid){
      // calculate offset for spacer
      // if (self.lastRow) {
      //   console.log(self.lastRow)
      //   self.spacerTop = self.lastRow.offsetTop;
      // }

      //console.log("last row in openmoment", self.lastRow)
      self.findLastItemInRow(moment);

      // decide if we want to keep the existing spacer (is it on the same row as the new one will be)
      if(self.prevLastRow){
        keepspacer = self.prevLastRow[0] === self.lastRow[0];
      }
      if (!keepspacer) {
        self.removeSpacer();
      }
    }
    // make the moment active
    self.activeMoment = moment;
    self.activeMoment.find('.moment').addClass('moment--active');
    self.momentDetail = self.activeMoment.find('.moment__detail');



    if(!self.supportsGrid){
      if (!keepspacer || self.containerEl.find('.spacer').not('.spacer--leaving').length === 0) {
        // console.warn('Yes, adding spacer')
        self.createSpacer();
      }
      self.newSpacer = self.containerEl.find('.spacer').not('.spacer--leaving');
      self.newSpacer.addClass('spacer--active');
    }

    // load moment photo and finish open
    const momPhoto = moment.find('.moment__photo');
    const momImg = momPhoto.find('img');
    if (momPhoto.length > 0) {
      if (momImg.length > 0) {
        // wait until image has loaded before opening moment
        const loadSrc = momImg.attr('data-src');
        const tempImage = new Image();
        tempImage.src = loadSrc;
        tempImage.onload = () => self.openEnd(moment, scrollUI);
        tempImage.onerror = () => self.openEnd(moment, scrollUI);//momentInner.removeClass('moment--loading');

      } else {
        self.openEnd(moment, scrollUI);
      }
    } else {
      self.openEnd(moment, scrollUI);
    }
  }

  resize() {
    if(this.supportsGrid) return;

    const self = this;
    $(window).bind('resize', () => {
      clearTimeout(self.archiveresizing);

      self.archiveresizing = setTimeout(function(){
        self.repositionSpacer();
      }, 50);
    });
  }

}

export { Moments as default };
