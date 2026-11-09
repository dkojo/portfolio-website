# contact@danielkojomegbenu.com: inbound mail is forwarded to Gmail by ImprovMX (free plan).
# The alias and its destination are set in the ImprovMX dashboard; these records route mail there.

resource "aws_route53_record" "mx" {
  zone_id = aws_route53_zone.site.zone_id
  name    = var.domain_name
  type    = "MX"
  ttl     = 3600
  records = ["10 mx1.improvmx.com.", "20 mx2.improvmx.com."]
}

# SPF: only ImprovMX may send mail for this domain (it does so when forwarding). Everything else soft-fails.
resource "aws_route53_record" "spf" {
  zone_id = aws_route53_zone.site.zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 3600
  records = ["v=spf1 include:spf.improvmx.com ~all"]
}

# DMARC in monitoring mode: tells receivers how to treat mail that fails SPF, without rejecting anything yet
resource "aws_route53_record" "dmarc" {
  zone_id = aws_route53_zone.site.zone_id
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = 3600
  records = ["v=DMARC1; p=none"]
}
