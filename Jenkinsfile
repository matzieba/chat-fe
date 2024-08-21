pipeline {
    agent any
//     environment {
//         HOME = '.'
//     }

    tools {nodejs 'node'}
    environment {
            FIREBASE_TOKEN     = credentials('FIREBASE_TOKEN')
            FIREBASE_PROJECT = credentials('FIREBASE_PROJECT')
        }
    stages {
        stage('Install Dependencies') {
          steps {
            sh 'yarn cache clean'
            sh 'npm install -g yarn'
            sh 'yarn install --network-timeout 500000'
          }
        }

//         stage('Enforce Code Standards') {
//             steps {
//                 sh 'yarn lint'
//                 sh 'yarn ts'
//             }
//         }
//
//         stage('Run Unit Tests') {
//             steps {
//                 sh 'yarn test'
//             }
//         }

        stage('Build App') {
            steps {
                sh 'cp .env.beta .env'
                sh 'yarn build'
            }
        }

        stage('Deploy to Firebase') {
            steps {
                withCredentials([string(credentialsId: 'FIREBASE_TOKEN', variable: 'FIREBASE_TOKEN')]) {
                    sh '''
                    firebase deploy --token $FIREBASE_TOKEN --project $FIREBASE_PROJECT
                    '''
                }
            }
        }
    }
}