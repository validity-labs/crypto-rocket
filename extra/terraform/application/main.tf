terraform {
  required_version = "~>1.0.0"

  backend "gcs" {}

  required_providers {
    # https://registry.terraform.io/providers/hashicorp/google/latest
    google = {
      source  = "hashicorp/google"
      version = "3.71.0"
    }

    # https://registry.terraform.io/providers/hashicorp/google-beta/latest
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "3.71.0"
    }
  }
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}

provider "google-beta" {
  project = var.gcp_project
  region  = var.gcp_region
}

# Random Generator
resource "random_string" "suffix" {
  length  = 4
  special = false
  upper   = false
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers"
    ]
  }
}


# -- LANDINGPAGE --------------------------------

module "dotenv_file_parser_ui" {
  source = "git::https://gitlab.com/validitylabs/devops/terraform-modules.git//modules/dotenv-file-parser?ref=v0.1.0"

  files = var.crypto_rocket_ui_dotenv_file != null && fileexists(var.crypto_rocket_ui_dotenv_file) ? [
    abspath(var.crypto_rocket_ui_dotenv_file)
  ] : []

  env_vars = {
    NEXT_PUBLIC_BASE_DOMAIN: "https://${var.crypto_rocket_ui_domain}"
  }
}

resource "google_cloud_run_service" "crypto_rocket_ui" {
  name     = "crypto-rocket-ui-${random_string.suffix.result}"
  project  = var.gcp_project
  location = var.gcp_cloud_run_region

  template {
    spec {
      containers {
        image = var.crypto_rocket_ui_image

        dynamic "env" {
          for_each = module.dotenv_file_parser_ui.env_vars
          content {
            name  = env.key
            value = env.value
          }
        }

        resources {
          limits = {
            cpu    = var.crypto_rocket_ui_cpu_limit
            memory = var.crypto_rocket_ui_memory_limit
          }
        }
      }

      container_concurrency = var.crypto_rocket_ui_container_concurrency
      timeout_seconds       = var.crypto_rocket_ui_timeout_seconds
    }
  }
}

resource "google_cloud_run_service_iam_policy" "crypto_rocket_ui" {
  location = google_cloud_run_service.crypto_rocket_ui.location
  project  = google_cloud_run_service.crypto_rocket_ui.project
  service  = google_cloud_run_service.crypto_rocket_ui.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_domain_mapping" "crypto_rocket_ui" {
  location = google_cloud_run_service.crypto_rocket_ui.location
  name     = var.crypto_rocket_ui_domain

  metadata {
    namespace = var.gcp_project
  }

  spec {
    route_name = google_cloud_run_service.crypto_rocket_ui.name
  }
}

