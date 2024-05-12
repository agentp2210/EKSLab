Ref: https://github.com/hashicorp/learn-terraform-provision-eks-cluster/blob/main/main.tf
Ref: https://github.com/rivethead42/nodejs-microservices-deploying-scaling/tree/main

*This lab is to create an EKS cluster and deploy a Nodejs app to it*

# About the app
The app is a Nodejs app with 4 microservices and a MongoDB
Container and pod are ephemeral so we will add a persistent storage to it

# Instruction
**Log in**
aws configure

**Create TF backend and init**
./scripts/create-tf-backend.sh

**Create EKS with TF**
./scripts/tf-deploy-infra.sh

**build and push images to ECR**
./scripts/push-to-ecr.sh

**Deploy MongoDB with a persistent storage**
*Note*: We need an "external provisioner" to get our EBS working.
To get the provisioner working, we have to tell our cluster that we want to asoociate an IAM OIDC provider which will alows us to install everything properly

*What is IODC?*
Your cluster has an OpenID Connect (OIDC) issuer URL associated with it. To use AWS Identity and Access Management (IAM) roles for service accounts, an IAM OIDC provider must exist for your cluster's OIDC issuer URL

*To associate IAM OIDC provider to the EKS cluster, use 1 of below 2 ways:*
1. eksctl utils associate-iam-oidc-provider --cluster $cluster_name --approve
2. specify in terraform code in cluster_addon section