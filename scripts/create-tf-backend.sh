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
table=$(aws dynamodb list-tables --query "TableNames" --output text)
if [ -z $table ]; then
    aws dynamodb create-table \
        --table-name TFBackendDynamoDBTable \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --tags Key=Project,Value=Terraform
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