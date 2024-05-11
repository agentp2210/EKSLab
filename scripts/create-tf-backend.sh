#!/bin/bash
echo $(dirname "$0")

read -p "AWS_ACCESS_KEY_ID: " key_id
read -p "AWS_SECRET_ACCESS_KEY: " secret

region=us-east-1
# log in
export AWS_ACCESS_KEY_ID=$key_id
export AWS_SECRET_ACCESS_KEY=$secret
export AWS_DEFAULT_REGION=$region

# Create S3 bucket for TF Backend
aws s3api create-bucket \
    --bucket tfstate$RANDOM \
    --region $region

# DynamoDB
aws dynamodb create-table \
    --table-name TFBackendDynamoDBTable \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --tags Key=Project,Value=Terraform

bucket=$(aws s3api list-buckets --query "Buckets[].Name" --output text)
table=$(aws dynamodb list-tables --query "TableNames" --output text)

# Use the remote backend in the main configuration
cd ../terraform
if test -d .terraform; then
    rm -rf .terraform
fi

terraform init \
    -backend-config="bucket=$bucket" \
    -backend-config="key=terraform.tfstate" \
    -backend-config="region=$region" \
    -backend-config="dynamodb_table=$table"