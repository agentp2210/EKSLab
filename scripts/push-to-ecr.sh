#!/bin/bash
cd $(dirname "$0")
cd ../terraform

repo=$(terraform output -raw repository_url)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $repo

# Remove image if exist
existing_images=$(docker images | grep amazonaws.com | awk '{print $1}')
if [[ ! -z "$existing_images" ]]; then
    for $i in $$existing_images; do
        docker rmi $i
    done
fi