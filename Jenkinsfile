pipeline {
    agent any
    environment {
        HOME = '.'
    }

    tools {nodejs 'node'}

    stages {
        stage('Install Dependencies') {
          steps {
            sh 'npm install -g yarn'
            sh 'yarn install --network-timeout 500000'
          }
        }

        stage('Enforce Code Standards') {
            steps {
                sh 'yarn lint'
                sh 'yarn ts'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'yarn test'
            }
        }

        stage('Build App') {
            steps {
                sh 'cp .env.beta .env'
                sh 'yarn build'
            }
        }

        stage('Deploy to Firebase') {
            when {
                branch 'release-*'
            }
            steps {
                withCredentials([string(credentialsId: 'firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    sh '''
                    yarn global add firebase-tools
                    firebase deploy --token $FIREBASE_TOKEN --project $FIREBASE_PROJECT
                    '''
                }
            }
        }
    }
}