/// TCE PLAYER ----------------------------------------------
var Player;
var callBackUrl =
  ''; /* This variable would store the call-Back URL for LMS integraton. */
var configData =
  ''; /* This variable would store the content of parameter xml(player config) as a string. */
var gameConfigData = '';
var jsCallBackURL = '';
var hostIp = '127.0.0.1';
var schoolId = 'testing';
var assetxml = '';
var iframe;
var jsPath = '';
var iFrameParam = {
  maxHeight: 610,
  left: 0,
  top: 0
};
var orgId = '';
var clientIp = '';
var targetContainer = '';
var tcePlayerInstanceArr = [];
var resorceData;

function load_TCE_PLAYER_Angular(arg, path, resource) {
  resorceData = resource;
  targetContainer = arg;
  console.log("resource-->>. ",resource)
  //console.log("arg-->>. ",arg)
  //console.log("path-->>. ",path)
  var mimeType = resource.Resource.metaData.mimeType;
  
  if (Player) {
    var navigationController = Player.getNavigationController();
    navigationController.stop();
    Player.sleep();
    loadXml(path, mimeType);
  } else {
    if(mimeType === 'tool'){
      $('#xmlData').text(resorceData);
      configData = resorceData;
      callBackUrl = path;
      jsCallBackURL = resorceData.Resource.fileName;
      var loadIndicationSuccess = new CustomEvent("tcePlayerLoaded", { "detail": "success"  });
      document.dispatchEvent(loadIndicationSuccess);
      instantiatePlayer();
    }else if(mimeType === 'game'){
      loadXml(path, mimeType);
    }
    else if(mimeType === 'tce-link'){
      loadXml(path, mimeType);
    }else{
      loadXml(path, mimeType);
    }
  }
}

