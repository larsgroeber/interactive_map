# Interactive Map

[![Netlify Status](https://api.netlify.com/api/v1/badges/5da528bb-e5fe-4e45-97e8-79ee6df5cc32/deploy-status)](https://app.netlify.com/sites/riedbergtv-map/deploys)

Interactive map of the campus riedberg for https://riedberg.tv.

## Installation

```
  yarn install
  yarn start  # starts the development server
  yarn build  # build the application inside the dist/ folder
```

## Editing the Map

You can find the SVG file here: `assets/map_cropped.svg`, please open the file in Inkscape and not Illustrator because both handle colors differently.

## Editing path data

Edit the file `pathData.json`, it records the ids of paths inside the SVG which should get animated:
```JS
[
  "Physik",
  "Geozentrum",
  // etc.
]
```

## Getting click event

Get 'pathClicked' event:
```js
  window.addEventListener('pathClicked', event => {
    const id = event.detail.id; // e.g. 'physik'
  })
```
