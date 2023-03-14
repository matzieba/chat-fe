#! /usr/bin/env node

'use strict';

const path = require('path');
const util = require('util');
const packageJson = require('../package.json');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);

async function runCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error) => {
      console.log('\x1b[31m', error, '\x1b[0m');
    };
  }
}

if (process.argv.length < 3) {
  console.log('\x1b[31m', 'You have to provide name to your app.');
  console.log('For example:');
  console.log('    npx cvt-react-app my-app', '\x1b[0m');
  process.exit(1);
}

const ownPath = process.cwd();
const folderName = process.argv[2];
const projectKey = process.argv[3] || 'cvt';
const appPath = path.join(ownPath, folderName);
const repo = 'git@bitbucket.org:cvtime/cookiecutter-react.git';

try {
  fs.mkdirSync(appPath);
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log(
      '\x1b[31m',
      `${folderName} already exist in the current directory, please give it another name.`,
      '\x1b[0m'
    );
  } else {
    console.log(err);
  }
  process.exit(1);
}

async function setup() {
  try {
    console.log('\x1b[33m', 'Downloading the project structure...', '\x1b[0m');
    await runCmd(`git clone --depth 1 ${repo} ${folderName}`);

    process.chdir(appPath);

    console.log('\x1b[34m', 'Installing dependencies...', '\x1b[0m');
    await runCmd('yarn install');
    console.log();

    await runCmd('npx rimraf ./.git');

    fs.rmdirSync(path.join(appPath, 'bin'), { recursive: true });
    fs.unlinkSync(path.join(appPath, 'package.json'));

    buildPackageJson(packageJson, folderName);
    buildEnvironmentVariable();
    buildEnvironmentVariable('beta');
    buildEnvironmentVariable('prod');
    buildIndexHTML();

    console.log(
      '\x1b[32m',
      'The installation is done, this is ready to use !',
      '\x1b[0m'
    );
    console.log();

    console.log('\x1b[34m', 'You can start by typing:');
    console.log(`    cd ${folderName}`);
    console.log('    yarn dev', '\x1b[0m');
    console.log();
    console.log('Check Readme.md for more information');
    console.log();
  } catch (error) {
    console.log(error);
  }
}

setup();

function buildPackageJson(packageJson, folderName) {
  const {
    bin,
    keywords,
    license,
    homepage,
    repository,
    bugs,
    ...newPackage
  } = packageJson;

  Object.assign(newPackage, {
    name: folderName,
    version: '1.0.0',
    description: '',
    author: 'CVT',
  });

  fs.writeFileSync(
    `${process.cwd()}/package.json`,
    JSON.stringify(newPackage, null, 2),
    'utf8'
  );
}

function buildEnvironmentVariable(env) {
  const environment = env || 'beta';

  const fileData = `
EXTEND_ESLINT=true

VITE__CVT_PROJECT_KEY=${projectKey.toUpperCase()}

VITE__CVT_ENV=beta
VITE__CVT_VITE__ROOT_HOSTNAME=${projectKey}-${environment}.web.app
VITE__CVT_VITE__BASE_URL=https://${projectKey}-${environment}.web.app

VITE__CVT_API_URL=https://${projectKey}-api-dot-${projectKey}-${environment}.ey.r.appspot.com/${projectKey}-api/v1/api

VITE__CVT_FIREBASE_API_KEY=
VITE__CVT_FIREBASE_AUTH_DOMAIN=${projectKey}-${environment}.firebaseapp.com
VITE__CVT_FIREBASE_DB_URL=https://${projectKey}-${environment}.firebaseio.com
VITE__CVT_FIREBASE_PROJECT_ID=${projectKey}-${environment}
VITE__CVT_FIREBASE_STORAGE_BUCKET=${projectKey}-${environment}.appspot.com
VITE__CVT_FIREBASE_MESSAGING_SENDER_ID=
VITE__CVT_FIREBASE_APP_ID=

VITE__CVT_FIREBASE_MEASUREMENT_ID=
    `
  
  fs.writeFileSync(
    env ? `${process.cwd()}/.env.${environment}` : `${process.cwd()}/.env`,
    fileData,
    'utf8'
  );
}

function buildIndexHTML() {
    const env = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="manifest" href="/manifest.json" />
    <title>${folderName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
    `
  
  fs.writeFileSync(
    `${process.cwd()}/index.html`,
    env,
    'utf8'
  );
}
