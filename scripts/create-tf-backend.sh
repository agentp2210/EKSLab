#!/bin/bash
cd "$(dirname "$0")"
set -x

aws sts get-caller-identity

region=us-east-1

# Create S3 bucket for TF Backend
aws s3api create-bucket \
    --bucket tfstate$RANDOM \
    --region $region

# DynamoDB
table=$(aws dynamodb list-tables --query "TableNames" --output text)
if [ -z $table ]; then
    aws dynamodb create-table \
        --table-name TFBackendDynamoDBTable \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --tags Key=Project,Value=Terraform >/dev/null
fi

bucket=$(aws s3api list-buckets --query "Buckets[].Name" --output text)
table=$(aws dynamodb list-tables --query "TableNames" --output text)

# Use the remote backend in the main configuration
cd ../terraform

#Remove old TF Backend if exist
if test -d .terraform; then
    rm -rf .terraform
fi

old_tfstate=$(ls | grep *.tfstate*)
if [[ ! -z $old_tfstate ]]; then
    for f in ${old_tfstate[@]}; do
        if [ -f $f ]; then
            rm $f
        fi
    done
fi

if [ -f '.terraform.lock.hcl' ]; then
    rm '.terraform.lock.hcl'
fi

# init new backend
terraform init \
    -backend-config="bucket=$bucket" \
    -backend-config="key=terraform.tfstate" \
    -backend-config="region=$region" \
    -backend-config="dynamodb_table=$table"