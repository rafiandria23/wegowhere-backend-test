provider "aws" {
  region = "ap-southeast-1"
}

resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_security_group" "rabbitmq" {
  name        = "rabbitmq"
  description = "Security group for RabbitMQ."

  vpc_id = aws_vpc.default.id

  tags = {
    Name = "infra"
  }

  ingress {
    from_port   = 5672
    to_port     = 5672
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "rabbitmq" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
  subnet_id     = aws_vpc.default.subnet_ids[0]

  tags = {
    Name = "infra"
  }

  security_groups = [aws_security_group.rabbitmq.name]
}

# Define an AWS security group for Redis
resource "aws_security_group" "redis" {
  name        = "redis"
  description = "Security group for Redis"

  vpc_id = aws_vpc.default.id

  tags = {
    Name = "infra"
  }

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Provision Redis instance
resource "aws_instance" "redis" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
  subnet_id     = aws_vpc.default.subnet_ids[0]

  tags = {
    Name = "infra"
  }

  security_groups = [aws_security_group.redis.name]
}

# Define an AWS security group for MongoDB
resource "aws_security_group" "mongodb" {
  name        = "mongodb"
  description = "Security group for MongoDB"

  vpc_id = aws_vpc.default.id

  tags = {
    Name = "infra"
  }

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Provision MongoDB instance
resource "aws_instance" "mongodb" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
  subnet_id     = aws_vpc.default.id

  tags = {
    Name = "infra"
  }

  security_groups = [aws_security_group.mongodb.name]
}
