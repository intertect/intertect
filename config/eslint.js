module.exports = {
  "extends": "airbnb",
  "plugins": [
    "notice",
  ],
  "rules": {
    "notice/notice": ["error",
      {
        "templateFile":"config/copyright.js",
        "onNonMatchingHeader": "report",
      },
    ],
  },
};

