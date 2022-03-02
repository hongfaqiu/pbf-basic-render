# Pbf BasicRender

**Pbf BasicRender** is a fork from [maplibre-gl-js](https://github.com/maplibre/maplibre-gl-js).

## Usage

```js
npm install pbf-basic-render --save
yarn add pbf-basic-render
```

```ts
import { BasicRenderer } from "pbf-basic-render";

const workCanv = document.createElement('canvas');

const basicRender = new BasicRenderer({
  canvas: workCanv,
  transformRequest: (url: string) => {
    return {
      url,
      headers: someHeaders
    }
  },
  style: {
    version: 8,
    sources: {
      origin: {
        type: "vector",
        tiles: ['https://api.mapbox.com/v4/mapbox.82pkq93d/{z}/{x}/{y}.vector.pbf?sku=1012RMlsjWj1O&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg'],
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "transparent",
        },
      },
      {
        id: "polygon",
        source: "origin",
        "source-layer": "original",
        type: "fill",
        paint: {
          "fill-color": "#00ffff",
          'fill-outline-color': 'rgba(0,0,0,0.1)',
        }
      }
    ],
  },
});
```

## Introduction

You should also check [Mapbox-vector-tiles-basic-js-renderer](https://github.com/landtechnologies/Mapbox-vector-tiles-basic-js-renderer) for more detail.

## Bugs

- ('text-field') render can't work

## Credit

https://github.com/landtechnologies/Mapbox-vector-tiles-basic-js-renderer

https://github.com/davenquinn/maplibre-gl-js
