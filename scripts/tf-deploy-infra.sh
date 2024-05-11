#!/bin/bash
cd $(dirname "$0")

cd ../terraform

terraform plan -out eks.tfplan
terraform apply eks.tfplan

region=us-east-1

aws eks --region $(terraform output -raw region) update-kubeconfig \
    --name $(terraform output -raw cluster_name)

