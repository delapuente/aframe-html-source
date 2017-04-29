AFRAME.registerComponent('html-src', {
  schema: {
    type: 'selector'
  },
  init: function() {
    this._canvas = document.createElement('CANVAS');
  },
  update: function() {
    var element = this.data;
    if (document.readyState === 'interactive') {
      this._contents(element);
    }
    else {
      document.onreadystatechange = function () {
        if (document.readyState === 'interactive') {
          this._contents(element);
        }
      }.bind(this);
    }
  },
  _contents: function(element, format) {
    var dimensions = this._dimensions(element);
    var svg = this._svg(element, dimensions);
    document.body.appendChild(svg);
    var svgString = new XMLSerializer().serializeToString(svg);
    this._embedResources(svgString).then(function (svgString) {
      var SCALE = 1.0;
      var ratio = dimensions.width / dimensions.height;
      this.el.setAttribute('scale', [ratio * SCALE, SCALE, 0].join(' '));
      this._setSource(svgString);
    }.bind(this));
  },
  _embedResources: function (svgString) {
    var URL_FINDER = /(url\(&quot;)(https?:.+?)(&quot;)/g;
    var urls = getUrls(svgString);
    var tasks = urls.map(objUrl);
    return Promise.all(tasks)
    .then(function (objUrls) {
      var map = {};
      for (var i = 0, l = urls.length; i < l; i++) {
        map[urls[i]] = objUrls[i];
      }
      return map;
    })
    .then(function (replaceMap) {
      return svgString.replace(URL_FINDER, function (_, pre, url, pos) {
        return pre + replaceMap[url] + pos;
      });
    });

    function getUrls(cssText) {
      var uniqueUrls = {};
      while (m = URL_FINDER.exec(cssText)) {
        uniqueUrls[m[2]] = true;
      }
      return Object.keys(uniqueUrls);
    }

    function objUrl(url) {
      return fetch(url)
      .then(function (response) {
        return response.blob();
      })
      .then(function (blob) {
        return new Promise(function (fulfil) {
          var reader = new FileReader();
          reader.onloadend = function () {
            fulfil(reader.result);
          };
          reader.readAsDataURL(blob);
        });
      });
    }
  },
  _setSource: function(svgString) {
    var base64 = btoa(unescape(encodeURIComponent(svgString)));
    this._asset = this._asset || this._makeTextureContainer();
    this._asset.setAttribute(
      'src',
      'data:image/svg+xml;base64,' + base64
    );
    this.el.setAttribute('src', '#' + this._asset.id);
  },
  _makeTextureContainer: function () {
    var assets = this.el.sceneEl.querySelector('a-assets');
    if (!assets) {
      assets = document.createElement('a-assets');
      this.el.sceneEl.appendChild(assets);
    }
    var img = document.createElement('IMG');
    img.id = 'html-src-' + ('' + Math.random()).substr(2);
    assets.appendChild(img);
    return img;
  },
  _dimensions: function(element) {
    return element.getBoundingClientRect();
  },
  _svg: function(element, dimensions) {
    var width = dimensions.width;
    var height = dimensions.height;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    var foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.appendChild(this._copyWithStyle(element));
    svg.appendChild(foreignObject);
    return svg;
  },
  _copyWithStyle: function(element) {
    var copy = element.cloneNode(true);
    copyStyles(copy, element);
    return copy;

    function copyStyles(target, origin) {
      target.setAttribute('style', getComputedStyle(origin).cssText);
      var targetChildren = target.children;
      var originChildren = origin.children;
      for (var i = 0, l = originChildren.length; i < l; i++) {
        copyStyles(targetChildren[i], originChildren[i]);
      }
    }
  },
  _img: function(svgString, dimensions) {
    var base64 = btoa(unescape(encodeURIComponent(svgString)));
    var img = document.createElement('IMG');
    img.src = 'data:image/svg+xml;base64,' + base64;
    return img;
  }
});
