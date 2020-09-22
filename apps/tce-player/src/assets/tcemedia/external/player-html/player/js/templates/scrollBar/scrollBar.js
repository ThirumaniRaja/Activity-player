var scrollBar = function() {
  var p = {
    //  div id's
    parentDiv: '', // id of parent div pass from xml
    contentHolder: '', // id of contentholder div pass from xml
    content: '', // id of content div pass from xml
    //
    verticalBarColor: '#9AABB1', // scrollbar vertical line color
    scrollButtons: true, //  if want scrollbar buttons
    fullScrollBar: false, //  show full scrollbar as per parent div height need to give scrollButtons:false
    customScrollBarHt: '75%', // scrollbar height
    knobHeight: 42, // set knobheight
    knobWidth: 16, // set knob width
    scrollAreaWidth: 16, //  set width of scroll area
    scrBorder: '2px', // vertical grey line width and style
    leftPadding: 0, // if want to move scoller to left side of parent div
    scrollSpeed: 5, // set scrollspeed accordign to content
    scrollDrag: true, // scroll dragging enable or disble
    knobImg: 'commonAssets/images/scrollBar/knob.png', // defalut knobImage for dragger
    scrUpbuttonWidth: 20, // upArrow button width
    scrUpbuttonHeight: 20, // upArrow button height
    scrDownbuttonWidth: 20, // downArrow button width
    scrDownbuttonHeight: 20, // downArrow button height
    scrUpbuttonImg: 'commonAssets/images/scrollBar/upArrow.png', // default image for upArrow
    scrDownbuttonImg: 'commonAssets/images/scrollBar/downArrow.png', //default image for downArrow
    domObj: {}, // store all dom elemnt
    scrollUpButtonBorder: '', // if require border for upbutton
    scrollDownButtonBorder: '' //// if require border for downbutton
  };
  var iFrameDoc;
  var serviceObj;
  var commonAssetPath;
  var knobImage = new Image();
  var scrDownbuttonImg = new Image();
  var scrUpbuttonImg = new Image();
  var _scrollMainHolder;
  //============= public functions========
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    iFrameDoc = p._shellModel.getiFrameRef().contentWindow.document;
    serviceObj = p._shellModel.getServiceObj();
    commonAssetPath = serviceObj.getCommonAssetPath();
    setImagePath();

    //below code removed and addded in loadImages;
    var mainHolder = p.domObj[p.parentDiv];
    p.domObj['mainHolder'] = mainHolder;
    //console.log(p.domObj[p.parentDiv],"p.parentDiv")
    //console.log(mainHolder,"mainHolder")
    //console.log(p.domObj,"mainHolder")
    createContentholder(mainHolder);
  };
  //  disable all
  this.disable = function() {
    disableDrag();
    unbindscrollButtonEvents();
  };
  // disable dragger
  this.disableDragger = function() {
    disableDrag();
  };
  // enable dragger
  this.enableDragger = function() {
    makeDraggable();
    //$(_scrollKnob).css('cursor','').draggable("disable");
  };
  // disable scroll up/down buttons
  this.disableButtons = function() {
    unbindscrollButtonEvents();
  };
  // enable scroll up/down buttons
  this.enableButtons = function() {
    if (p.scrollButtons) {
      bindscrollButtonEvents();
    }
  };
  //-----------------------
  function disableDrag() {
    $(_scrollKnob)
      .css('cursor', '')
      .draggable('disable');
  }

  function setImagePath() {
    if (p.knobImg.indexOf('commonAssets') != -1) {
      p.knobImg = commonAssetPath + p.knobImg;
    } else {
      p.knobImg = p._shellModel.getMediaPath() + p.knobImg;
    }

    if (p.scrUpbuttonImg.indexOf('commonAssets') != -1) {
      p.scrUpbuttonImg = commonAssetPath + p.scrUpbuttonImg;
    } else {
      p.scrUpbuttonImg = p._shellModel.getMediaPath() + p.scrUpbuttonImg;
    }

    if (p.scrDownbuttonImg.indexOf('commonAssets') != -1) {
      p.scrDownbuttonImg = commonAssetPath + p.scrDownbuttonImg;
    } else {
      p.scrDownbuttonImg = p._shellModel.getMediaPath() + p.scrDownbuttonImg;
    }

    //preload 4/25/2017
    knobImage.src = p.knobImg;
    knobImage.onload = loadImages;

    scrUpbuttonImg.src = p.scrUpbuttonImg;
    scrUpbuttonImg.onload = loadImages;

    scrDownbuttonImg.src = p.scrDownbuttonImg;
    scrDownbuttonImg.onload = loadImages;
  }
  var imageCount = 3,
    currentImageCount = 0;
  function loadImages() {
    currentImageCount++;
    if (imageCount == currentImageCount) {
      var mainHolder = p.domObj[p.parentDiv];
      p.domObj['mainHolder'] = mainHolder;
      //createContentholder(mainHolder);
      $(_scrollMainHolder).css({ opacity: '1' }); //addded 5/10/2017
    }
  }
  var _scrollKnob;
  function createContentholder(_parent) {
    var contentHolder = p.domObj[p.contentHolder];
    //$(_parent).append(contentHolder);
    $(contentHolder)
      .css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: $(_parent).width(),
        height: '100%',
        overflow: 'hidden'
      })
      .attr('id', 'contentHolder');
    p.domObj[p.contentHolder] = contentHolder;

    var _content = p.domObj[p.content];
    //$(_content).appendTo(contentHolder);
    $(_content)
      .css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: '95%',
        height: 'auto'
      })
      .attr('id', '_content');
    p.domObj[p.content] = _content;

    _scrollMainHolder = iFrameDoc.createElement('div');
    $(_parent).append(_scrollMainHolder);
    $(_scrollMainHolder)
      .css({
        position: 'absolute',
        left: $(_parent).width() + p.leftPadding,
        height: '100%',
        top: 0,
        width: 2,
        opacity: '0' //added 5/10/2017
      })
      .attr('id', '_scrollArea' + p.parentDiv);

    var _scrollArea = iFrameDoc.createElement('div');
    $(_scrollMainHolder).append(_scrollArea);
    if (p.scrBorder.indexOf('px') != -1) {
      p.scrBorder = p.scrBorder.split(' ')[0];
    }
    $(_scrollArea)
      .css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: p.scrollAreaWidth,
        'border-left': p.scrBorder + ' solid ' + p.verticalBarColor,
        'border-left-style': 'solid',
        'border-left-width': p.scrBorder,
        'border-left-color': p.verticalBarColor
      })
      .attr('id', '_scrollArea' + p.parentDiv);
    //   scrollButtons On/Off
    var scrollBarHt = '100%';
    if (p.scrollButtons) {
      scrollBarHt = '75%';
    }
    if (p.fullScrollBar && !p.scrollButtons) {
      scrollBarHt = '100%';
    }
    if (p.customScrollBarHt) {
      scrollBarHt = p.customScrollBarHt;
    }
    $(_scrollArea).css({
      height: scrollBarHt
    });
    p.domObj['scrollArea' + p.parentDiv] = _scrollArea;

    _scrollKnob = iFrameDoc.createElement('div');
    $(_scrollArea).append(_scrollKnob);
    $(_scrollKnob)
      .css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: p.knobWidth,
        height: p.knobHeight,
        'background-image': 'url(' + knobImage.src + ')',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat'
      })
      .attr('id', '_scrollKnob');
    p.domObj['scrollKnob' + p.parentDiv] = _scrollKnob;

    if (p.scrollButtons) {
      var scrollUpButton = iFrameDoc.createElement('div');
      $(scrollUpButton).appendTo(_scrollMainHolder);
      $(scrollUpButton)
        .css({
          position: 'absolute',
          left: 0 - p.scrUpbuttonWidth / 2,
          bottom: p.scrDownbuttonHeight + 5,
          width: p.scrUpbuttonWidth,
          height: p.scrUpbuttonHeight,
          'background-image': 'url(' + scrUpbuttonImg.src + ')',
          'background-repeat': 'no-repeat',
          'background-size': '100% 100%',
          border: p.scrollUpButtonBorder,
          'background-color': 'rgba(0,0,0,0)'
        })
        .attr('id', 'scrollUpButton');
      p.domObj['scrollUpButton'] = scrollUpButton;

      var scrollDownButton = iFrameDoc.createElement('div');
      $(scrollDownButton).appendTo(_scrollMainHolder);
      $(scrollDownButton)
        .css({
          position: 'absolute',
          left: 0 - p.scrDownbuttonWidth / 2,
          bottom: 0,
          width: p.scrDownbuttonWidth,
          height: p.scrDownbuttonHeight,
          'background-image': 'url(' + scrDownbuttonImg.src + ')',
          'background-repeat': 'no-repeat',
          'background-size': '100% 100%',
          border: p.scrollDownButtonBorder,
          'background-color': 'rgba(0,0,0,0)'
        })
        .attr('id', 'scrollDownButton');
      p.domObj['scrollDownButton'] = scrollDownButton;

      scrollBarHt =
        $(_scrollMainHolder).height() -
        (parseFloat(scrollUpButton.style.bottom) + p.scrUpbuttonHeight + 10);
      $(_scrollArea).css({
        height: scrollBarHt
      });
    }
    //console.log((p.domObj["content"]).getBoundingClientRect() , "   :: height");
    //console.log((p.domObj[p.content]).scrollHeight , "   :: height");
    var difference = p.domObj[p.content].scrollHeight - $(_parent).height();
    if (difference > 0) {
      var scrollHt = $(_scrollArea).height() - $(_scrollKnob).height();
      scrollMaxTop = scrollHt;
      var _ratio = difference / scrollHt;
      scrollRatio = _ratio;
      //console.log(scrollRatio , "  :: scrollRatio")
      if (p.scrollDrag) {
        makeDraggable();
      }
      if (p.scrollButtons) {
        bindscrollButtonEvents();
      }
    } else {
      console.log('Contents are fit inside given Area...!');
    }
  }
  function makeDraggable() {
    $(_scrollKnob)
      .draggable({
        containment: 'parent',
        drag: function() {
          setContent();
        }
      })
      .css('cursor', 'pointer');
  }
  function setContent() {
    $(p.domObj[p.content]).css({
      top:
        0 -
        parseFloat(p.domObj['scrollKnob' + p.parentDiv].style.top) * scrollRatio
    });
  }
  var scrollMaxTop;
  var scrollRatio;
  function bindscrollButtonEvents() {
    $(p.domObj['scrollUpButton'])
      .unbind('mousedown', scrollButtonEvent)
      .bind('mousedown', scrollButtonEvent)
      .css('cursor', 'pointer');
    $(p.domObj['scrollDownButton'])
      .unbind('mousedown', scrollButtonEvent)
      .bind('mousedown', scrollButtonEvent)
      .css('cursor', 'pointer');
    $(iFrameDoc)
      .unbind('mouseup', stopScroll)
      .bind('mouseup', stopScroll);
  }
  function unbindscrollButtonEvents() {
    $(p.domObj['scrollUpButton'])
      .unbind('mousedown', scrollButtonEvent)
      .css('cursor', '');
    $(p.domObj['scrollDownButton'])
      .unbind('mousedown', scrollButtonEvent)
      .css('cursor', '');
    $(iFrameDoc).unbind('mouseup', stopScroll);
  }
  var requestID;
  function scrollButtonEvent(e) {
    if (e.target.id == 'scrollUpButton') {
      if (parseFloat(p.domObj['scrollKnob' + p.parentDiv].style.top) > 0)
        scrollBtnEvt('up');
    } else {
      if (
        parseFloat(p.domObj['scrollKnob' + p.parentDiv].style.top) <
        scrollMaxTop
      )
        scrollBtnEvt('down');
    }
  }
  function scrollBtnEvt(event) {
    requestID = requestAnimationFrame(function() {
      scrollBtnEvt(event);
    });
    if (event == 'up') {
      $(p.domObj['scrollKnob' + p.parentDiv]).css({
        top:
          parseFloat(p.domObj['scrollKnob' + p.parentDiv].style.top) -
          p.scrollSpeed
      });

      if (parseFloat(p.domObj['scrollKnob' + p.parentDiv].style.top) <= 0) {
        stopScroll();
        $(p.domObj['scrollKnob' + p.parentDiv]).css({
          top: 0
        });
      }
    } else {
      $(p.domObj['scrollKnob' + p.parentDiv]).css({
        top:
          parseFloat(p.domObj['scrollKnob' + p.parentDiv].style.top) +
          p.scrollSpeed
      });

      if (
        parseFloat(p.domObj['scrollKnob' + p.parentDiv].style.top) >=
        scrollMaxTop
      ) {
        stopScroll();
        $(p.domObj['scrollKnob' + p.parentDiv]).css({
          top: scrollMaxTop
        });
      }
    }
    setContent();
  }

  function stopScroll(e) {
    cancelAnimationFrame(requestID);
  }
};
