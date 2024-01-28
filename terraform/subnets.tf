resource "aws_subnet" "wegowhere" {
  vpc_id     = aws_vpc.wegowhere.id
  cidr_block = "10.0.1.0/24"
}
