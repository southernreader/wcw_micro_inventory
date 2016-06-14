#!groovy
node {
   // Mark the code checkout 'stage'.....
   stage 'Git Checkout'

   // Get some code from a GitHub repository

   
   checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'PerBuildTag']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '146ff225-d9c5-4466-9ae0-3ff4c646ff30', url: 'https://github.com/snyamars/wcw_micro_inventory.git']]]

   // Get the maven tool.
   // ** NOTE: This 'M3' maven tool must be configured
   // **       in the global configuration.           
   //def mvnHome = tool 'Maven'

   // Mark the code build 'stage'.....
   stage 'Build'
   //set the version
   //sh "${mvnHome}/bin/mvn versions:set -DnewVersion=1.0.${env.BUILD_NUMBER}"
   // Run the maven build.
   
   //sh "${mvnHome}/bin/mvn release:update-versions -DautoVersionSubmodules=true"
   //sh "${mvnHome}/bin/mvn release:prepare"....
  
  stage 'Update Nexus'
  
  //sh "${mvnHome}/bin/mvn clean package deploy"
  
  //sh "${mvnHome}/bin/mvn clean package"
  
   def fileName = "/var/lib/jenkins/workspace/${env.JOB_NAME}/wcw_micro_inventory"
   echo "$fileName"
  def word1 = "warfile=${fileName}"
  echo "${word1}"
  
  //def targetIPAddress = "${targetIPAddress}"
  //echo "${targetIPAddress}"
  
  //def tag_value = "${tag_value}"
  //echo "${tag_value}"
  
  
  def artifactLocation ="/var/lib/jenkins/workspace/${env.JOB_NAME}/node_inventory"
  
  stage 'Git Tagging'
  
  withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: '146ff225-d9c5-4466-9ae0-3ff4c646ff30', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD']]) 
  {
      //sh("git tag -a ${env.BUILD_NUMBER}  -m 'Jenkins'")
      sh("git tag -a inventory_${tag_value}_${env.BUILD_NUMBER}  -m 'Jenkins'")
      sh('git push https://"${GIT_USERNAME}":"${GIT_PASSWORD}"@github.com/snyamars/wcw_micro_inventory.git --tags')
  }
  
stage 'docker build'
  
  //withDockerRegistry([credentialsId: 'f6ab1d37-c2cf-4636-80b9-7745dffd4695', url: 'https://hub.docker.com/r/snyamars007/']) {
    //step([$class: 'DockerBuilderPublisher', cleanImages: true, cleanupWithJenkinsJobDelete: false, dockerFileDirectory: '.', pushOnSuccess: true, tagsString: 'latest'])
   //}

  
  docker.withRegistry('', 'f6ab1d37-c2cf-4636-80b9-7745dffd4695') {
        def pcImg = docker.build('snyamars007/node_inventory')
        pcImg.push();
        //sh ("docker push snyamars007/node_inventory")
  }

  
 
 stage 'notifyKubernetes'
  //sh  "curl -H 'Content-Type: application/json' -X POST -d '{'id': 'wcw-inv','application': 'Warehouse-Application','accesspoint': 'http://172.31.0.233:8080','containers': [{'name': 'mongo', 'replicas': 1, 'cpu': 1100, 'memory': '170M', 'port': 30070}, {'name': 'mongods1', 'replicas': 1, 'cpu': 1100, 'memory': '170M', 'port': 30073}, {'name': 'mongods2', 'replicas': 1, 'cpu': 1100, 'memory': '170M', 'port': 30074},  {'name': 'node', 'replicas': 1, 'cpu': 1100, 'memory': '500M', 'port': 30064, 'image': 'snyamars007/node_inventory'} ]}' http://54.237.219.53:3306/step3"
  sh 'curl -vvv -X POST -d @invFile -H "Content-Type: application/json" http://54.237.219.53:3306/step3'
 
}//end of node
