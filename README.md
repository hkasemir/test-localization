# Test Localization

The purpose of this app is to try out different localization libraries to get a feel for the features and strategies
of several popular methods.


Each library will live in its own branch, at the moment, branches are planned for the following libraries:
- [fluent-react](https://github.com/projectfluent/fluent.js/tree/master/fluent-react)
- [react-intl](https://github.com/yahoo/react-intl)
- [react-i18next](https://github.com/i18next/react-i18next)


## to run locally

```
nvm use // node v8.9.1
npm i
npm start
```

### deploying to github-pages
This app can most likely be viewed on https://hkasemir.github.io/test-localization/

The 'most likely' is in reference to the fact that the default build script from create-react-app builds with an absolute path to `/static` - where the assets on github pages will actually be living on `/test-localization/static`. Until I get around to fixing the build script to do this automatically, the extra path needs to be added manually in the build files... I know it's not pretty, I'll get around to it if it gets that annoying.

```
npm run build

*** in build/ find all `static/` paths and prepend `test-localization/`

npm run deploy
```

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
