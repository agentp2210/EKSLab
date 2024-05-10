module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1"

  name = var.project_name
  cidr = var.vpc_cidr_block

  azs             = data.aws_availability_zones.available.names
  public_subnets  = [for i in range(var.public_subnets_count) : cidrsubnet(var.vpc_cidr_block, 8, i)]
  private_subnets = [for i in range(var.private_subnets_count) : cidrsubnet(var.vpc_cidr_block, 8, i + var.public_subnets_count)]

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_dns_hostnames = true
  # one_nat_gateway_per_az = false

  manage_default_security_group = false

  public_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                      = 1
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"             = 1
  }
}

resource "aws_security_group" "allow_tls" {
  name        = "allow_tls"
  description = "Allow TLS inbound traffic"
  vpc_id      = module.vpc.vpc_id
  dynamic "ingress" {
    for_each = [22,80,8080,443]
    iterator = port
    content {
      description = "TLS from VPC"
      from_port   = port.value
      to_port     = port.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_tls"
  }
}