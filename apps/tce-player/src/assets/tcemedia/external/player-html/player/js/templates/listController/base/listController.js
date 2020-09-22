var listController = function() {
  var p = {
    actConfig: {},
    fontFamily: 'Myriad Pro',
    fontSize: '20px',
    txtNormalColor: '#326157',
    txtOverColor: '#FFFFFF',
    patchOverColor: '#57AD9B',
    patchNormalColor: 'rgba(0,0,0,0)',
    bigText: false, // show big text on mouseover
    hitAreaClickable: false, // for detect whole patch
    glowEffect: true //  for add glow outside of hit area
  };
  var docRef;
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    p.actConfig = p._shellModel.getActivityConfig().param;
    docRef = p._shellModel.getiFrameRef().contentWindow.document;
    setText();
  };

  function setText() {
    /* for(var i in p.actConfig.tipText){
		 	$(p.domObj[i]).css("display","table").html("<span class='"+i+"_parentSpan'"+"id='"+i+"_parentspanId'"+"style='display: table-cell;vertical-align: middle;'><span class='"+i+"_span'"+"id='"+i+"_spanId'"+"style='cursor:pointer;"+"font-family:"+ p.fontFamily + ";font-size:"+p.fontSize+";color:"+ p.txtNormalColor +"'>"+p.actConfig.tipText[i] +"</span></span>"); 
		}  */
    var _flag = true;
    for (var i in p.actConfig.listText) {
      if (
        p.actConfig.listText[i] == '' ||
        p._shellModel.getTextValue(p.actConfig.listText[i]) == undefined
      ) {
        _flag = false;
      }
    }
    if (_flag) {
      for (var i in p.actConfig.listText) {
        console.log(i);
        $(p.domObj[i])
          .css({
            display: 'table'
          })
          .html(p._shellModel.getTextValue(p.actConfig.listText[i]));
        var _div = $($(p.domObj[i]).find('div')).css({
          display: 'table-cell',
          'vertical-align': 'middle'
        });
        $($(p.domObj[i]).find('span')[0])
          .addClass(i + '_span')
          .attr('id', i)
          .css({ cursor: 'pointer' });
        p.fontSize = parseFloat(
          $($($(p.domObj[i]).find('span')[0])).css('font-size')
        );
      }
    }

    bindEvents();
  }
  function bindEvents() {
    if (p.hitAreaClickable) {
      if (BrowserDetectAdv.anyDevice()) {
        for (var i in p.actConfig.listText) {
          $(p.domObj[i])
            .unbind('click', clkHitArea)
            .bind('click', clkHitArea);
        }
      } else {
        for (var i in p.actConfig.listText) {
          $(p.domObj[i])
            .unbind('mouseover mouseout click', clkHitArea)
            .bind('mouseover mouseout click', clkHitArea)
            .css({ cursor: 'pointer' });
        }
      }
    } else {
      if (BrowserDetectAdv.anyDevice()) {
        for (var i in p.actConfig.listText) {
          $(p.domObj[i])
            .find('.' + i + '_span')
            .unbind('click', clkEvent)
            .bind('click', clkEvent);
        }
      } else {
        for (var i in p.actConfig.listText) {
          $(p.domObj[i])
            .find('.' + i + '_span')
            .unbind('mouseover', clkEvent)
            .bind('mouseover', clkEvent);
        }
      }
    }
  }
  function unbindEvents() {
    if (p.hitAreaClickable) {
      for (var i in p.actConfig.listText) {
        $(p.domObj[i]).unbind('mouseover mouseout click', clkHitArea);
      }
    } else {
      for (var i in p.actConfig.listText) {
        $(p.domObj[i])
          .find('span .' + i + '_span')
          .unbind('mouseover', clkEvent);
        $(p.domObj[i]).unbind('click mouseover mouseleave', parentEvent);
      }
    }
  }
  function clkHitArea(e) {
    if (e.type == 'mouseover') {
      $(this).css({ 'background-color': p.patchOverColor });
      $($(this).find('span')).css('color', p.txtOverColor);
    }
    if (e.type == 'mouseout') {
      $(this).css({ 'background-color': p.patchNormalColor });
      $($(this).find('span')).css('color', p.txtNormalColor);
    }
    if (e.type == 'click') {
      //console.log(e.currentTarget.id , "  :: clicked id")
      unbindEvents();
      loadScreen(e.currentTarget.id);
    }
  }
  function clkEvent(e) {
    if (e.type == 'mouseover') {
      //console.log(e.currentTarget.className)
      var _id = e.currentTarget.className.split('_span')[0];
      $(this).css('color', p.txtOverColor);
      //console.log($(this).css('font-size'))
      //console.log(_id , ":: _id")
      //p.fontSize = parseFloat($(this).css('font-size'));
      if (p.bigText) {
        $(this).css('font-size', p.fontSize + 2);
      }
      $(p.domObj[_id])
        .find('span .' + _id + '_span')
        .unbind('click mouseover', clkEvent);
      $(p.domObj[_id])
        .css({ 'background-color': p.patchOverColor, cursor: 'pointer' })
        .unbind('click mouseover mouseleave', parentEvent)
        .bind('click mouseover mouseleave', parentEvent);
    } else if (e.type == 'click') {
      //loadScreen("tip_" + e.currentTarget.id.split("_")[1]);
      loadScreen(e.currentTarget.id);
    }
  }
  function parentEvent(e) {
    if (e.type == 'mouseover') {
      $(this).css({ 'background-color': p.patchOverColor, cursor: 'pointer' });
    } else if (e.type == 'mouseleave') {
      $(this)
        .css({ 'background-color': p.patchNormalColor, cursor: '' })
        .unbind('click mouseover mouseleave', parentEvent);
      $(p.domObj[e.currentTarget.id])
        .find('.' + e.currentTarget.id + '_span')
        .css({
          color: p.txtNormalColor,
          'font-size': p.fontSize
        })
        .unbind('mouseover', clkEvent)
        .bind('click mouseover', clkEvent);
    } else if (e.type == 'click') {
      console.log('tip clicked', e.currentTarget.id);
      loadScreen(e.currentTarget.id);
    }
  }
  function loadScreen(_scrId) {
    //p._shellModel.setScreenId(Number(p.actConfig.controlObj[_scrId]) - 1);
    //p._navController.loadNextScreen();
    if (p) {
      unbindEvents();
      for (var i in p.domObj) {
        $(p.domObj[i]).remove();
      }
      //p.customBrainRef.unbindListener(p.customBrainRef);
      var _temp = p;
      p._shellModel.setScreenId(Number(p.actConfig.controlObj[_scrId]));
      var screenId = p._shellModel.getCurrentScreenId();
      var mediaType = p._shellModel.getScreenObj()[screenId].mediaType;
      p._navController.getShellController().sliderShow();
      //===============added 4/25/2017 Sagar
      EventBus.dispatch('screenChange', this, _temp._navController);
      //===========================
      p._navController.getShellController().loadScreen(screenId, mediaType);
      p = {};
    }
  }
  this.removeAll = function(e, _btnRef) {
    console.log('inside destroy from List.js');
    if (p) {
      unbindEvents();
      for (var i in p.domObj) {
        $(p.domObj[i]).remove();
      }
      p = {};
    }
  };
};
