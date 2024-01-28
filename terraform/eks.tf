# module "eks" {
#   source = "terraform-aws-modules/eks/aws"

#   cluster_name = ""

#   vpc_id     = module.vpc.id
#   subnet_ids = module.vpc.private_subnets

#   cluster_endpoint_public_access = true

#   eks_managed_node_group_defaults = {
#     ami_type = "AL2_x86_64"
#   }

#   eks_managed_node_groups = {
#     one = {
#       name = "node-group-1"

#       instance_type = ["t3.small"]

#       min_size     = 1
#       max_size     = 3
#       desired_size = 2
#     }

#     two = {
#       name = "node-group-2"

#       instance_type = ["t3.small"]

#       min_size     = 1
#       max_size     = 2
#       desired_size = 1
#     }
#   }
# }


resource "aws_eks_cluster" "wegowhere" {
  name     = "wegowhere"
  role_arn = aws_iam_role.devops.arn

  vpc_config {
    subnet_ids = []
  }
}
