resource "aws_security_group" "rabbitmq" {
  name   = "rabbitmq"
  vpc_id = aws_vpc
}
