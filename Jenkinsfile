pipeline{
    agent any
    parameters {
    choice(name: 'BUMP', choices: ['patch', 'minor', 'major'],
          description: 'Version bump type (webhook builds use patch)')
    }
    environment {
      NEXT_PUBLIC_BETTER_AUTH_URL = 'http://localhost:3000'
    }
    stages{
        stage("Bump version"){
            steps{
                script {
                  def out = sh(returnStdout: true, script: '''
                    docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp \
                    -v "$PWD":/app -w /app node:24.13.0-slim \
                    npm version "${BUMP:-patch}" --no-git-tag-version
                    ''').trim()
                  def version = out.readLines().last().replaceFirst('^v', '')
                  env.VERSION = "$version-${BUILD_NUMBER}"
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
                  -t "localhost:8081/$IMAGE:$VERSION" .
              '''
            }
          }
      }

      stage('Push to Nexus') {
        steps {
          withCredentials([usernamePassword(credentialsId:"nexus-creds", passwordVariable:"PASS", usernameVariable:"USER")]){
            echo "Logging into Nexus..."
            sh 'echo $PASS | docker login localhost:8082 -u $USER --password-stdin'
            echo "Pushing to Nexus..."
            sh 'docker push localhost:8081/$IMAGE:$VERSION'
            sh 'docker logout localhost:8081' 
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
    post{
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}