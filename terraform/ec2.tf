resource "aws_key_pair" "key-tf" {
  key_name   = "sshkey1"
  public_key = file(var.ssh_public_key)
}

resource "aws_instance" "bastion1" {
  ami                    = data.aws_ami.amzLinux.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.key-tf.key_name
  subnet_id              = module.vpc.public_subnets[0]
  vpc_security_group_ids = ["${aws_security_group.allow_tls.id}"]
  associate_public_ip_address = true

  tags = {
    Name = "bastion1"
  }
}

