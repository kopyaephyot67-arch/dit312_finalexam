pipeline {
    agent any
    
    triggers {
        pollSCM('H/2 * * * *')  // Poll every 2 minutes
    }
    
    environment {
        BUILD_TAG = "${env.BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
    }
    
    parameters {
        booleanParam(name: 'CLEAN_VOLUMES', defaultValue: true, description: 'Remove volumes on rebuild')
        string(name: 'API_HOST', defaultValue: 'http://192.168.56.1:3001', description: 'API host URL')
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from repository..."
                    checkout scm
                    echo "✅ Code checked out successfully"
                }
            }
        }
        
        stage('Validate Configuration') {
            steps {
                script {
                    echo "🔍 Validating Docker Compose configuration..."
                    sh 'docker compose config'
                    echo "✅ Configuration is valid"
                }
            }
        }
        
        stage('Prepare Environment') {
            steps {
                script {
                    echo "📝 Preparing environment variables..."
                    withCredentials([
                        string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'ROOT_PASS'),
                        string(credentialsId: 'MYSQL_PASSWORD', variable: 'USER_PASS')
                    ]) {
                        sh """
                            cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${ROOT_PASS}
MYSQL_DATABASE=products_db
MYSQL_USER=products_user
MYSQL_PASSWORD=${USER_PASS}
MYSQL_PORT=3306
PHPMYADMIN_PORT=8888
API_PORT=3001
DB_PORT=3306
FRONTEND_PORT=3000
API_HOST=${params.API_HOST}
EOF
                        """
                    }
                    echo "✅ Environment prepared"
                }
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                script {
                    echo "🛑 Stopping old containers..."
                    def cmd = params.CLEAN_VOLUMES ? 'docker compose down -v' : 'docker compose down'
                    sh cmd
                    echo "✅ Old containers stopped"
                }
            }
        }
        
        stage('Build Images') {
            steps {
                script {
                    echo "🏗️ Building Docker images..."
                    sh 'docker compose build --no-cache'
                    echo "✅ Images built successfully"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "🚀 Starting containers..."
                    sh 'docker compose up -d'
                    echo "✅ Containers started"
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo "⏳ Waiting for services to be ready..."
                    sh 'sleep 15'
                    
                    echo "🔍 Checking container status..."
                    sh 'docker compose ps'
                    
                    echo "🏥 Testing API health endpoint..."
                    sh 'timeout 60 bash -c "until curl -f http://localhost:3001/health; do sleep 2; done"'
                    
                    echo "📦 Testing products endpoint..."
                    sh 'curl -f http://localhost:3001/products'
                    
                    echo "✅ All health checks passed!"
                }
            }
        }
    }
    
    post {
        success {
            echo """
            ✅ ============================================
            ✅ DEPLOYMENT SUCCESSFUL!
            ✅ ============================================
            
            🌐 Frontend: http://192.168.56.1:3000
            🔌 API: http://192.168.56.1:3001
            💾 phpMyAdmin: http://192.168.56.1:8888
            
            Build: #${env.BUILD_NUMBER}
            Commit: ${env.GIT_COMMIT_SHORT}
            ============================================
            """
        }
        
        failure {
            echo "❌ Deployment failed! Showing logs..."
            sh 'docker compose logs --tail=50 || true'
        }
        
        always {
            echo "🧹 Cleaning up unused Docker images..."
            sh 'docker image prune -f'
        }
    }
}