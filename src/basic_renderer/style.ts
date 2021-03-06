import {StyleSpecification} from '../style-spec/types.g';
import Style, {StyleOptions} from '../style/style';
import {Placement} from '../symbol/placement';
import BasicSourceCache from './source_cache';

export function preprocessStyle(style) {
    if (typeof style !== 'object') return;
    if (!Array.isArray(style.layers)) return;

    // minzoom/maxzoom to minzoom_/maxzoom_
    style.layers.forEach((layer) => {
        if (typeof layer.minzoom === 'number') {
            layer.minzoom_ = layer.minzoom;
            delete layer.minzoom;
        }
        if (typeof layer.maxzoom === 'number') {
            layer.maxzoom_ = layer.maxzoom;
            delete layer.maxzoom;
        }
    });

    // delete raster layer
    style.layers = style.layers.filter((l) => {
        return l.type !== 'raster' && l.type !== 'background';
    });
}

class BasicStyle extends Style {
    loadedPromise: Promise<void>;
    sourceCaches: {[_: string]: any};
    constructor(style: any, map: any, options: StyleOptions = {}) {
        super(map, options);
        this.loadedPromise = new Promise((res) =>
            this.on('style.load', (e) => res())
        );
        this.loadedPromise.then(() => {
            this.placement = new Placement(map.transform, 0, true);
        });
        if (typeof style === 'string') {
            this.loadURL(style);
        } else {
            this.loadJSON(style);
        }
    }

    _load(json: StyleSpecification, validate: boolean) {
        const style = {...json};
        super._load(style, validate);
    }

    // @ts-ignore
    _createSourceCache(id, source) {
        return new BasicSourceCache(id, source, this.dispatcher);
    }
    // setLayers, and all other methods on the super, e.g. setPaintProperty, should be called
    // via loadedPromise.then, not synchrounsouly

    setLayers(visibleLayerNames) {
        // Note this is not part of mapbox style, but handy to put it here for use with pending-style
        return Object.keys(this._layers).map((layerName) =>
            this.setLayoutProperty(
                layerName,
                'visibility',
                visibleLayerNames.includes(layerName) ? 'visible' : 'none'
            )
        );
    }
}

export default BasicStyle;
