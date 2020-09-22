/* This is a Global Module and is used to detect different browsers and platforms to hack some functionality.
 */
var BrowserDetect = {
  init: function() {
    this.browser = this.searchString(this.dataBrowser) || 'An unknown browser';
    this.version =
      this.searchVersion(navigator.userAgent) ||
      this.searchVersion(navigator.appVersion) ||
      'an unknown version';
    this.OS = this.searchString(this.dataOS) || 'an unknown OS';
  },
  searchString: function(data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      } else if (dataProp) return data[i].identity;
    }
  },
  searchVersion: function(dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(
      dataString.substring(index + this.versionSearchString.length + 1)
    );
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: 'Chrome',
      identity: 'Chrome'
    },
    {
      string: navigator.userAgent,
      subString: 'OmniWeb',
      versionSearch: 'OmniWeb/',
      identity: 'OmniWeb'
    },
    {
      string: navigator.vendor,
      subString: 'Apple',
      identity: 'Safari',
      versionSearch: 'Version'
    },
    {
      prop: window.opera,
      identity: 'Opera',
      versionSearch: 'Version'
    },
    {
      string: navigator.vendor,
      subString: 'iCab',
      identity: 'iCab'
    },
    {
      string: navigator.vendor,
      subString: 'KDE',
      identity: 'Konqueror'
    },
    {
      string: navigator.userAgent,
      subString: 'Firefox',
      identity: 'Firefox'
    },
    {
      string: navigator.vendor,
      subString: 'Camino',
      identity: 'Camino'
    },
    {
      // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: 'Netscape',
      identity: 'Netscape'
    },
    {
      string: navigator.userAgent,
      subString: 'MSIE',
      identity: 'Explorer',
      versionSearch: 'MSIE'
    },
    {
      string: navigator.userAgent,
      subString: 'Gecko',
      identity: 'Mozilla',
      versionSearch: 'rv'
    },
    {
      // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: 'Mozilla',
      identity: 'Netscape',
      versionSearch: 'Mozilla'
    }
  ],
  dataOS: [
    {
      string: navigator.platform,
      subString: 'Win',
      identity: 'Windows'
    },
    {
      string: navigator.platform,
      subString: 'Mac',
      identity: 'Mac'
    },
    {
      string: navigator.userAgent,
      subString: 'iPhone',
      identity: 'iPhone/iPod'
    },
    {
      string: navigator.platform,
      subString: 'Linux',
      identity: 'Linux'
    }
  ]
};
BrowserDetect.init();
//------------------------------
if (!window.console) {
  console = { log: function() {} };
}

var BrowserDetectAdv = {
  Android: function() {
    return navigator.userAgent.match(/Android/i) ? true : false;
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i) ? true : false;
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
  },
  Windows: function() {
    return navigator.userAgent.match(/Windows/i) ? true : false;
  },
  any: function() {
    return (
      BrowserDetectAdv.Android() ||
      BrowserDetectAdv.BlackBerry() ||
      BrowserDetectAdv.iOS() ||
      BrowserDetectAdv.Windows()
    );
  },
  anyDevice: function() {
    return (
      BrowserDetectAdv.Android() ||
      BrowserDetectAdv.BlackBerry() ||
      BrowserDetectAdv.iOS()
    );
  },
  ie9: function() {
    return navigator.userAgent.match(/MSIE 9.0/i) ? true : false;
  },
  ie10: function() {
    return navigator.userAgent.match(/MSIE 10.0/i) ? true : false;
  },
  ie11: function() {
    var trident = navigator.userAgent.indexOf('Trident/');
    var version = 0;
    if (trident > 0) {
      // IE 11 => return version number
      var rv = navigator.userAgent.indexOf('rv:');
      version = parseInt(
        navigator.userAgent.substring(
          rv + 3,
          navigator.userAgent.indexOf('.', rv)
        ),
        10
      );
    }
    return version == 11 ? true : false;
  },
  Linux: function() {
    return navigator.userAgent.match(/Linux/i) ? true : false;
  },
  Mac: function() {
    return navigator.userAgent.match(/Mac/i) ? true : false;
  }
};
//=======================================
