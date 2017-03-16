import OAuthInfo from "esri/identity/OAuthInfo";
import esriKernel from "esri/kernel";

import EsriMap from "esri/Map";
import WebMap from "esri/WebMap";
import MapView from "esri/views/MapView";
import Layer from "esri/layers/Layer";

import { loadPortal, queryPortalItems } from "./portalResources.service";
import { animate, inSine } from "./animate";

const info = new OAuthInfo({
  appId: "zppZ53G093yZV7tG",
  popup: false
});

const cardContainer = document.getElementById("card-container");

let left = 0;
function collapse() {
  left = cardContainer.offsetWidth;
  animate({
    easing: inSine,
    onProgress(values) {
      cardContainer.style.left = values.a + "px";
      cardContainer.style.right = (-values.a) + "px";
    },
    onComplete() {
      cardContainer.style.display = "none";
    },
    from: { a: 0 },
    to: { a: left }
  });
}

function expand() {
  cardContainer.style.display = "block";
  animate({
    easing: inSine,
    onProgress(values) {
      cardContainer.style.left = values.a + "px";
      cardContainer.style.right = (-values.a) + "px";
    },
    onComplete() {},
    from: { a: left },
    to: { a: 0 }
  });
}

esriKernel.id.registerOAuthInfos([info]);

const btnBack = document.createElement("div");
btnBack.classList.add("btn");
btnBack.innerText = "Back";
const map = new EsriMap({ basemap: "dark-gray" });
let view;
let webmap;

btnBack.addEventListener("click", () => {
  if (map) {
    map.removeAll();
  }
  if (view) {
    view.map = null;
  }
  expand();
});

esriKernel.id.getCredential(info.portalUrl)
  .then(loadPortal)
  .then(queryPortalItems)
  .then(({ results }) => {
    // load Elm bits here
    const node = document.getElementById("portalDiv");
    const app = Elm.Cards.embed(node);
    results.map(x => {
      x.selected = false;
    });
    app.ports.cards.send({ items: results });
    app.ports.selectCard.subscribe(({ id }) => {
      const foundCard = results.find(x => x.id === id);
      if (!view) {
        view = new MapView({
          map,
          container: "viewDiv"
        });
        view.then(_ => view.ui.add(btnBack, "bottom-left"));
      }

      if (foundCard.type === "Web Map") {
        webmap = new WebMap({
          portalItem: {
            id: id
          }
        });
        webmap.load().then(_ => {
          view.map = webmap;
          view.goTo(webmap.initialViewProperties.viewpoint);
        });
      }
      else {
        view.map = map;
        Layer.fromPortalItem({ portalItem: { id } }).then(layer => {
          map.add(layer);
          layer.then(_ => view.goTo(layer.fullExtent));
        });
      }
      collapse();
    });
  })
  .otherwise((error) => console.log("Error logging in", error));