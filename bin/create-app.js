#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');

const packageJson = require('../package.json');
const exec = util.promisify(require('child_process').exec);

clear();

console.log(
  chalk.yellow(
    figlet.textSync('CVT', { horizontalLayout: 'full' })
  )
);


async function runCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch (error) {
    console.log('\x1b[31m', error, '\x1b[0m');
  }
}

const askProjectDetails = () => {
  const questions = [
    {
      name: 'key',
      type: 'input',
      message: `Enter your project key: ${chalk.yellow(`(${projectKey})`)} `,
    },
    {
      name: 'name',
      type: 'input',
      message: `Enter your project name: ${chalk.yellow(`(${projectName})`)} `,
    },
  ];
  return inquirer.prompt(questions);
};

const askFirebaseDetails = () => {
  const questions = [
    {
      name: 'appId',
      type: 'input',
      message: 'Enter your app id: ',
    },
    {
      name: 'apiKey',
      type: 'input',
      message: 'Enter your api key: ',
    },
    {
      name: 'senderId',
      type: 'input',
      message: 'Enter your sender id: ',
    },
    {
      name: 'measurementId',
      type: 'input',
      message: 'Enter your measurement id: ',
    },
  ];
  return inquirer.prompt(questions);
};

if (process.argv.length < 3) {
  console.log(chalk.red('You have to provide name to your app.'));
  console.log('For example:');
  console.log('npx cvt-react-app my-app');
  process.exit(1);
}

const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = path.join(ownPath, folderName);
const repo = 'git@bitbucket.org:cvtime/chat-fe.git';
let projectKey = 'cvt';
let projectName = 'Cookie Cutter';
let firebaseDetails = {
  apiKey: '',
  appId: '',
  senderId: '',
  measurementId: '',
};


try {
  fs.mkdirSync(appPath);
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log(chalk.red(`${folderName} already exist in the current directory, please give it another name.`));
  } else {
    console.log(err);
  }
  process.exit(1);
}

async function setup() {
  try {
    const { key, name } = await askProjectDetails();

    if (key) {
      projectKey = key;
    }
    
    if (name) {
      projectName = name;
    }
    
    console.log();
    console.log(chalk.yellow('Downloading the project structure...'));
    await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
    
    process.chdir(appPath);
    
    console.log(chalk.yellow('Installing dependencies...'));
    await runCmd('yarn install --silent');
    console.log();

    await runCmd('npx rimraf ./.git');

    fs.rmSync(path.join(appPath, 'bin'), { recursive: true });
    fs.unlinkSync(path.join(appPath, 'package.json'));

    const { shouldAskFirebaseDetails } = await inquirer.prompt({
      name: 'shouldAskFirebaseDetails',
      type: 'confirm',
      message: 'Do you want to add the Firebase details now?: ',
    });

    if (shouldAskFirebaseDetails) {
      firebaseDetails = await askFirebaseDetails();
    }

    buildPackageJson(packageJson, folderName);
    buildEnvironmentVariable();
    buildEnvironmentVariable('beta');
    buildEnvironmentVariable('prod');
    buildIndexHTML();

    console.log();
    console.log(chalk.green('The installation is done, this is ready to use!'));
    console.log();
    
    console.log(chalk.blue('You can start by typing:'));
    console.log(chalk.blue(`    cd ${folderName}`));
    console.log(chalk.blue('    yarn dev', '\x1b[0m'));
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
    dependencies,
    ...newPackage
  } = packageJson;

  delete dependencies['chalk'];
  delete dependencies['clear'];
  delete dependencies['figlet'];
  delete dependencies['inquirer'];
  delete dependencies['rimraf'];

  Object.assign(newPackage, {
    name: folderName,
    version: '1.0.0',
    description: '',
    author: 'CVT',
    dependencies: dependencies,
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

VITE__CVT_FIREBASE_AUTH_DOMAIN=${projectKey}-${environment}.firebaseapp.com
VITE__CVT_FIREBASE_DB_URL=https://${projectKey}-${environment}.firebaseio.com
VITE__CVT_FIREBASE_PROJECT_ID=${projectKey}-${environment}
VITE__CVT_FIREBASE_STORAGE_BUCKET=${projectKey}-${environment}.appspot.com
VITE__CVT_FIREBASE_API_KEY=${firebaseDetails.apiKey}
VITE__CVT_FIREBASE_APP_ID=${firebaseDetails.appId}
VITE__CVT_FIREBASE_MESSAGING_SENDER_ID=${firebaseDetails.senderId}
VITE__CVT_FIREBASE_MEASUREMENT_ID=${firebaseDetails.measurementId}
`;
  
  fs.writeFileSync(
    env ? `${process.cwd()}/.env.${environment}` : `${process.cwd()}/.env`,
    fileData,
    'utf8'
  );
}

function buildIndexHTML() {
  const env = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="manifest" href="/manifest.json" />
    <title>${projectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  
  fs.writeFileSync(
    `${process.cwd()}/index.html`,
    env,
    'utf8'
  );
}
