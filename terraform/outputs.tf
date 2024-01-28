output "region" {
  description = "AWS region."
  value       = var.aws.region
}

output "az" {
  description = "AWS availability zone."
  value       = var.aws.az
}

output "mongodb_url" {
  description = "MongoDB Atlas URL."
  value       = mongodbatlas_advanced_cluster.mongodb.connection_strings[0].standard_srv
}

output "mongodb_ip_access" {
  value = mongodbatlas_project_ip_access_list.mongodb.ip_address
}

output "mongodb_user" {
  value = mongodbatlas_database_user.db-user.username
}

output "mongodb_pass" {
  sensitive = true
  value     = mongodbatlas_database_user.db-user.password
}

output "eks_endpoint" {
  description = "EKS control plane endpoint."
  value       = module.eks.cluster_endpoint
}

output "eks_ca" {
  description = "EKS certificate authority data."
  value       = aws_eks_cluster.wegowhere.certificate_authority[0].data
}
