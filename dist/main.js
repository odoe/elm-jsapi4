define(["esri/identity/OAuthInfo", "esri/kernel", "esri/Map", "esri/WebMap", "esri/views/MapView", "esri/layers/Layer", "./portalResources.service", "./animate"], function (_OAuthInfo, _kernel, _Map, _WebMap, _MapView, _Layer, _portalResources, _animate) {
  "use strict";

  var _OAuthInfo2 = _interopRequireDefault(_OAuthInfo);

  var _kernel2 = _interopRequireDefault(_kernel);

  var _Map2 = _interopRequireDefault(_Map);

  var _WebMap2 = _interopRequireDefault(_WebMap);

  var _MapView2 = _interopRequireDefault(_MapView);

  var _Layer2 = _interopRequireDefault(_Layer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var info = new _OAuthInfo2.default({
    appId: "UYi0AqKPKbDn26bo",
    popup: false
  });

  var cardContainer = document.getElementById("card-container");

  var left = 0;
  function collapse() {
    left = cardContainer.offsetWidth;
    (0, _animate.animate)({
      easing: _animate.inSine,
      onProgress: function onProgress(values) {
        cardContainer.style.left = values.a + "px";
        cardContainer.style.right = -values.a + "px";
      },
      onComplete: function onComplete() {
        cardContainer.style.display = "none";
      },

      from: { a: 0 },
      to: { a: left }
    });
  }

  function expand() {
    cardContainer.style.display = "block";
    (0, _animate.animate)({
      easing: _animate.inSine,
      onProgress: function onProgress(values) {
        cardContainer.style.left = values.a + "px";
        cardContainer.style.right = -values.a + "px";
      },
      onComplete: function onComplete() {},

      from: { a: left },
      to: { a: 0 }
    });
  }

  _kernel2.default.id.registerOAuthInfos([info]);

  var btnBack = document.createElement("div");
  btnBack.classList.add("btn");
  btnBack.innerText = "Back";
  var map = new _Map2.default({ basemap: "dark-gray" });
  var view = void 0;
  var webmap = void 0;

  btnBack.addEventListener("click", function () {
    if (map) {
      map.removeAll();
    }
    if (view) {
      view.map = null;
    }
    expand();
  });

  _kernel2.default.id.getCredential(info.portalUrl).then(_portalResources.loadPortal).then(_portalResources.queryPortalItems).then(function (_ref) {
    var results = _ref.results;

    // load Elm bits here
    var node = document.getElementById("portalDiv");
    var app = Elm.Cards.embed(node);
    results.map(function (x) {
      x.selected = false;
    });
    app.ports.cards.send({ items: results });
    app.ports.selectCard.subscribe(function (_ref2) {
      var id = _ref2.id;

      var foundCard = results.find(function (x) {
        return x.id === id;
      });
      if (!view) {
        view = new _MapView2.default({
          map: map,
          container: "viewDiv"
        });
        view.then(function (_) {
          return view.ui.add(btnBack, "bottom-left");
        });
      }

      if (foundCard.type === "Web Map") {
        webmap = new _WebMap2.default({
          portalItem: {
            id: id
          }
        });
        webmap.load().then(function (_) {
          view.map = webmap;
          view.goTo(webmap.initialViewProperties.viewpoint);
        });
      } else {
        view.map = map;
        _Layer2.default.fromPortalItem({ portalItem: { id: id } }).then(function (layer) {
          map.add(layer);
          layer.then(function (_) {
            return view.goTo(layer.fullExtent);
          });
        });
      }
      collapse();
    });
  }).otherwise(function (error) {
    return console.log("Error logging in", error);
  });
});
//# sourceMappingURL=main.js.map