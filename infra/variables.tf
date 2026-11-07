variable "domain_name" {
  description = "Bare domain the site is served on. www redirects to it."
  type        = string
}

variable "site_bucket_name" {
  description = "Private S3 bucket that holds the built site."
  type        = string
}

variable "alert_email" {
  description = "Where AWS Budgets sends cost alerts."
  type        = string
}

variable "monthly_budget_usd" {
  description = "Monthly spend that triggers an alert. Covers the whole account, not just this site."
  type        = number
  default     = 3
}
