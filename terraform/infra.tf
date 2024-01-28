resource "mongodbatlas_project" "mongodb" {
  org_id = var.mongodb.org
  name   = var.mongodb.project
}

resource "mongodbatlas_database_user" "mongodb" {
  project_id = mongodbatlas_project.mongodb.id

  auth_database_name = "admin"

  username = var.mongodb.user
  password = var.mongodb.pass

  roles {
    role_name     = "readWrite"
    database_name = var.mongodb.db
  }
}

resource "mongodbatlas_project_ip_access_list" "mongodb" {
  project_id = mongodbatlas_project.mongodb.id

  ip_address = ""
}

resource "mongodbatlas_advanced_cluster" "mongodb" {
  project_id     = mongodbatlas_project.mongodb.id
  name           = var.mongodb.project
  cluster_type   = "REPLICASET"
  backup_enabled = true

  replication_specs {
    region_configs {
      priority = 1

      electable_specs {
        instance_size = "M0"
        node_count    = 3
      }

      analytics_specs {
        instance_size = "M0"
        node_count    = 1
      }

      provider_name = "AWS"
      region_name   = var.aws.region
    }
  }
}

resource "aws_mq_broker" "rabbitmq" {
  broker_name = "rabbitmq"

  engine_type    = "RabbitMQ"
  engine_version = var.rabbitmq.version

  storage_type       = "ebs"
  host_instance_type = "mq.m5.large"

  security_groups = [aws_security_group.rabbitmq.id]

  user {
    username = var.rabbitmq.user
    password = var.rabbitmq.pass
  }
}

resource "aws_elasticache_user" "redis" {
  user_id   = var.redis.user
  user_name = var.redis.user

  engine = "REDIS"

  access_string = "on ~* +@all"

  authentication_mode {
    type      = "password"
    passwords = [var.redis.pass]
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id = "redis"

  engine          = "redis"
  node_type       = "cache.m4.large"
  num_cache_nodes = 1
}
