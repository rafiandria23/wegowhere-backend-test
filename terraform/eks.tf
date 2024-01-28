resource "aws_eks_cluster" "wegowhere" {
  name     = "wegowhere"
  role_arn = aws_iam_role.devops.arn

  vpc_config {
    subnet_ids = [aws_subnet.wegowhere.id]
  }
}
