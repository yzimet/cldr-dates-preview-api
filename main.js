const http = require("http");
const url = require("url");
const express = require("express");
const Globalize = require("globalize");
const cldrDataAll = require("cldr-data").all();

const PORT = 3001;
const dateFormats = [
  {
    name: "full",
    path: "dates/calendars/gregorian/dateFormats/full",
    globalizeParams: { date: "full" }
  },
  {
    name: "long",
    path: "dates/calendars/gregorian/dateFormats/long",
    globalizeParams: { date: "long" }
  },
  {
    name: "medium",
    path: "dates/calendars/gregorian/dateFormats/medium",
    globalizeParams: { date: "medium" }
  },
  {
    name: "short",
    path: "dates/calendars/gregorian/dateFormats/short",
    globalizeParams: { date: "short" }
  }
];
const timeFormats = [
  {
    name: "full",
    path: "dates/calendars/gregorian/timeFormats/full",
    globalizeParams: { time: "full" }
  },
  {
    name: "long",
    path: "dates/calendars/gregorian/timeFormats/long",
    globalizeParams: { time: "long" }
  },
  {
    name: "medium",
    path: "dates/calendars/gregorian/timeFormats/medium",
    globalizeParams: { time: "medium" }
  },
  {
    name: "short",
    path: "dates/calendars/gregorian/timeFormats/short",
    globalizeParams: { time: "short" }
  }
];
const dateTimeFormats = [
  {
    name: "full",
    path: "dates/calendars/gregorian/dateTimeFormats/full",
    globalizeParams: { datetime: "full" }
  },
  {
    name: "long",
    path: "dates/calendars/gregorian/dateTimeFormats/long",
    globalizeParams: { datetime: "long" }
  },
  {
    name: "medium",
    path: "dates/calendars/gregorian/dateTimeFormats/medium",
    globalizeParams: { datetime: "medium" }
  },
  {
    name: "short",
    path: "dates/calendars/gregorian/dateTimeFormats/short",
    globalizeParams: { datetime: "short" }
  }
];
const availableFormats = {
  name: "availableFormats",
  path: "dates/calendars/gregorian/dateTimeFormats/availableFormats"
};

// Before we can use Globalize, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
Globalize.load(cldrDataAll);
Globalize.loadTimeZone(require("iana-tz-data"));

const app = express();
app.use(express.json()); // for parsing application/json

app.get("/api/locales/:locale", (req, res) => {
  const locale = req.params.locale || "en";
  const globalizeInstance = new Globalize(locale);

  // has a date been specified?
  let date;
  if (req.query.datetime) {
    date = new Date(req.query.datetime);
  } else {
    date = new Date();
  }

  res.send({
    metadata: {
      locale: locale
    },
    dateFormats: dateFormats.map(({ name, path, globalizeParams }) => ({
      name,
      path,
      skeleton: globalizeInstance.cldr.main(path),
      value: globalizeInstance.formatDate(date, globalizeParams)
    })),
    timeFormats: timeFormats.map(({ name, path, globalizeParams }) => ({
      name,
      path,
      skeleton: globalizeInstance.cldr.main(path),
      value: globalizeInstance.formatDate(date, globalizeParams)
    })),
    dateTimeFormats: dateTimeFormats.map(({ name, path, globalizeParams }) => ({
      name,
      path,
      skeleton: globalizeInstance.cldr.main(path),
      value: globalizeInstance.formatDate(date, globalizeParams)
    })),
    availableFormats: Object.entries(
      globalizeInstance.cldr.main(availableFormats.path)
    ).map(([key, value]) => {
      let formattedDate;
      let errorMessage;
      try {
        formattedDate = globalizeInstance.formatDate(date, { skeleton: key });
      } catch (err) {
        // E_INVALID_OPTIONS
        errorMessage = err.message;
        formattedDate = null;
      }
      return {
        name: key,
        skeleton: value,
        value: formattedDate,
        errorMessage
      };
    })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
