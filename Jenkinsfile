pipeline {
    agent any
    stages {
        stage("Checkout Code") {
            steps {
                // Clone the repository
                checkout scm
            }
        }
        stage("Install Dependencies") {
            steps {
                script {
                    // Install Node.js dependencies
                    sh 'npm install'
                }
            }
        }
        stage("Build Project") {
            steps {
                script {
                    // Build the Angular project
                    sh 'npm run build -- --output-path=dist/int-sch'
                }
            }
        }
        stage("Deploy to Tomcat") {
            steps {
                script {
                    // Deploy the built project to Tomcat's webapps directory
                    sh 'cp -r dist/int-sch/* /opt/tomcat/webapps/ROOT/'
                }
            }
        }
    }
    post {
        always {
            // Clean up the workspace after the job
            cleanWs()
        }
    }
}
