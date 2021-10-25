import Style from "../style/style";
import Source from "../source/source";
import Placement from "../symbol/placement";
import BasicSourceCache from "./source_cache";

export function preprocessStyle(style) {
  if (typeof style !== "object") return;
  if (!Array.isArray(style.layers)) return;

  // minzoom/maxzoom to minzoom_/maxzoom_
  style.layers.forEach((layer) => {
    if (typeof layer.minzoom === "number") {
      layer.minzoom_ = layer.minzoom;
      delete layer.minzoom;
    }
    if (typeof layer.maxzoom === "number") {
      layer.maxzoom_ = layer.maxzoom;
      delete layer.maxzoom;
    }
  });

  // delete raster layer
  style.layers = style.layers.filter((l) => {
    return l.type !== "raster" && l.type !== "background";
  });
}


class BasicStyle extends Style {
  constructor(stylesheet, map, options) {
    super(map, options);
    this.loadedPromise = new Promise((res) =>
      this.on("data", (e) => e.dataType === "style" && res())
    );
    this.loadedPromise.then(
      () => (this.placement = new Placement(map.transform, 0))
    );
    this.loadJSON(stylesheet);
  }

  addSource(id, source, options) {
    let source_ = Source.create(id, source, this.dispatcher, this);
    source_.setEventedParent(this, { source: source_ });
    source_.map = this.map;
    source_.tiles = source.tiles;
    source_.load();
    this.loadedPromise.then(
      () =>
        new Promise((res) =>
          source_.on("data", (e) => e.dataType === "source" && res())
        )
    );
    this.sourceCaches[id] = new BasicSourceCache(source_);
  }

  // setLayers, and all other methods on the super, e.g. setPaintProperty, should be called
  // via loadedPromise.then, not synchrounsouly

  setLayers(visibleLayerNames) {
    // Note this is not part of mapbox style, but handy to put it here for use with pending-style
    return Object.keys(this._layers).map((layerName) =>
      this.setLayoutProperty(
        layerName,
        "visibility",
        visibleLayerNames.includes(layerName) ? "visible" : "none"
      )
    );
  }
}

export default BasicStyle;
