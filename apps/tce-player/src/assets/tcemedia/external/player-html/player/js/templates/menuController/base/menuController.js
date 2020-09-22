var menuBox = function() {
  var p = {
    menu: true,
    domObj: new Object(),
    stageSize: { width: 300, height: 220 },
    // parameter for canvas
    left: -7,
    bottom: 0,
    target: '',
    // frames for jsfl
    openFrame: { start: 0, stop: 20 },
    closeFrame: { start: 21, stop: 40 },
    menuArr: [],
    sideImg: true, // show/hide side image coming on mouseover
    sideImgArr: [],
    noOfMenus: 2, //
    boxClick: true,
    type: 'type1', // this type for accessing jsfl of menuBox in case of type 1 menu
    sideImgPos: { 4: '10deg', 3: '-3deg', 2: '9deg', 1: '-4deg' },
    boxImg: new Image(),
    //  this parameters for menu type 2
    menuType: 'type1',
    menuType2List: [], //'[मेन्यू','परिचय','नियम','अभ्यास','प्रयोग' ]// ["Menu","Introduction","Tips","Practice"]
    menuOverColor: '#CB1B2D',
    menuNormalColor: '#DA4545',
    menuTxtColor: '#000000',
    containerNormalColor: '#E7969F'

    // parameters defined in menuBrain
    //backtoTips:true,
    //tipsControlObj:2,    // where to jump after click on back to tips
    //backtoTipsPosition:{left:760,top:541,width:170,height:30},  // if position is same on al screens
    //showBacktoTipsAt:[],
  };
  // =============
  var docRef;
  var serviceObj;
  var commonAssetPath;
  var initialTop = 550;
  var animateTop = 0;
  //=====================
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    docRef = p._shellModel.getiFrameRef().contentWindow.document;
    serviceObj = p._shellModel.getServiceObj();
    commonAssetPath = serviceObj.getCommonAssetPath();
    p.target = p._shellModel.getMeunDivRef();
    if (p.menu) {
      checkForType();
    }
    if (p.backtoTips) {
      createBackToTipsDiv();
    }
  };
  // ======= add event listeners =======
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  // ======= remove event listeners =======
  this.removeEventListener = function(_evt, _fun) {
    p[_evt] = '';
  };
  // ======== check for menu type =======
  function checkForType() {
    if (p.menuType == 'type1') {
      p.type = 'type' + (p.noOfMenus - 1);

      (p.boxImg.src = commonAssetPath + 'commonAssets/images/menuBox/box.png'),
        (p.boxImg.onload = function() {
          //console.log("inside image loaded");
          createjsflCanvas();
          createJsflObj(function() {
            createDiv();
          });
        });
    }
    if (p.menuType == 'type2') {
      createContainer();
    }
  }
  //===== dispatch backtoTips event from here =====
  function dispatchbacktoTipsEvent() {
    if (p.backtoList) {
      p.backtoList({ clicked: true });
    }
  }
  //===== dispatch menu event from here =====
  function dispatchMenuEvent(_id) {
    if (p.click) {
      p.click({ menu: _id });
    }
  }
  //==============================
  function createBackToTipsDiv() {
    var _div = docRef.createElement('div');
    $(_div).appendTo(p.target);
    $(_div)
      .css({
        position: 'absolute',
        left: p.backtoTipsPosition['left'] + 'px',
        top: p.backtoTipsPosition['top'] + 'px',
        width: p.backtoTipsPosition['width'] + 'px',
        height: p.backtoTipsPosition['height'] + 'px',
        cursor: 'pointer',
        //"background-color":"rgba(255,0,0,0.5)",
        display: 'none'
      })
      .attr('id', 'backtoTips');
    //console.log(p._shellModel.getPageDataObject())
    p.domObj['backtoTipsDiv'] = _div;
    bindBacktoTipsEvent();
  }
  //==============================
  this.showBacktoTips = function() {
    $(p.domObj['backtoTipsDiv']).show();
  };
  //==============================
  this.hideBacktoTips = function() {
    $(p.domObj['backtoTipsDiv']).hide();
  };
  //=============================
  this.resetCss = function() {
    for (var i in p.backtoTipsPosition) {
      $(p.domObj['backtoTipsDiv']).css(i, p.backtoTipsPosition[i] + 'px');
    }
  };
  //==============================
  this.setCss = function(_obj) {
    for (var i in _obj) {
      $(p.domObj['backtoTipsDiv']).css(i, _obj[i] + 'px');
    }
  };
  //==============================
  function bindBacktoTipsEvent() {
    $(p.domObj['backtoTipsDiv'])
      .off('click', backtoTipsClicked)
      .on('click', backtoTipsClicked);
  }
  //==============================
  function unbindBacktoTipsEvent() {
    if (p.backtoTips) {
      $(p.domObj['backtoTipsDiv']).off('click', backtoTipsClicked);
    }
  }
  //===========
  function backtoTipsClicked(e) {
    dispatchbacktoTipsEvent();
  }
  //========= create container for Menu type2 List with red color ======
  var _MenuHeaderHeight = 25;
  var _containerWidth = 120;
  function createContainer() {
    var container = docRef.createElement('div');
    var container2 = docRef.createElement('div');
    $(container).appendTo(p.target);
    $(container2).appendTo(p.target);
    $(container)
      .css({
        position: 'absolute',
        left: 20,
        top: initialTop,
        width: _containerWidth + 'px',
        'background-color': 'rgba(0,0,0,0)'
      })
      .attr('id', 'container')
      .attr('_status', 'false');
    p.domObj.container = container;

    var _image = new Image();
    _image.src = commonAssetPath + 'commonAssets/images/menuBox/box2.png';
    $(container2)
      .css({
        position: 'absolute',
        left: '12px',
        top: '565px',
        width: '139px',
        height: '16px',
        //"background-color":"rgba(0,0,0,0)",
        'pointer-events': 'none',
        'background-image': 'url(' + _image.src + ')'
      })
      .attr('id', 'container2');
    p.domObj.container2 = container2;

    var menuContainer = docRef.createElement('div');
    $(menuContainer).appendTo(container);
    $(menuContainer)
      .css({
        position: 'absolute',
        left: 0,
        top: 25,
        width: _containerWidth + 'px',
        'background-color': p.containerNormalColor
      })
      .attr('id', 'menuContainer')
      .attr('_status', 'false');
    p.domObj.menuContainer = menuContainer;
    //console.log("inside createContainer")
    createtype2Menus(menuContainer, container);
  }
  var totalHeight = 0;
  function createtype2Menus(menuContainer, container) {
    if (p.menuType2List.length == 0) {
      alert('menuType2List is empty');
      return;
    }
    //console.log(_target ," :: _target")
    var _MenuHeader = docRef.createElement('div');
    $(_MenuHeader).appendTo(container);
    var _image = new Image();
    _image.src = commonAssetPath + 'commonAssets/images/menuBox/arrow_1.png';
    $(_MenuHeader)
      .css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: _containerWidth + 'px',
        height: _MenuHeaderHeight + 'px',
        'line-height': _MenuHeaderHeight + 'px',
        'background-color': 'rgb(218,69,69)',
        'text-align': 'center',
        'background-image': 'url(' + _image.src + ')',
        'background-repeat': 'no-repeat',
        'background-position': '25px 10px'
      })
      .attr('id', 'MenuHeader')
      .attr('_status', 'false')
      .html(
        "<span _status=false class='mHeaderLabel' style='cursor:pointer;color:" +
          p.menuTxtColor +
          "'>" +
          p.menuType2List[0] +
          '</span>'
      );
    p.domObj['MenuHeader'] = _MenuHeader;
    var _span = $(p.domObj['MenuHeader']).find('span');
    p.domObj['MenuHeaderSpan'] = _span;
    $(p.domObj['MenuHeaderSpan'])
      .unbind('click', mainMenuEvent)
      .bind('click', mainMenuEvent);

    var _top = 0;
    for (var i = 1; i < p.menuType2List.length; i++) {
      var _div = docRef.createElement('div');
      $(_div).appendTo(menuContainer);
      var _ht = _MenuHeaderHeight;

      $(_div)
        .css({
          position: 'absolute',
          left: 0,
          top: _top,
          width: _containerWidth + 'px',
          height: p.menuType2List.length - 1 == i ? '30px' : _ht + 'px',
          cursor: 'pointer',
          'line-height': _ht + 'px',
          'background-color': p.menuNormalColor,
          'text-align': 'center',
          color: p.menuTxtColor
        })
        .attr('id', 'Menu_' + i)
        .attr('_status', 'false')
        .html(p.menuType2List[i])
        .unbind('mouseover mouseout click', menuEvent)
        .bind('mouseover mouseout click', menuEvent);
      p.domObj['Menu_' + i] = _div;
      _top += _MenuHeaderHeight + 1;
    }
    totalHeight = _top;
    animateTop = initialTop - totalHeight - 2;
    $(p.domObj.menuContainer).css('height', totalHeight);
    $(p.domObj.container).css('height', totalHeight - _MenuHeaderHeight);
  }
  function unbindMenuListEvent() {
    $(p.domObj['MenuHeaderSpan']).unbind('click', mainMenuEvent);
    for (var i = 1; i < p.menuType2List.length; i++) {
      $(p.domObj['Menu_' + i]).unbind('mouseover mouseout click', menuEvent);
    }
  }
  function menuEvent(e) {
    //console.log(e)
    var _id = e.currentTarget.id.split('_')[1];
    if (e.type == 'click') {
      //console.log("clicked");
      closeMenuList();
      // dispatch event from here
      dispatchMenuEvent(_id);
    }
    //hideAllSideImg();
    if (e.type == 'mouseover') {
      resetAllMenuColor();
      $(p.domObj[e.currentTarget.id]).css('background-color', p.menuOverColor);
    }
    if (e.type == 'mouseout') {
      resetAllMenuColor();
    }
  }
  function mainMenuEvent(e) {
    console.log($(this).attr('_status'));
    if ($(this).attr('_status') == 'false') {
      openMenuList();
    } else {
      closeMenuList();
    }
  }
  function openMenuList() {
    $(p.domObj.container)
      .clearQueue()
      .stop()
      .animate(
        {
          top: animateTop
        },
        500,
        function() {
          //console.log("animateTop complete",animateTop);
        }
      );
    $(p.domObj['MenuHeaderSpan']).attr('_status', 'true');
    var _image = new Image();
    _image.src = commonAssetPath + 'commonAssets/images/menuBox/arrow_2.png';
    p.domObj['MenuHeader'].style.backgroundImage = 'url(' + _image.src + ')';
  }
  function closeMenuList() {
    $(p.domObj.container)
      .clearQueue()
      .stop()
      .animate(
        {
          top: initialTop
        },
        500,
        function() {
          //console.log("initialTop complete");
        }
      );
    $(p.domObj['MenuHeaderSpan']).attr('_status', 'false');
    var _image = new Image();
    _image.src = commonAssetPath + 'commonAssets/images/menuBox/arrow_1.png';
    p.domObj['MenuHeader'].style.backgroundImage = 'url(' + _image.src + ')';
  }

  function resetAllMenuColor() {
    for (var i = 1; i < p.menuType2List.length; i++) {
      $(p.domObj['Menu_' + i]).css('background-color', p.menuNormalColor);
    }
  }

  // ====== creating menu type 1 ===== box Menu

  //==============================================
  // create canvas for playing jsfl
  function createjsflCanvas() {
    //console.log("inside jsfl")
    var jsflCanvas = docRef.createElement('canvas');
    $(jsflCanvas).appendTo(p.target);
    $(jsflCanvas)
      .css({
        position: 'absolute',
        left: p.left,
        bottom: p.bottom,
        'pointer-events': 'none'
      })
      .attr('id', 'jsflCanvas');
    jsflCanvas.width = p.stageSize.width;
    jsflCanvas.height = p.stageSize.height;
    p.domObj.jsflCanvas = jsflCanvas;
  }
  //
  function createDiv() {
    createBase();
    createMenus();
  }
  //--------------
  var rotateObj = {
    menu_1: {
      left: '60px',
      bottom: '',
      width: '120px',
      height: '25px',
      rotate: 'rotate(3deg) skewX(8deg)'
    },
    menu_2: {
      left: '58px',
      bottom: '',
      width: '120px',
      height: '25px',
      rotate: 'rotate(3deg) skewX(-6deg)'
    },
    menu_3: {
      left: '57px',
      bottom: '',
      width: '120px',
      height: '25px',
      rotate: 'rotate(3deg) skewX(8deg)'
    },
    menu_4: {
      left: '57px',
      bottom: '',
      width: '120px',
      height: '25px',
      rotate: 'rotate(3deg) skewX(8deg)'
    }
  };
  //  craete Divs for menus  2/3/4 depend on number of menus
  function createMenus() {
    var _bottom = 67;
    if (p.noOfMenus == 2) {
      _bottom = 93;
    }
    for (var i = p.noOfMenus; i >= 1; i--) {
      var _Div = docRef.createElement('div');
      $(_Div).appendTo(p.target);
      $(_Div)
        .css({
          position: 'absolute',
          left: rotateObj['menu_' + i]['left'],
          bottom: _bottom,
          width: '120px',
          height: '25px',
          'background-color': 'rgba(0,0,0,0)',
          transform: rotateObj['menu_' + i]['rotate'],
          '-webkit-transform': rotateObj['menu_' + i]['rotate'],
          '-moz-transform': rotateObj['menu_' + i]['rotate'],
          '-ms-transform': rotateObj['menu_' + i]['rotate'],
          '-o-transform': rotateObj['menu_' + i]['rotate']
        })
        .attr('id', 'menu_' + i);
      _bottom += 26;

      //  create side divImg div
      if (p.sideImg) {
        var _sideDiv = docRef.createElement('div');
        $(_sideDiv).appendTo(_Div);
        var _image = new Image();
        _image.src =
          commonAssetPath + 'commonAssets/images/menuBox/sideImg.png';
        $(_sideDiv)
          .css({
            position: 'absolute',
            right: '-18px',
            bottom: '3px',
            width: '20',
            height: '20',
            display: 'none',
            'background-image': 'url(' + _image.src + ')',
            'background-size': '100% 100%',
            'background-repeat': 'no-repeat'
            /* "transform":"rotate("+p.sideImgPos[i]+")",
					"-webkit-transform":"rotate("+p.sideImgPos[i]+")",
					"-moz-transform":"rotate("+p.sideImgPos[i]+")",
					"-ms-transform":"rotate("+p.sideImgPos[i]+")",
					"-o-transform":"rotate("+p.sideImgPos[i]+")", */
          })
          .attr('id', 'menuImg_' + i);
        p.domObj['menuImg_' + i] = _sideDiv;
        p.sideImgArr.push(_sideDiv);
      }

      p.domObj['menu_' + i] = _Div;
      p.menuArr.push(_Div);
    }
    //hide after creating divs
    hideMenu();
  }
  // bind/unbind Menu events
  function bindMenuEvents() {
    for (var i = 1; i <= p.noOfMenus; i++) {
      $(p.domObj['menu_' + i])
        .css('cursor', 'pointer')
        .unbind('click mouseover mouseout', menuClicked)
        .bind('click mouseover mouseout', menuClicked);
    }
  }
  function unbindMenuEvents() {
    for (var i = 1; i <= p.noOfMenus; i++) {
      $(p.domObj['menu_' + i])
        .css('cursor', '')
        .unbind('click mouseover mouseout', menuClicked);
    }
  }
  //  show/hide side Images
  function hideAllSideImg() {
    if (p.sideImg) {
      for (var i = 0; i < p.sideImgArr.length; i++) {
        $(p.sideImgArr[i]).hide();
      }
    }
  }
  function showAllSideImg() {
    if (p.sideImg) {
      for (var i = 0; i < p.sideImgArr.length; i++) {
        $(p.sideImgArr[i]).show();
      }
    }
  }
  //   menu clicked events
  function menuClicked(e) {
    var _id = e.currentTarget.id.split('_')[1];
    if (e.type == 'click') {
      closeMenuBox();
      dispatchMenuEvent(_id);
    } else {
      hideAllSideImg();
      if (e.type == 'mouseover') {
        if (p.sideImg) {
          $(p.domObj['menuImg_' + _id]).show();
        }
      }
    }
  }
  // click event of base of Menu box
  function baseClick(e) {
    unbindBaseEvent();
    if (p.domObj.baseDiv.getAttribute('_status') == 'false') {
      openMenuBox();
    } else {
      closeMenuBox();
    }
  }
  //  open/close menuBoxes with JSFL
  function openMenuBox() {
    if (!p.boxClick) {
      $(p.domObj.baseDiv).css('cursor', '');
    }
    p.domObj.baseDiv.setAttribute('_status', 'true');
    setCanvas();
    runJSFL(p.openFrame.start, p.openFrame.stop, function() {
      if (p.boxClick) {
        bindBaseEvent();
      }
      showMenu();
      bindMenuEvents();
    });
  }
  function closeMenuBox() {
    unbindMenuEvents();
    hideMenu();
    hideAllSideImg();
    p.domObj.baseDiv.setAttribute('_status', 'false');
    setCanvas();
    runJSFL(p.closeFrame.start, p.closeFrame.stop, function() {
      bindBaseEvent();
      resetCanvas();
    });
  }
  function resetCanvas() {
    p.domObj.jsflCanvas.height = 85; // set height after menu box close to avoid overlapping of another content behind jsfl canvas
    //p.domObj.jsflCanvas.width = 300;
    $(p.domObj.jsflCanvas).css({
      bottom: p.bottom
    });
    var ctx = p.domObj.jsflCanvas.getContext('2d');
    p.domObj.jsflCanvas.width = p.domObj.jsflCanvas.width;
    ctx.drawImage(p.boxImg, -1, 1); // draw box image after menu get Close
  }
  function setCanvas() {
    $(p.domObj.jsflCanvas).css({
      bottom: '-54px'
    });
    p.domObj.jsflCanvas.width = p.stageSize.width;
    p.domObj.jsflCanvas.height = p.stageSize.height;
  }
  //  show/hide menus
  function showMenu() {
    for (var i = 0; i < p.menuArr.length; i++) {
      $(p.menuArr[i]).show();
    }
  }
  function hideMenu() {
    for (var i = 0; i < p.menuArr.length; i++) {
      $(p.menuArr[i]).hide();
    }
  }
  //  bind/unbind menubox base Events
  function bindBaseEvent() {
    $(p.domObj.baseDiv)
      .css('cursor', 'pointer')
      .unbind('click', baseClick)
      .bind('click', baseClick);
  }
  function unbindBaseEvent() {
    $(p.domObj.baseDiv)
      .css('cursor', '')
      .unbind('click', baseClick);
  }

  // craete base of menu box
  function createBase() {
    var _baseDiv = docRef.createElement('div');
    $(_baseDiv).appendTo(p.target);
    $(_baseDiv)
      .css({
        position: 'absolute',
        left: '37px',
        bottom: '30px',
        width: '150px',
        height: '45px',
        cursor: 'pointer',
        'border-top-left-radius': '25px',
        'background-color': 'rgba(0,0,0,0)',
        transform: 'rotate(3deg)',
        '-webkit-transform': 'rotate(3deg)',
        '-moz-transform': 'rotate(3deg)',
        '-ms-transform': 'rotate(3deg)',
        '-o-transform': 'rotate(3deg)'
      })
      .attr('id', 'baseDiv')
      .attr('_status', 'false');
    p.domObj.baseDiv = _baseDiv;
    bindBaseEvent();
  }

  //  jsfl Object
  function createJsflObj(_callbak) {
    p.jsflObj = new AnimationManager({
      stage: p.domObj.jsflCanvas,
      width: p.stageSize.width,
      height: p.stageSize.height,
      id: 'jsfl_1',
      timeline:
        commonAssetPath +
        'commonAssets/images/menuBox/' +
        p.type +
        '/timeline.json',
      images:
        commonAssetPath +
        'commonAssets/images/menuBox/' +
        p.type +
        '/images.json',
      fps: 24,
      progress: function(_per) {},
      ready: function() {
        //console.log("jsfl Ready");
        resetCanvas();
        if (_callbak) {
          _callbak();
        }
        //runJSFL(0,1);
      }
    });
  }
  //  run JSFl
  function runJSFL(_startFrame, _endFrame, _callBack) {
    //console.log("_startFrame :: ",_startFrame , _endFrame , "  :: _endFrame")
    p.jsflObj.playSegment({
      start: _startFrame,
      end: _endFrame,
      fps: 24,
      loop: false,
      frame: function(e) {},
      stop: function() {
        if (_callBack) {
          _callBack();
        }
      }
    });
  }
  this.destroy_element = function(e, _btnRef) {
    //p.audioObj.stop();
    //console.log("destroy_element from menuBox.js");
    if (p) {
      unbindMenuListEvent();
      unbindBacktoTipsEvent();
      unbindBaseEvent();
      unbindMenuEvents();
      for (var i in p.domObj) {
        $(p.domObj[i]).remove();
      }
      delete p;
    }
  };
};
