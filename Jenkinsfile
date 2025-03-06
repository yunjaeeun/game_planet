pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    tools {
        nodejs 'nodejs-22'
    }
    environment {
        DOCKER_IMAGE_FRONT  = "kimgon/meeple_front"
        DOCKER_IMAGE_BACK   = "kimgon/meeple_back"
        DOCKER_IMAGE_NGINX  = "kimgon/nginx"
        REGISTRY            = "registry.hub.docker.com"
        MATTERMOST_WEBHOOK  = credentials('mattermost-webhook')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'release',
                    credentialsId: 'gitlab-token',
                    url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11C109.git'
            }
        }
        stage('Prepare Config') {
            steps {
                withCredentials([
                    file(credentialsId: 'app-config', variable: 'APP_CONFIG'),
                    file(credentialsId: 'vite-config', variable: 'VITE_CONFIG'),
                    file(credentialsId: 'front-env', variable: 'FRONT_ENV')
                ]) {
                    sh 'mkdir -p meeple_back/src/main/resources'
                    sh 'cp $APP_CONFIG meeple_back/src/main/resources/application.yml'

                    // vite-config 파일 복사
                    sh 'cp $VITE_CONFIG meeple_front/vite.config.js'

                    // front 환경 파일 복사
                    sh 'cp $FRONT_ENV meeple_front/.env'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    try {
                        parallel(
                            'Build Frontend': {
                                dir('meeple_front') {
                                    def installStatus = sh(script: 'npm install', returnStatus: true)
                                    if (installStatus != 0) {
                                        error "npm install 실패 (종료코드: ${installStatus})"
                                    }
                                    def buildStatus = sh(script: 'npm run build', returnStatus: true)
                                    if (buildStatus != 0) {
                                        error "npm run build 실패 (종료코드: ${buildStatus})"
                                    }
                                }
                            },
                            'Build Backend': {
                                dir('meeple_back') {
                                    def gradleStatus = sh(script: './gradlew build -x test', returnStatus: true)
                                    if (gradleStatus != 0) {
                                        error "./gradlew build -x test 실패 (종료코드: ${gradleStatus})"
                                    }
                                }
                            }
                        )
                    } catch (err) {
                        echo "빌드 중 에러 발생: ${err}"
                        def message = """
                        빌드 실패 알림:
                        - Job: ${env.JOB_NAME}
                        - 빌드 번호: ${env.BUILD_NUMBER}
                        - URL: ${env.BUILD_URL}
                        - 에러 메시지: ${err}
                        """
                        sh """
                        curl -X POST -H 'Content-Type: application/json' --data '{ "text": "${message}" }' ${MATTERMOST_WEBHOOK}
                        """
                        error "빌드 실패: ${err}"
                    }
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE_FRONT}", "./meeple_front")
                    docker.build("${DOCKER_IMAGE_BACK}", "./meeple_back")
                    docker.build("${DOCKER_IMAGE_NGINX}", "./nginx")
                }
            }
        }
        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_IMAGE_FRONT}").push("latest")
                        docker.image("${DOCKER_IMAGE_BACK}").push("latest")
                        docker.image("${DOCKER_IMAGE_NGINX}").push("latest")
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    docker-compose -p meeple_ci_cd pull
                    docker-compose -p meeple_ci_cd down || true
                    docker-compose -p meeple_ci_cd up -d --remove-orphans
                '''
            }
        }
        stage('Cleanup Docker Images') {
            steps {
                sh '''
                    docker image prune -f
                    docker image prune -a -f --filter "until=48h"
                '''
            }
        }
    }
    post {
        failure {
            echo "빌드 실패! Mattermost에 알림 전송 중..."
            script {
                def message = """
                빌드 실패 알림:
                - Job: ${env.JOB_NAME}
                - 빌드 번호: ${env.BUILD_NUMBER}
                - URL: ${env.BUILD_URL}
                """
                sh """
                curl -X POST -H 'Content-Type: application/json' --data '{ "text": "${message}" }' ${MATTERMOST_WEBHOOK}
                """
            }
        }
        always {
            cleanWs()
        }
    }
}