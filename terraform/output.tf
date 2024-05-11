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

output "repository_url" {
  value = aws_ecr_repository.ecr.repository_url
}