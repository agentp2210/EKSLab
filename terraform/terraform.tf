terraform {
  required_version = "~> 1.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    # bucket         = "terraform-backend-terraformbackends3bucket-cbgsm0d5zojc"
    # key            = "testing"
    # region         = "us-east-1"
    # dynamodb_table = "terraform-backend-TerraformBackendDynamoDBTable-1XFKJYQG2G0XY"
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      "Environment" = "dev"
      "Project"     = "Terraform"
    }
  }
}