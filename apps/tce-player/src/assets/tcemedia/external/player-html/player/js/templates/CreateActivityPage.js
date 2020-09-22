var CreateActivityPage = function() {
  var myRef = this;
  var p = {
    target: 'body',
    url: '',
    shellModel: null,
    shellNavController: null
  };
  var _path =
    jsPath != ''
      ? window.location.protocol + '//' + window.location.hostname
      : '';
  var domObj;
  //===============================
  this.init = function(_obj) {
    for (var i in _obj) {
      p[i] = _obj[i];
    }
    //
    domObj = new Object();
    //
    $.ajax({
      url: p.url,
      datatType: 'xml',
      success: onSuccess
    });
  };
  //===============================
  function onSuccess(data, textStatus, jqXHR) {
    ////console.log("onSuccess .. ",data);

    drawDivs(data.getElementsByTagName('div')[0], p.target, 'div');

    /* var evt = document.createEvent('Event');
		evt.domObj = domObj;
		evt.initEvent('activityPageReady', true, true);
		document.dispatchEvent(evt); */
    EventBus.dispatch('activityPageReady', this, domObj, myRef);
  }
  //===============================
  function drawDivs(_div, _target, elem) {
    ////console.log("drawDivs .. ",_div,_target,elem);
    var _id;
    var _elem = document.createElement(elem);
    $(_target).append(_elem);

    for (var i = 0; i < _div.attributes.length; i++) {
      //replace bg path with media path

      if (_div.attributes[i].nodeName == 'style') {
        if (_div.attributes[i].nodeValue.indexOf('~#@') != -1) {
          var anotherString = _div.attributes[i].nodeValue.replace(
            /~#@/g,
            _path + p.shellModel.getMediaPath()
          );
          _div.attributes[i].nodeValue = anotherString;
        } else if (_div.attributes[i].nodeValue.indexOf('commonAssets') != -1) {
          var anotherStringCommon = _div.attributes[i].nodeValue.replace(
            /commonAssets/g,
            _path +
              p.shellModel.getServiceObj().getCommonAssetPath() +
              '/commonAssets'
          );
          _div.attributes[i].nodeValue = anotherStringCommon;
        }
      }

      if (_div.attributes[i].nodeName == 'id') {
        _id = _div.attributes[i].nodeValue;
      } else {
        $(_elem).attr(
          _div.attributes[i].nodeName,
          _div.attributes[i].nodeValue
        );
      }
      if (_div.attributes[i].nodeName == 'data') {
        if (p.shellModel.getTextValue(_div.attributes[i].nodeValue)) {
          var _elemChild = document.createElement('div');
          $(_elem).append(_elemChild);
          $(_elemChild).html(
            p.shellModel.getTextValue(_div.attributes[i].nodeValue)
          );
          $(_elemChild).attr('id', _div.attributes[i].nodeValue);
          domObj[_div.attributes[i].nodeValue] = _elemChild;
        }
      }
    }

    // Remove textImage & update actual txt values from pageData.json
    if (_id && _id.indexOf('txt_') != -1) {
      if (p.shellModel.getTextValue(_id)) {
        $(_elem).html(p.shellModel.getTextValue(_id));
      }
    }

    $(_elem).attr('id', _id);
    domObj[_id] = _elem;
    for (var i = 0; i < _div.childNodes.length; i++) {
      if (
        _div.childNodes[i].nodeName == 'div' ||
        _div.childNodes[i].nodeName == 'video' ||
        _div.childNodes[i].nodeName == 'canvas' ||
        _div.childNodes[i].nodeName == 'input'
      ) {
        drawDivs(_div.childNodes[i], _elem, _div.childNodes[i].nodeName);
      }
    }
  }
};