// satyajit june 2020
function loadXml(path, mimeType) {
  var loadIndicationFailure = new CustomEvent("tcePlayerLoaded", { "detail": "failed" });
  var ajaxObject = {
    type: 'GET',
    url: path + "asset.xml",
    dataType: 'text',
    success: function(data, status, jqXHR) {
      if (jqXHR.status === 204) {
        document.dispatchEvent(loadIndicationFailure);
        throw new Error('Error Fetching TCE Player Media');
      }
      try {
        $('#xmlData').text(data);
        configData = data;
        console.log("configData--->> ",configData)
        if(mimeType === "game"){
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(data,"text/xml");
          var gameConfigXML = xmlDoc.firstChild.attributes.filenamesrc.value
          loadGameConfigXML(path, gameConfigXML)
        }
        else if(mimeType === "tce-link"){
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(data,"text/xml");
          var tceLinkConfigJSON = xmlDoc.firstChild.attributes.filenamesrc.value
          loadTceLinkJSON(path, tceLinkConfigJSON);
        }
        else{
          var href_url = window.location.href.split('index.html');
          callBackUrl = path;
          if (window.location.href.toLowerCase().match('html')) {
            jsCallBackURL = href_url[0];
          } else {
            jsCallBackURL = window.location.href.split('#');
          }
          instantiatePlayer();
        }
      } catch (error) {
        document.dispatchEvent(loadIndicationFailure);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      document.dispatchEvent(loadIndicationFailure);
      throw new Error(errorThrown);
      console.log("Error loading asset XML.", data);
    }
  };

  var token = sessionStorage.getItem('token');
    if (token) {
      ajaxObject.xhrFields = {
        withCredentials: true
      }
      ajaxObject.headers = {
        Authorization: 'Bearer ' + token
      };
    }
  $.ajax(ajaxObject);
}

// satyajit june 2020 added for tce-link
function loadTceLinkJSON(url, file){
  var path = url + file;
  var jqxhr = $.getJSON(path, function(jsonData) {
    //console.log("orgId--",jsonData.orgId)
    getLinkAssetXML(jsonData.orgId)
  })
  .done(function(jsonData) {})
  .fail(function() {
      console.log('An error occurred while loading JSON file. ' + path);
  });
}

function getLinkAssetXML(orginalAssetID){
  const accessToken = sessionStorage.getItem('token');
  const Http = new XMLHttpRequest();
  const url="/tce-teach-api/1/api/1/serve/asset/"+orginalAssetID+"/path";
  Http.open("GET", url);
  Http.setRequestHeader("Authorization",'Bearer  '+accessToken);
  Http.send();
  Http.onreadystatechange = (e) => {
    const encryptedPath = Http.responseText;
    //console.log("encryptedPath-->> ",encryptedPath);
    if(encryptedPath !== ""){
      loadLinkAssetXML(encryptedPath, orginalAssetID)
    }    
  }
}

function loadLinkAssetXML(encryptedFilePath, orginalAssetID){
  const url = '/tce-repo-api/1/web/1/content/fileservice'
  const path = url + '/' + encryptedFilePath + '/';
  const linkAssetXMLPath = path + orginalAssetID+"/";
  //console.log("FINALLY linkAssetXMLPath-->> ",linkAssetXMLPath)
  loadXml(linkAssetXMLPath, "");
}


// end of --tce-link / satyajit june 2020  



// new addition for game: satyajit june 2020
function loadGameConfigXML(path, fileName){
  var ajaxObject = {
    type: 'GET',
    url: path + fileName,
    dataType: 'text',
    success: function(data, status, jqXHR) {
      if (jqXHR.status === 204) {
        document.dispatchEvent(loadIndicationFailure);
        throw new Error('Error Fetching TCE Player Media');
      }
      try {
        gameConfigData = data;
        var parser = new DOMParser();
        var gameXmlDoc = parser.parseFromString(gameConfigData,"text/xml");
        var gameID = gameXmlDoc.firstChild.attributes.gameTemplateId.value;
        getGameTemplatePath(gameID);
      } catch (error) {
        document.dispatchEvent(loadIndicationFailure);
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      document.dispatchEvent(loadIndicationFailure);
      throw new Error(errorThrown);
      console.log("Error loading asset XML.", data);
    }
  };
  $.ajax(ajaxObject);
}


function getGameTemplatePath(gameID){
    const accessToken = sessionStorage.getItem('token');
    const Http = new XMLHttpRequest();
    const url="/tce-teach-api/1/api/1/serve/game/"+gameID+"/path";
    Http.open("GET", url);
    Http.setRequestHeader("Authorization",'Bearer  '+accessToken);
    Http.send();
    Http.onreadystatechange = (e) => {
      const encryptedPath = Http.responseText;
      if(encryptedPath !== ""){
        loadGameTemplateXML(encryptedPath)
      }      
    }
}

function loadGameTemplateXML(encryptedFilePath){
  const url = '/tce-repo-api/1/web/1/content/fileservice'
  const path = url + '/' + encryptedFilePath + '/';
  const gameTemplateXMLPath = path + 'gametemplate.xml';
  
  if(encryptedFilePath !== ''){
    var ajaxObject = {
      type: 'GET',
      url: gameTemplateXMLPath,
      dataType: 'text',
      success: function(data, status, jqXHR) {
        if (jqXHR.status === 204) {
          document.dispatchEvent(loadIndicationFailure);
          throw new Error('Error Fetching TCE Player Media');
        }
        try {
          var parser = new DOMParser();
          var gameTemplateXmlDoc = parser.parseFromString(data,"text/xml");
          callBackUrl = path;
          jsCallBackURL = gameTemplateXmlDoc.firstChild.attributes.launchfile.value;
          resorceData.gameFileName = jsCallBackURL;
          configData = resorceData;
          var loadIndicationSuccess = new CustomEvent("tcePlayerLoaded", { "detail": "success"  });
          document.dispatchEvent(loadIndicationSuccess);
          instantiatePlayer();
        } catch (error) {
          document.dispatchEvent(loadIndicationFailure);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        document.dispatchEvent(loadIndicationFailure);
        throw new Error(errorThrown);
        console.log("Error loading asset XML.", data);
      }
    };
    $.ajax(ajaxObject);
  }  
}

// ----------------------end of new addition for game: satyajit june 2020

function instantiatePlayer() {
  // console.log("configData-",configData,callBackUrl,jsCallBackURL)
  // console.log("RAJ - CallbackURL-",callBackUrl)
  // callBackUrl= "http://localhost:4200"
  //callBackUrl="http://10.10.0.160:8080/tce_content/content/api/v1/filerangeservice?encryptedPath=%2Fasset%2Ftata%2F1%2FMaths&fileName=A1BB52DE-C8CA-4D12-A348-761129D824A6/"
  jsCallBackURL = jsCallBackURL[0]; // temporary path

  var z = jsCallBackURL.split('/');
  var z1 = z.pop();
  jsCallBackURL = z.join('/');

  var Player = new tcePlayer(
    configData,
    callBackUrl,
    jsCallBackURL + '/assets/tcemedia/external/player-html/',
    { maxHeight: '900px', height: '500px', left: '0px', top: '0px' },
    hostIp,
    schoolId,
    'mdl'
  );
  //console.log("bdsfhjkhdsjkfhk",Player)
  Player.init();
  console.log("Player-",Player)
  tcePlayerInstanceArr.push(Player);
}
function tcePlayerReSize() {
  // http://10.10.0.160:8080/tce_content/content/api/v1/filerangeservice/%2Fasset%2Ftata%2F1%2FMaths/A1BB52DE-C8CA-4D12-A348-761129D824A6/
  $('.myZoomBtn').trigger('click');
}


/// TCE PLAYER ----------------------------------------------
