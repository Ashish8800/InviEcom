pipeline{
    agent any
    
    environment {
        GITHUB_TOKEN= credentials('gittoken')
        PATH = "$PATH:/usr/bin" // Add the directory where docker-compose is installed
    }
    
    stages{
       //  stage("Clone Code"){
       //      steps{
       //          checkout scm
       //          // echo "Cloning the code"
       //          // git branch: 'main', credentialsId: 'token_ashish', url: 'https://github.com/Ashish8800/InviEcom'
       //      }
            
       //  }

       //   stage("building the frontend code"){
       //      steps{
       //          echo "Building the Image"
       //          sh "cd ${WORKSPACE}/frontend && docker build -t ghcr.io/ashish8800/inviecom-frontend:latest ."
       //      }
                       
       //  } 
       // stage("building the backend code"){
       //      steps{
       //          echo "Building the Image"
       //          sh "cd ${WORKSPACE}/backend && docker build -t ghcr.io/ashish8800/inviecom-backend:latest ."
       //      }
                       
       //  } 
            
        
       //  stage("Push to Docker Hub"){
       //      steps{
       //          echo "Pushing the Image"
       //          sh "export CR_PAT=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"
       //          sh "echo $GITHUB_TOKEN_PSW | docker login ghcr.io -u $GITHUB_TOKEN_USR --password-stdin"
       //          sh "docker push ghcr.io/ashish8800/inviecom-frontend:latest"
       //          sh "docker push ghcr.io/ashish8800/inviecom-backend:latest"
                
       //      }
            
       //  }
        stage("Deploy"){
            steps{
                echo "Deploying the Container"
                sh "docker-compose down --rmi all && docker-compose up -d"
            }
           
        }
        // stage("Remove_deployment"){
        //     steps{
        //         echo "Deploying the Container"
        //         sh "docker-compose down --rmi all"
        //     }
           
        // }        
    }
}
