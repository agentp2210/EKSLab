output "ec2_ip" {
  value = resource.aws_instance.bastion1.public_ip
}

output "public_subnets" {
  value = module.vpc.public_subnets_cidr_blocks
}

output "private_subnets" {
  value = module.vpc.private_subnets_cidr_blocks
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ids attached to the cluster control plane"
  value       = module.eks.cluster_security_group_id
}

output "region" {
  description = "AWS region"
  value       = var.region
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = module.eks.cluster_name
}

output "repository_urls" {
  value = [
    for repo in aws_ecr_repository.ecr : repo.repository_url
  ]
}

output "inventory_repo" {
  value = aws_ecr_repository.ecr["inventory"].repository_url
}

output "apigw_repo" {
  value = aws_ecr_repository.ecr["api-gateway"].repository_url
}

output "messaging_repo" {
  value = aws_ecr_repository.ecr["inventory-messaging"].repository_url
}

output "restock_repo" {
  value = aws_ecr_repository.ecr["restock"].repository_url
}