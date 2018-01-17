# Interactive Map

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

Edit the file `pathData.json`, it is composed of a series of smaller Objects:
```JS
{
  // A 'path' object
  "The id of the path (case sensitive!)": {
    "title": "The title of the modal.",
    "titleLink": "The link on the title (optional)",
    "description": "The description for this modal (optional).",
    // You can do one of the two (optional)
    "video": "Video link",
    "video": [
      "One video link",
      "A second video link"
    ] // no trailing comma
  },  // only if there are additional objects following
  "Another id": {
    ...
  }
}

// Example:
{
    "Physik": {
        "title": "Physik Gebäude",
        "titleLink": "https://riedberg.tv",
        "description": "Am Fachbereich Physik der Goethe-Universität...",
        "video": [
            "https://podcast-wiki.physik.uni-frankfurt.de/videos/Kurzinterviews/Petersen/Petersen.mp4",
            "https://podcast-wiki.physik.uni-frankfurt.de/videos/Kurzinterviews/Petersen/Petersen.webm"
        ]
    },
    "Geozentrum": {
        "title": "Geozentrum",
        "titleLink": "https://riedberg.tv",
        "description": "Am Campus Riedberg wurde im Zeitraum November...",
        "video": [
            "https://riedberg.tv//rtv-videos/sonstiges/2016-05-02_Bodenradar-Feldberg_2/Bodenradar-Feldberg_2.mp4",
            "https://riedberg.tv//rtv-videos/sonstiges/2016-05-02_Bodenradar-Feldberg_2/Bodenradar-Feldberg_2.webm"
        ]
    },
    "path9542": {
        "title": "PIxGaumen",
        "titleLink": "https://riedberg.tv",
        "description": "Am Fachbereich Physik der Goethe-Universität...",
        "video": "https://podcast-wiki.physik.uni-frankfurt.de/videos/Kurzinterviews/Petersen/Petersen.mp4"
    }
}
```