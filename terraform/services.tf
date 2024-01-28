resource "kubernetes_namespace" "services" {
  metadata {
    name = "services"
  }
}

resource "kubernetes_deployment" "services" {
  for_each = var.service

  metadata {
    name      = each.key
    namespace = kubernetes_namespace.services.metadata.name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = each.key
      }
    }

    template {
      metadata {
        labels = {
          app = each.key
        }
      }

      spec {
        container {
          image = "${var.docker.registry}/${each.service}"
          name  = each.key

          port {
            container_port = each.value.port
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "services" {
  for_each = var.service

  metadata {
    name      = each.key
    namespace = kubernetes_namespace.services.metadata.name
  }

  spec {
    selector = {
      app = each.key
    }

    type = "Service"

    port {
      port        = each.value.port
      target_port = each.value.port
    }
  }
}
