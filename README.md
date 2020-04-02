# cldr-dates-preview-api

An endpoint that returns formatted date/time strings based on the requested locale and timestamp.

## Usage

```
npm install
node main.js
```

Make a GET request to the `/api/locales` endpoint:

```
http://localhost:3001/api/locales/he?datetime=2020-03-31T14:35:00
```
