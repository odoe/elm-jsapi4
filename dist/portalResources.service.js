define(["exports", "esri/request", "esri/portal/Portal"], function (exports, _request, _Portal) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.loadPortal = loadPortal;
  exports.queryPortalItems = queryPortalItems;

  var _request2 = _interopRequireDefault(_request);

  var _Portal2 = _interopRequireDefault(_Portal);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var portal = new _Portal2.default();
  portal.authMode = "immediate";

  function loadPortal() {
    return portal.load();
  }

  function queryPortalItems() {
    var queryParams = {
      //query: `(type:"Vector Tile Service", owner:"${portal.user.username}") AND NOT typekeywords:"Hosted"`,
      query: "owner:\"" + portal.user.username + "\"",
      sortField: "numViews",
      sortOrder: "desc",
      num: 20
    };
    return portal.queryItems(queryParams);
  }
});
//# sourceMappingURL=portalResources.service.js.map