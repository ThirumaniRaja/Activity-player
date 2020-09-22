function InteractiveAnimation() {
  /**
   * Variables
   * */

  // this p object has default data.
  var p = {
    __handCursor: true,
    __controlMc01: 'mc_01',
    __actionMc01: ['stop()', 'play()', 'playFromCurrentFrame(false)'],

    __controlMc02: '',
    __actionMc02: ['stop()', 'play()', 'playFromCurrentFrame(false)'],

    __controlMc03: '',
    __actionMc03: ['stop()', 'play()', 'playFromCurrentFrame(false)'],

    __controlMc04: '',
    __actionMc04: ['stop()', 'play()', 'playFromCurrentFrame(false)'],

    __hideMCsOnClick: [],
    __showMCsOnClick: [],

    __hideMCs: [],
    __resetMCs: [],

    __enableOnce: false,
    __enabled: false,
    __enableOnDone: false,

    __groupMcs: []
  };

  var actionCnt = 0;

  // custom variables

  var MouseEvent = {
    MOUSE_UP: 'mouseup',
    MOUSE_OVER: 'mouseover',
    MOUSE_OUT: 'mouseout',
    CLICK: 'mousedown'
  };

  var __btnDiv, __btnDivRef, __targetMc;

  function InteractiveAnimation() {}

  this.init = function(JSONData) {
    updateValuesFromFlash(JSONData);

    // console.log("btnDivRef = ", p.__divBtn)
    __btnDivRef = p.__divBtn;
    __btnDiv = $('#' + __btnDivRef);
    // console.log("__btnDiv = ", __btnDiv)

    if (p.__hideMCs && p.__hideMCs.length > 0) {
      hideMovieClips();
    }
    if (!p.__enabled) {
      updateState('disable');
    } else {
      updateState('normal');
    }

    // Initially button is clicked.
    if (p.__tabContentOpen) {
      $('#' + p.__controlMc01).show();
      updateState('disable');
      removeEventHandler();
    }
  };

  // update local variables with values updated from Flash file.
  function updateValuesFromFlash(data) {
    for (var i in data) {
      p[i] = data[i];
      // console.log(i, " = ", this[i]);
    }
  }
  /**
   * Add event handler to the button
   */
  function addEventHandler() {
    trace('addEventHandler called...');
    __btnDiv
      .unbind(MouseEvent.MOUSE_UP, eventHandler)
      .bind(MouseEvent.MOUSE_UP, eventHandler);
    __btnDiv
      .unbind(MouseEvent.MOUSE_OVER, eventHandler)
      .bind(MouseEvent.MOUSE_OVER, eventHandler);
    __btnDiv
      .unbind(MouseEvent.MOUSE_OUT, eventHandler)
      .bind(MouseEvent.MOUSE_OUT, eventHandler);
    __btnDiv
      .unbind(MouseEvent.CLICK, eventHandler)
      .bind(MouseEvent.CLICK, eventHandler);

    if (p.__enabled && p.__handCursor) {
      // this.useHandCursor = true;
      __btnDiv.css({ cursor: 'pointer' });
    } else {
      // this.useHandCursor = false;
      __btnDiv.css({ cursor: 'default' });
      updateState('disable');
    }
  }

  /**
   * Remove event handler to the button
   */
  function removeEventHandler() {
    __btnDiv.unbind(MouseEvent.MOUSE_UP, eventHandler);
    __btnDiv.unbind(MouseEvent.MOUSE_OVER, eventHandler);
    __btnDiv.unbind(MouseEvent.MOUSE_OUT, eventHandler);
    __btnDiv.unbind(MouseEvent.CLICK, eventHandler);

    __btnDiv.css({ cursor: 'default' });
  }

  this.enableMe = function() {
    updateState('normal');
  };

  /**
   * Event handler method
   * @param	e
   */
  function eventHandler(e) {
    if (!p.__enabled) {
      return;
    }
    var strFrame = '';
    // trace("E.type : " + e.type)
    switch (e.type) {
      case MouseEvent.MOUSE_UP:
        strFrame += 'over';
        break;
      case MouseEvent.MOUSE_OVER:
        strFrame += 'over';
        break;
      case MouseEvent.MOUSE_DOWN:
        strFrame += 'down';
        break;
      case MouseEvent.MOUSE_OUT:
        strFrame += 'normal';
        break;
      case MouseEvent.CLICK:
        strFrame += 'down';
        break;
      default:
        strFrame += 'over';
        break;
    }
    gotoAndStop(__btnDiv, strFrame);

    if (p.__enabled) {
      if (e.type == MouseEvent.CLICK) {
        performActions();
        p.__enabled = false;
        updateState('disable');
        //__btnDiv.useHandCursor = false;
      }
    }
  }

  function gotoAndStop(div, strFrame) {
    switch (strFrame) {
      case 'normal':
        __btnDiv.css({ background: 'url(' + p.__normal + ')' });
        break;
      case 'over':
        __btnDiv.css({ background: 'url(' + p.__over + ')' });
        break;
      case 'down':
        __btnDiv.css({ background: 'url(' + p.__clicked + ')' });
        break;
      case 'disable':
        __btnDiv.css({ background: 'url(' + p.__clicked + ')' });
        break;
    }
  }

  /**
   * Method to call actions attached to the button
   */
  function performActions() {
    /* perform actions */
    for (var i = 1; i <= 4; i++) {
      var val = p['__controlMc0' + i];

      __targetMc = $('#' + val);
      if (p.__effect) {
        runEffect();
      } else {
        __targetMc.show();
      }
      /*
			if(val == __btnDivRef){
				mc = __btnDiv;
			} else {
				mc = $("#"+val);
			}
			
			if(mc.length){
				var action = this["actionMc0" + i];
				for (var j = 0; j < action.length; j++) {
					var str = action[j];
					if (str.substring(str.indexOf("(")+1, (str.lastIndexOf(")"))) != "") {
						var act = str.substring(0, str.indexOf("("))
						var value = str.substring(str.indexOf("(") + 1, (str.lastIndexOf(")")));
						switch (act) {
							case "stop":
								mc.gotoAndStop(value);
								if(enableOnDone){
									mc.addEventListener(Event.ENTER_FRAME, checkAnimation)
								}
							break;
							case "play":
								mc.gotoAndPlay(value);
								if(enableOnDone){
									actionCnt++;
									trace("CNT ++ " + actionCnt)
									mc.addEventListener(Event.ENTER_FRAME, checkAnimation)									
								}
							break;
							case "playFromCurrentFrame":
								if (value == "true") {
									mc.play();
									if(enableOnDone){
										actionCnt++;
										trace("CNT ++ " + actionCnt)
										mc.addEventListener(Event.ENTER_FRAME, checkAnimation)
									}
								}
							break;
						}
					}
				}
			}
			*/
    }

    /* enable once */
    if (p.__enableOnce) {
      trace('Enable once only');
      p.__enabled = false;
      updateState('disable');
    }
    /* hide mc's */
    /*if (p.__hideMCs) {
			hideMovieClips();
		}*/
    /* hide mc's on click */
    if (p.__hideOnClick) {
      hideOnClickMovieClips(__hideMCsOnClick, false);
    }
    /* show mc's on click */
    if (p.__showOnClick) {
      hideOnClickMovieClips(__showMCsOnClick, true);
    }
    /* reset mc's */
    if (p.__resetMCs && p.__resetMCs.length > 0) {
      resetMovieClips();
    }
    /* check group mcs */
    if (p.__groupMcs && p.__groupMcs.length > 0) {
      updateGroupMcs();
    }
  }

  /**
   * Check if the animations are done, then rest the button back to normal state
   * @param	e
   */
  function checkAnimation(e) {
    if (e.currentTarget.currentFrame == e.currentTarget.pFrame) {
      trace(' : ' + actionCnt);
      if (actionCnt > 0) {
        actionCnt--;
      }
      e.currentTarget.removeEventListener(Event.ENTER_FRAME, checkAnimation);
      trace('Complete:' + e.currentTarget.name + ' : ' + actionCnt);
    }
    e.currentTarget.pFrame = e.currentTarget.currentFrame;
    //trace("Prev frame: " + e.currentTarget.pFrame)
    if (actionCnt == 0) {
      e.currentTarget.removeEventListener(Event.ENTER_FRAME, checkAnimation);
      //if (!disabled) {
      trace('Enable');
      //disabled = false;
      updateState('normal');
      //}
    }
  }

  function updateState(p_state) {
    // trace("UPDATE STATE::::::::::::: " + __btnDiv + "  p_str : " + p_state);
    if (p_state == 'disable') {
      p.__enabled = false;
      removeEventHandler();
    } else if (p_state == 'normal') {
      p.__enabled = true;
      addEventHandler();
    } else if (p_state == 'down') {
    }
    gotoAndStop(__btnDiv, p_state);
  }

  /**
   * Hide specified movie clips
   */
  function hideMovieClips() {
    trace('IN ', hideMCs);
    for (var i = 0; i < hideMCs.length; i++) {
      var mc = $('#' + hideMCs[i]);
      mc.hide();
    }
  }

  /**
   * Hide specified movie clips
   */
  function hideOnClickMovieClips(_arr, _val) {
    for (var i = 0; i < _arr.length; i++) {
      if (_arr[i] != 'defaultValue') {
        var mc = $('#' + _arr[i]);
        trace(mc);
        if (_val) {
          mc.show();
        } else {
          mc.hide();
        }
      }
    }
  }

  /**
   * Reset specified movie clips
   */
  function resetMovieClips() {
    for (var i = 0; i < p.__resetMCs.length; i++) {
      var mc = $('#' + p.__resetMCs[i]);
      // gotoAndStop(mc, "normal");
      mc.hide();
    }
  }

  /**
   * Method to update the group mc's (radio group fn)
   */
  function updateGroupMcs() {
    p.__enabled = false;
    updateState('down');
    dispatchCustomEvent();

    /*
		for (var i = 0; i < p.__groupMcs.length; i++) {
			// this.parent[groupMcs[i]].disabled = false;
			// this.parent[groupMcs[i]].updateState("normal");
			// var mc = $("#"+p.__groupMcs[i]);
			// gotoAndStop(mc, "normal");
			
			// HOW TO ENABLE SECOND BTN ? :(
			
		}
		*/
  }

  /***************************************************************************/
  //
  //   Below getter setters are moved to data.json
  //
  /***************************************************************************
	
	function gethandCursor() { 
		return __handCursor;
	}
	
	[Inspectable(name="handCursor",type="Boolean")]
	function sethandCursor(value):void 
	{
		trace("Handcursor")
		__handCursor = value;		
		//init()
	}
	
	function get controlMc01() { 
		return __controlMc01;
	}
	
	[Inspectable(name="01 _Control mc",type="String")]
	function set controlMc01(value):void 
	{
		trace("Control mc 1")
		__controlMc01 = value;
	}
	
	function get actionMc01() { 
		return __actionMc01; 
	}
	
	[Inspectable(name="01 Action mc",defaultValue="stop(),play(),playFromCurrentFrame(false)")]
	function set actionMc01(value):void 
	{
		trace("Action mc 1")
		__actionMc01 = value;
	}
	
	function get controlMc02() { 
		return __controlMc02; 
	}
	
	[Inspectable(name="02 _Control mc",type="String")]
	function set controlMc02(value):void 
	{
		trace("Control mc 2")
		__controlMc02 = value;
	}
	
	function get actionMc02() { 
		return __actionMc02; 
	}
	
	[Inspectable(name="02 Action mc",defaultValue="stop(),play(),playFromCurrentFrame(false)")]
	function set actionMc02(value):void 
	{
		trace("Action mc 2")
		__actionMc02 = value;
	}
	
	function get controlMc03() { 
		return __controlMc03; 
	}
	
	[Inspectable(name="03 _Control mc",type="String")]
	function set controlMc03(value):void 
	{
		trace("Control mc 3")
		__controlMc03 = value;
	}
	
	function get actionMc03() { 
		return __actionMc03; 
	}
	
	[Inspectable(name="03 Action mc",defaultValue="stop(),play(),playFromCurrentFrame(false)")]
	function set actionMc03(value):void 
	{
		trace("Action mc 3")
		__actionMc03 = value;
	}
	
	function get controlMc04() { 
		return __controlMc04; 
	}
	
	[Inspectable(name="04 _Control mc",type="String")]
	function set controlMc04(value):void 
	{
		trace("Control mc 4")
		__controlMc04 = value;
	}
	
	function get actionMc04() { 
		return __actionMc04; 
	}
	
	[Inspectable(name="04 Action mc",defaultValue="stop(),play(),playFromCurrentFrame(false)")]
	function set actionMc04(value):void 
	{
		trace("Action mc 4")
		__actionMc04 = value;
	}
	
	function get hideOnClick() { 
		return __hideMCsOnClick; 
	}
	
	[Inspectable(name="Hide on click",type="Array",defaultValue="defaultValue")]
	function set hideOnClick(value):void 
	{
		trace("Hide on click")
		__hideMCsOnClick = value;
		
	}
	
	function get showOnClick() { 
		return __showMCsOnClick; 
	}
	
	[Inspectable(name="Show on click",type="Array",defaultValue="defaultValue")]
	function set showOnClick(value):void 
	{
		trace("Show on click")
		__showMCsOnClick = value;
		init()
	}
	
	function get hideMCs() { 
		return __hideMCs; 
	}
	
	[Inspectable(name="Hide mc's",type="Array")]
	function set hideMCs(value):void 
	{
		trace("Hide mcs")
		__hideMCs = value;
		
	}
	
	
	function get resetMCs() { 
		return __resetMCs; 
	}
	
	[Inspectable(name="Reset mcs",type="Array")]
	function set resetMCs(value):void 
	{
		trace("Reset mcs")
		__resetMCs = value;
		
	}
	
	function get enableOnce() { 
		return __enableOnce; 
	}
	
	[Inspectable(name="Enable once",type="Boolean",defaultValue=false)]
	function set enableOnce(value):void 
	{
		trace("Enable once")
		__enableOnce = value;
	}
	
	function getdisabled() { 
		return __enabled; 
	}
	
	[Inspectable(name="Disabled",type="Boolean",defaultValue=false)]
	function setdisabled(value):void 
	{
		trace("Disabled")
		__enabled = value;
	}
	
	function get enableOnDone() { 
		return __enableOnDone; 
	}
	
	[Inspectable(name="EnableOnDone",type="Boolean",defaultValue=false)]
	function set enableOnDone(value):void 
	{
		trace("Enable on done")
		__enableOnDone = value;
	}
			
	function get groupMcs() { 
		return __groupMcs;
	}
	
	[Inspectable(name="Group mc's",type="Array")]
	function set groupMcs(value):void 
	{
		trace("groupMcs")
		__groupMcs = value;
	}
	
	***************************************************************************/

  function trace(str) {
    // console.log(str);
  }

  this.addEventListener = function(_evt, _fun) {
    p[_evt] = _fun;
  };

  function dispatchCustomEvent() {
    trace('Dispatching onClick');
    if (p.onClick) {
      p.onClick({ target: this });
    }
  }

  function runEffect() {
    var selectedEffect = p.__effect; // "fade";
    switch (p.__effect) {
      case 'fade':
        __targetMc.effect(selectedEffect, 500); //, callback
        break;
    }
  }

  // callback function to bring a hidden box back
  function callback() {
    /*
		setTimeout(function() {
			__targetMc.removeAttr( "style" ).hide().fadeIn();
		}, 1000 );
		*/
  }
}
