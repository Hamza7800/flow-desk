pipeline{
    agent any
    parameters {
    choice(name: 'BUMP', choices: ['patch', 'minor', 'major'],
          description: 'Version bump type (webhook builds use patch)')
    }
    environment {
      REGISTRY = 'localhost:8083' 
      IMAGE    = "${REGISTRY}/flow-desk-app"
      GITHUB_REPO = 'github.com/Hamza7800/flow-desk.git'
      NEXT_PUBLIC_BETTER_AUTH_URL = 'http://localhost:3000'
    }
    stages{
        stage("Bump version"){
             steps {
              script {
                sh '''
                  docker run --rm -i -e BUMP node:24.13.0-slim sh -c '
                    cd /tmp && cat > package.json &&
                    npm version "${BUMP:-patch}" --no-git-tag-version >/dev/null &&
                    cat package.json' < package.json > package.json.new
                  mv package.json.new package.json
                '''
                env.VERSION = sh(returnStdout: true,
                  script: '''grep -m1 '"version"' package.json | cut -d'"' -f4''').trim()
                currentBuild.displayName = "#${BUILD_NUMBER} v${env.VERSION}"
              }
            }
            post{
                always{
                    echo "========BUMP VERSION========"
                }
                success{
                    echo "========Version BUMP successfully========"
                }
                failure{
                    echo "========Version BUMP failed========"
                }
            }
        }
        stage("Build Image"){
          steps {
            script {
              echo 'building the docker image...'
              sh '''
                docker build \
                  --build-arg NEXT_PUBLIC_BETTER_AUTH_URL="$NEXT_PUBLIC_BETTER_AUTH_URL" \
                  --label org.opencontainers.image.version="$VERSION" \
                  --label org.opencontainers.image.revision="$(git rev-parse HEAD)" \
                  -t "$IMAGE:$VERSION" .
               '''
            }
          }
          post{
            always{
                echo "========IMAGE BUILD========"
            }
            success{
                echo "========IMAGE BUILD successfully========"
            }
            failure{
                echo "========IMAGE BUILD failed========"
            }
        }
      }

      stage('Push to Nexus') {
        steps {
          withCredentials([usernamePassword(credentialsId:"nexus-creds", passwordVariable:"NEXUS_PASS", usernameVariable:"NEXUS_USER")]){
            echo "Logging into Nexus..."
            sh '''
              echo "$NEXUS_PASS" | docker login "$REGISTRY" -u "$NEXUS_USER" --password-stdin
              trap 'docker logout "$REGISTRY"' EXIT
              docker push "$IMAGE:$VERSION"
            '''
          }
        }
      }
      stage('Commit version and tag') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-credentials',
          usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
          sh '''
            git config user.name "jenkins-bot"
            git config user.email "jenkins-bot@users.noreply.github.com"
            git add package.json
            git commit -m "chore(release): v$VERSION [ci skip]"
            git tag -a "v$VERSION" -m "Release v$VERSION"
            git push "https://$GH_USER:$GH_TOKEN@github.com/Hamza7800/flow-desk.git" HEAD:main "refs/tags/v$VERSION"
          '''
        }
      }
    }
    }
    post {
    always  { sh 'docker image prune -f || true' }
    success { echo '======== pipeline executed successfully ========' }
    failure { echo '======== pipeline execution failed ========' }
  }
}