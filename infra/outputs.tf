output "name_servers" {
  description = "Set these four as the domain's nameservers at IONOS"
  value       = aws_route53_zone.site.name_servers
}

output "site_bucket" {
  value = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "Needed by the deploy workflow to invalidate the cache"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  value = "https://${var.domain_name}"
}
