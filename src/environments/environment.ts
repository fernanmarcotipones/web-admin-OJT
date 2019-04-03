// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  name: 'STAGING',
  parse: {
    appId: 'api-staging.devlive.org',
    serverURL: 'https://api-staging.devlive.org/parse',
    masterKey: 'CDAA5242-AD73-4920-AEFD-73E7301F1AF5'
  },
  map: {
    api: 'AIzaSyCladERATUrsULtQDPI6Df9mf4vBDxYhAM'
  },
  ga: {
    token: 'UA-120675553-1'
  }
};
