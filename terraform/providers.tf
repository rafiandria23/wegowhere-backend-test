terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }

    tls = {
      source = "hashicorp/tls"
    }

    mongodbatlas = {
      source = "mongodb/mongodbatlas"
    }

    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
}
