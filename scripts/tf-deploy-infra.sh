#!/bin/bash
echo $(dirname "$0")

cd ../terraform

terraform plan -out eks.tfplan
terraform apply eks.tfplan

region=us-east-1
cluster_name=$(terraform output -raw cluster_name)

aws eks update-kubeconfig --region $region --name $cluster_name
