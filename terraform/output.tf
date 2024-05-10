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