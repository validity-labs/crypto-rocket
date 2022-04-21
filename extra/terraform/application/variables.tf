# -- GENERAL ------------------------------------

variable "gcp_project" {
  type        = string
  description = "The GCP project."
}

variable "gcp_region" {
  type        = string
  description = "The GCP region, which will be used primarily for hosting resources."
  default     = "europe-west6"
}

variable "gcp_cloud_run_region" {
  type        = string
  description = "The GCP region, which will be used to host cloud run resources."
  default     = "europe-west1"
}


# -- LANDINGPAGE --------------------------------

variable "dapin_ui_image" {
  description = "The url of the web app docker image."
  type        = string
}

variable "dapin_ui_dotenv_file" {
  description = "The path of the dotenv file for the web app application."
  type        = string
  default     = ""
}

variable "dapin_ui_cpu_limit" {
  description = "The value of the property is converted to its millicore value and multiplied by 100. The resulting value is the total amount of CPU time that a container can use every 100ms. A container cannot use more than its share of CPU time during this interval."
  type        = string
  default     = "1000m"
}

variable "dapin_ui_memory_limit" {
  description = "The maximum amout of memory an instance can use. If a Container exceeds its memory limit, it might be terminated."
  type        = string
  default     = "256Mi"
}

variable "dapin_ui_container_concurrency" {
  description = "Container concurrency specifies the maximum allowed in-flight (concurrent) requests per container of the Revision."
  type        = number
  default     = 80
}

variable "dapin_ui_timeout_seconds" {
  description = "Sets the max duration the instance is allowed for responding to a request."
  type        = number
  default     = 300
}

variable "dapin_ui_domain" {
  description = "The domain name of the web app."
  type        = string
}

