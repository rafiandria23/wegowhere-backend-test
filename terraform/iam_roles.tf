resource "aws_iam_role" "devops" {
  name = "devops"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ""
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = ""
        }
      }
    ]
  })
}
