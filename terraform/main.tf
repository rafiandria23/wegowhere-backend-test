provider "aws" {
  region = var.aws.region
}

provider "kubernetes" {
  host                   = aws_eks_cluster.wegowhere.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.wegowhere.certificate_authority[0].data)
}
