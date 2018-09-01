# Intertect
An interactive learning tool for computer architecture

| **Script**        | **Description**                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| remove-demo       | Removes the demo application so you can begin development.                                                                                                 |
| prestart          | Runs automatically before start to display a message.                                                                                                      |
| start             | Runs tests, lints, starts dev webserver, and opens the app in your default browser.                                                                        |
| lint:tools        | Runs ESLint on build related JS files. (eslint-loader lints src files via webpack when `npm start` is run)                                                 |
| clean-dist        | Removes everything from the dist folder.                                                                                                                   |
| remove-dist       | Deletes the dist folder.                                                                                                                                   |
| create-dist       | Creates the dist folder and the necessary subfolders.                                                                                                      |
| prebuild          | Runs automatically before build script (due to naming convention). Cleans dist folder, builds html, and builds sass.                                       |
| build             | Bundles all JavaScript using webpack and writes it to /dist.                                                                                               |
| test              | Runs tests (files ending in .spec.js or .test.js) using Jest and outputs results to the command line. Watches all files so tests are re-run upon save.     |
| test:cover        | Runs tests as described above. Generates a HTML coverage report to ./coverage/index.html                                                                   |
| test:cover:travis | Runs coverage as described above, however sends machine readable lcov data to Coveralls. This should only be used from the travis build!                   |
| analyze-bundle    | Analyzes webpack bundles for production and gives you a breakdown of where modules are used and their sizes via a convenient interactive zoomable treemap. |