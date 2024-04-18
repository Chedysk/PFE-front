pipeline {
    agent any
    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'master', credentialsId: 'git-cred', url: 'https://github.com/Chedysk/PFE-Frontend.git'
            }
        }
        stage('Build Angular') {
            steps {
                sh 'npm install --force'
                sh 'npm run build'
            }
        }
        stage('Test Angular') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Sonarqube Analysis - Frontend') {
            steps {
                script {
                    def scannerHome = tool 'scanner'
                    withSonarQubeEnv('sonarserver') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('Build Docker Image - Frontend') {
            steps {
                sh 'docker build -t chedysk/frontend .'
            }
        }
        stage('Push Docker Image - Frontend') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'chedysk-dockerhub') {
                        sh 'docker push chedysk/frontend'
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                ansiblePlaybook installation: 'Ansible', inventory: 'hosts', playbook: 'deploy.yaml', vaultTmpPath: ''
            }
        }
        stage('Notify Slack') {
            steps {
                slackSend channel: '#pfe', color: 'good', message: 'Test and deployment of the frontend completed successfully'
            }
        }
    }
}
