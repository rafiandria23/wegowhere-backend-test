resource "aws_vpc" "wegowhere" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"
}
