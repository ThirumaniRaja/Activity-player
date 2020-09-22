var dropDown = function() {
  var p = {
    target: 'body',
    id: '',
    x: 0,
    y: 0,
    width: 150,
    boxHeight: 20,
    paddingTop: 10,
    selectedIndex: 0,
    align: 'left',
    fontSize: '1em',
    visible: true,
    border: true,
    downwards: true,
    bold: false,
    tabItem: [],
    cursor: 'pointer',
    alpha: 0.2,
    cssStyle: 1, //value:"custom" for customCSS
    customStyle: '', //for customCss Style
    customBorderColor: '', //for custom border color
    defaultValue: 'Select an option',
    _shellModel: '',
    Textcolor: '#363336',
    fontFamily: 'TISClassEdge'
  };

  var DrpDnContainer, tab, indicator, itemCont, lowerHolder, ulParentDiv;
  var curSelIndex = 0;
  var style, borderColor;
  var innerDivHeight,
    selTxt,
    listArr = [];
  var _commonAssetPath;
  var iFrameDoc;
  this.init = function(_obj) {
    listArr = [];
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    p.cursor = p.cursor == '' ? 'pointer' : p.cursor;
    iFrameDoc = p._shellModel.getiFrameRef().contentWindow.document;
    var _div = iFrameDoc.createElement('div');
    if (p.target) $(p.target).append(_div);
    else $('body').append(_div);
    p.target = $(_div);
    p.visible == false ? p.target.css('display', 'none') : null;
    p.target.css({
      position: 'absolute',
      left: p.x + 'px',
      top: p.y + 'px',
      width: p.width + 'px',
      height: p.height + 'px',
      'border-radius': '5px'
    });

    DrpDnContainer = iFrameDoc.createElement('div');
    tab = iFrameDoc.createElement('div');
    indicator = iFrameDoc.createElement('div');
    lowerHolder = iFrameDoc.createElement('div');

    ulParentDiv = iFrameDoc.createElement('div');
    itemCont = iFrameDoc.createElement('ul');

    //=====================================================
    p.target.append(DrpDnContainer);
    $(DrpDnContainer)
      .append(tab)
      .append(indicator);
    //=====================================================
    $(DrpDnContainer).css({
      'background-color': 'rgba(255, 255, 255, 0.2)',
      float: 'left',
      width: p.width + 'px',
      height: p.height //"auto",
    });

    switch (p.cssStyle) {
      case 1:
      case 'blue':
        style = 'blue';
        borderColor = '#0033CC'; //"rgba(215,238,254,1)";
        break;
      case 'custom':
        style = p.customStyle;
        borderColor = p.customBorderColor;
        break;
    }
    //====dropDown container area=====

    $(tab).css({
      position: 'absolute',
      left: '0px',
      width: p.width - 26 - 5 - 1 + 'px',
      height: p.height - 2, //"auto",
      'text-align': p.align,
      'background-color': '#fff',
      color: p.Textcolor,
      'font-family': p.fontFamily,
      'font-size': p.fontSize,
      padding: p.paddingTop + 'px 0px',
      'padding-left': '5px',
      'word-wrap': 'break-word',
      //"border-color":"rgba(204,204,204,"+p.alpha+")",
      'border-radius': '5px 0px 0px 5px',
      cursor: p.cursor,
      'min-height': '16px'
    });
    if (p.bold) {
      $(tab).css({ 'font-weight': 'bold' });
    }
    if (p.border) {
      $(tab).css({
        'border-top': '1px solid',
        'border-bottom': '1px solid',
        'border-right': '1px solid',
        'border-left': '1px solid'
      });
    }
    //====traingle container=====
    var tabHeight = p.boxHeight + 2;
    var _path =
      jsPath != ''
        ? window.location.protocol + '//' + window.location.hostname
        : '';
    _commonAssetPath =
      _path + p._shellModel.getServiceObj().getCommonAssetPath();
    $(indicator).css({
      //"float":"right",
      position: 'absolute',
      left: p.width - 25 + 'px',
      width: '24px',
      height: tabHeight + 'px',
      'font-size': '1.6em',

      'text-align': 'center',
      background:
        'url(' +
        _commonAssetPath +
        'commonAssets/images/dropDown/arrow.png) no-repeat ',
      'background-position': 'center',
      'background-size': '13px 8px',
      //"border-color":"rgba(204,204,204,"+p.alpha+")",
      'border-top-right-radius': '5px',
      'border-bottom-right-radius': '5px',
      cursor: p.cursor,
      'background-color': '#fff'
    }); //.html("&#9662");
    if (p.border) {
      $(indicator).css({
        'border-top': '1px solid',
        'border-bottom': '1px solid',
        'border-right': '1px solid'
      });
    }
    //====listDrpDownComponent=====
    $(lowerHolder).css({
      position: 'absolute',
      left: '0px',
      display: 'inline-block',
      width: p.width + 'px',
      background: 'rgba(0, 0, 0,0.2)',
      display: 'none',
      'border-radius': '5px'
    });

    $(ulParentDiv).css({
      display: 'inline-block',
      width: p.width
    });

    p.target.append(lowerHolder);
    $(lowerHolder).append(ulParentDiv);
    $(ulParentDiv).append(itemCont);

    setListItemFn();
    setTabContainerHt();

    $(DrpDnContainer)
      .unbind('touchstart touchend mousedown', downEvt)
      .bind('touchstart touchend mousedown', downEvt);

    $(DrpDnContainer)
      .unbind('click', btnEvt)
      .bind('click', btnEvt);

    $(tab)
      .unbind('mouseout mouseover', tabEvent)
      .bind('mouseout mouseover', tabEvent);
    $(indicator)
      .unbind('mouseout mouseover', tabEvent)
      .bind('mouseout mouseover', tabEvent);
  };
  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };
  this.show = function() {
    p.target.show();
  };
  //================================================================================
  this.hide = function() {
    p.target.hide();
  };
  this.getSelectedText = function() {
    return selTxt;
  };
  this.getSelectedIndex = function() {
    return curSelIndex;
  };
  this.setSelectedIndex = function(indx) {
    resetIndexItem();
    $(tab).html(indx == -1 ? p.defaultValue : p.tabItem[indx]);
    selTxt = indx == -1 ? p.defaultValue : p.tabItem[indx];
    if (indx != -1) setListItem(indx);
    curSelIndex = indx;
    //$(tab).html(p.tabItem[indx]);
    //selTxt = p.tabItem[indx]
    setTabContainerHt();
  };

  this.resetOption = function() {
    curSelIndex = -1;
    $(tab).html(p.defaultValue);
    resetIndexItem();
    setTabContainerHt();
  };
  this.resetList = function(_arr) {
    curSelIndex = -1;
    $(tab).html(p.defaultValue);
    resetIndexItem();
    for (var i in _arr) {
      p.tabItem[i] = _arr[i];
    }
    for (var i in listArr) {
      $(listArr[i]).html('<span>' + _arr[i] + '</span>');
    }
    setTabContainerHt();
  };

  this.enableDisable = function(_flag) {
    if (_flag) {
      $(DrpDnContainer).unbind('touchstart touchend mousedown', downEvt);

      $(DrpDnContainer).unbind('click', btnEvt);

      $(tab).unbind('mouseout mouseover', tabEvent);
      $(indicator).unbind('mouseout mouseover', tabEvent);
    } else {
      $(DrpDnContainer)
        .unbind('touchstart touchend mousedown', downEvt)
        .bind('touchstart touchend mousedown', downEvt);

      $(DrpDnContainer)
        .unbind('click', btnEvt)
        .bind('click', btnEvt);

      $(tab)
        .unbind('mouseout mouseover', tabEvent)
        .bind('mouseout mouseover', tabEvent);
      $(indicator)
        .unbind('mouseout mouseover', tabEvent)
        .bind('mouseout mouseover', tabEvent);
    }
  };
  //=================================================================================
  function tabEvent(e) {
    if (e.type == 'mouseover') {
      $(tab).css('border-color', borderColor);
      $(indicator).css('border-color', borderColor);
    } else {
      $(tab).css('border-color', '#000');
      $(indicator).css('border-color', '#000');
    }
    //$(this).css()
  }

  //=================================================================================
  function downEvt(e) {
    if (e.type == 'mousedown' || e.type == 'touchstart') {
      $(tab).addClass(style + '_tab');
      $(indicator).css({
        background:
          'url(' +
          _commonAssetPath +
          'commonAssets/images/dropDown/arrow.png) no-repeat ',
        'background-position': 'center',
        'background-size': '13px 8px',
        'background-color': '#fff'
      });
      $(iFrameDoc)
        .unbind('mouseup', downEvt)
        .bind('mouseup', downEvt);
    } else if (e.type == 'mouseup' || e.type == 'touchend') {
      $(iFrameDoc).unbind('mouseup', downEvt);
      $(tab).removeClass(style + '_tab');
      $(tab).css({
        'background-color': '#fff',
        color: p.Textcolor
      });
      $(indicator).css({
        background:
          'url(' +
          _commonAssetPath +
          'commonAssets/images/dropDown/arrow.png) no-repeat ',
        'background-position': 'center',
        'background-size': '13px 8px',
        'background-color': '#fff'
      });
    }
  }
  //=================================================================================
  function onWindowUp(e) {
    if (e.type == 'touchstart') {
      e.pageX = e.originalEvent.touches[0].pageX;
      e.pageY = e.originalEvent.touches[0].pageY;
    }
    var _xCond =
      e.pageX < p.target.offset().left ||
      e.pageX > p.target.offset().left + p.target.outerWidth(true);
    if (p.downwards) {
      var _yCond =
        e.pageY < p.target.offset().top ||
        e.pageY >
          p.target.offset().top +
            p.target.outerHeight(true) +
            $(lowerHolder).outerHeight(true);
    } else {
      var _yCond =
        e.pageY > p.target.offset().top + p.target.outerHeight(true) ||
        e.pageY < p.target.offset().top - $(lowerHolder).outerHeight(true);
    }
    if (_xCond || _yCond) {
      $(lowerHolder).hide();
      $(iFrameDoc).unbind('mousedown', onWindowUp);
      $(iFrameDoc).unbind('touchstart', onWindowUp);
    }
  }
  //=================================================================================
  function btnEvt(e) {
    setTabContainerHt();
    if ($(lowerHolder).css('display') == 'none') {
      $(lowerHolder).show();
      $(iFrameDoc)
        .unbind('touchstart mousedown', onWindowUp)
        .bind('touchstart mousedown', onWindowUp);
    } else {
      $(lowerHolder).hide();
      $(iFrameDoc).unbind('touchstart mousedown', onWindowUp);
    }
  }
  function setListItemFn() {
    if (p.tabItem.length != 0) {
      $(itemCont).empty();

      listArr = new Array();

      var containerWidth = p.width;
      $(itemCont).css({
        position: 'relative',
        top: '0px',
        'list-style-type': 'none',
        display: 'inline-block',
        background: 'rgba(0, 0, 0,0.2)',
        width: containerWidth + 'px',
        padding: p.paddingTop / 2 + 'px ',
        margin: '0px',
        padding: '0px',
        'z-index': 100,
        'background-color': '#fff'
      });
      if (typeof p.height != 'undefined') {
        $(lowerHolder).css('max-height', p.height + 'px');
      }
      var newHeight = 0;
      for (var i = 0; i < p.tabItem.length; i++) {
        var listIndxComp = iFrameDoc.createElement('li');
        $(itemCont).append(listIndxComp);
        $(listIndxComp).attr({
          'data-dropdownid': i
        });

        $(listIndxComp).css({
          'text-align': p.align,
          padding: p.paddingTop + 'px',
          //"background":"#FFFFFF",
          'font-family': p.fontFamily,
          'font-size': p.fontSize,
          cursor: p.cursor,
          'padding-left': p.listLeftPadding + 'px',
          'border-right': '1px solid rgba(0, 0, 0, 1)',
          'border-left': '1px solid rgba(0, 0, 0, 1)',
          'border-top': p.downwards ? '' : '1px solid rgba(0, 0, 0, 1)',
          'border-bottom': p.downwards ? '1px solid rgba(0, 0, 0, 1)' : '',
          'word-wrap': 'break-word'
        });

        if (p.bold) {
          $(listIndxComp).css({
            'font-weight': 'bold'
          });
        }
        listArr.push($(listIndxComp));
        $(listIndxComp)
          .unbind('click', onListClick)
          .bind('click', onListClick);

        $(listIndxComp)
          .unbind('mouseover', onMouseIn)
          .bind('mouseover', onMouseIn);
        $(listIndxComp)
          .unbind('mouseout', onMouseOut)
          .bind('mouseout', onMouseOut);

        $(listIndxComp).html('<span>' + p.tabItem[i] + '</span>');
        if (i == 0) {
          $(listIndxComp)
            .css('color', '#000')
            .addClass(style + '_selected');
        }
        newHeight += $(listIndxComp).outerHeight();
      }
      innerDivHeight = newHeight;
      if (
        p.height &&
        p.height + $(listIndxComp).outerHeight() < innerDivHeight
      ) {
        //createSlider();
        $(lowerHolder).css({ height: $(itemCont).height() });
      } else {
        $(lowerHolder).css({ height: 'auto' });
        $(itemCont).css({ width: $(lowerHolder).width() });
      }
    }
    $(tab).html(
      p.selectedIndex == -1 ? p.defaultValue : p.tabItem[p.selectedIndex]
    );
    selTxt =
      p.selectedIndex == -1 ? p.defaultValue : p.tabItem[p.selectedIndex];
    if (p.selectedIndex == '' || p.selectedIndex == -1) curSelIndex = null;
    $(indicator).css('height', $(tab).height() + p.paddingTop * 2 + 'px');
  }
  //=================================================================================
  function setTabContainerHt() {
    if (p.downwards) {
      $(lowerHolder).css('top', $(tab).outerHeight(true) + 'px');
    } else {
      $(lowerHolder).css('top', '');
      //if(p.border)
      {
        $(lowerHolder).css('bottom', p.target.outerHeight(true) + 'px');
      }
      //else
      {
        //$(lowerHolder).css('bottom',(p.target.outerHeight(true)+ (2))+'px');
      }
    }
    $(indicator).css('height', $(tab).height() + p.paddingTop * 2 + 'px');
    //$(tab).css({"height":$(indicator).css('height')+"px"})
    if ($(tab).outerHeight() >= p.boxHeight) {
      $(DrpDnContainer).css('height', $(tab).outerHeight() + 'px');
    } else {
      $(DrpDnContainer).css('height', $(indicator).css('height'));
    }
  }
  //=================================================================================
  function onMouseIn(e) {
    if ($(this).hasClass(style + '_selected'))
      $(this).removeClass(style + '_hover');
    else $(this).addClass(style + '_hover');
    $(this).css('border-color', 'rgba(215,238,254,1)');
  }
  //=================================================================================
  function onMouseOut(e) {
    $(this)
      .css('background', '')
      .removeClass(style + '_hover');
    $(this).css('border-color', '#000');
  }
  //=================================================================================
  function onListClick(e) {
    var curIndx = $(this).attr('data-dropdownid');
    resetIndexItem();
    $(this)
      .css('color', '#000')
      .addClass(style + '_selected')
      .removeClass(style + '_hover');
    $(tab).html(p.tabItem[curIndx]);
    selTxt = p.tabItem[curIndx];
    setTabContainerHt();
    //$(this).parent().hide();
    $(this)
      .parent()
      .parent()
      .parent()
      .hide();
    //=================================================
    curSelIndex = curIndx;
    if (p['onIndxSelect']) {
      p['onIndxSelect']({
        id: p['id'],
        value: curSelIndex
      });
    }
    setListItem(curSelIndex);
    if ($(tab).outerHeight() >= p.boxHeight) {
      $(DrpDnContainer).css('height', $(tab).outerHeight() + 'px');
    } else {
      $(DrpDnContainer).css('height', p.boxHeight + 'px');
    }
  }
  //=================================================================================
  function resetIndexItem() {
    for (var i = 0; i < p.tabItem.length; i++) {
      listArr[i]
        .css('background-color', '#fff')
        .css('color', '#000')
        .removeClass(style + '_selected');
    }
  }
  //=================================================================================
  function setListItem(index) {
    for (var i = 0; i < listArr.length; i++) {
      if (i == index) {
        listArr[i].css('background-color', '').addClass(style + '_selected');
      } else {
        listArr[i].css('background-color', '').removeClass(style + '_selected');
      }
    }
  }
};
