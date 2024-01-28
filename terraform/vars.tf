variable "aws" {
  description = "AWS variables."

  type = object({
    region = string
    az     = string
  })

  default = {
    region = "ap-southeast-1"
    az     = "ap-southeast-1a"
  }
}

variable "mongodb" {
  description = "MongoDB Atlas variables."

  type = object({
    org     = string
    project = string
    user    = string
    pass    = string
    db      = string
  })

  default = {
    org     = "wegowhere"
    project = "chat"
    user    = "wegowhere"
    pass    = "wegowhere"
    db      = "wegowhere"
  }
}

variable "rabbitmq" {
  description = "RabbitMQ variables."

  type = object({
    version = string
    user    = string
    pass    = string
  })

  default = {
    version = "3.11.20"
    user    = "wegowhere"
    pass    = "wegowhere"
  }
}

variable "redis" {
  description = "Redis variables."

  type = object({
    user = string
    pass = string
  })

  default = {
    user = "wegowhere"
    pass = "wegowhere"
  }
}

variable "docker" {
  description = "Docker variables."

  type = object({
    registry = string
  })

  default = {
    registry = "wegowhere"
  }
}

variable "eks" {
  description = "EKS variables"

  type = object({
    cluster_name = string
  })

  default = {
    cluster_name = "wegowhere"
  }
}

variable "service" {
  description = "Service variables."

  type = map(
    object({
      host = string
      port = number
    })
  )

  default = {
    "gateway" = {
      host = "services.gateway"
      port = 3000
    }

    "user" = {
      host = "services.user"
      port = 3000
    }

    "auth" = {
      host = "services.auth"
      port = 3000
    }

    "chat" = {
      host = "services.chat"
      port = 3000
    }
  }
}
