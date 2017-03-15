import esriRequest from "esri/request";

import Portal from "esri/portal/Portal";

const portal = new Portal();
portal.authMode = "immediate";

export function loadPortal () {
  return portal.load();
}

export function queryPortalItems () {
  const queryParams = {
    //query: `(type:"Vector Tile Service", owner:"${portal.user.username}") AND NOT typekeywords:"Hosted"`,
    query: `owner:"${portal.user.username}"`,
    sortField: "numViews",
    sortOrder: "desc",
    num: 20
  };
  return portal.queryItems(queryParams);
}
