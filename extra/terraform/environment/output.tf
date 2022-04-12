output "gcs_terraform_state_bucket_name" {
  value = google_storage_bucket.tf_state.name
}

output "gcp_gitlab_ci_service_account_email" {
  value = google_service_account.gitlab_ci.email
}
