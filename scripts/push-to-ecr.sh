#!/bin/bash
cd $(dirname "$0")
cd ../terraform

# Login to ECR
region=$(terraform output -raw region)
aws_account_id=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $aws_account_id.dkr.ecr.$region.amazonaws.com

# Remove image if exist
existing_images=$(docker images | grep amazonaws.com | awk '{print $1}')
if [[ ! -z "$existing_images" ]]; then
    for i in $existing_images; do
        docker rmi $i
    done
fi

# Build images
apigw_repo=$(terraform output -raw apigw_repo)
inventory_repo=$(terraform output -raw inventory_repo)
messaging_repo=$(terraform output -raw messaging_repo)
restock_repo=$(terraform output -raw restock_repo)

cd ../code/bevco-api-gateway
docker build -t $apigw_repo:latest .
docker push $apigw_repo:latest

cd ../bevco-inventory
docker build -t $inventory_repo:latest .
docker push $inventory_repo:latest

cd ../bevco-inventory-messaging
docker build -t $messaging_repo:latest .
docker push $messaging_repo:latest

cd ../bevco-restock
docker build -t $restock_repo:latest .
docker push $restock_repo:latest