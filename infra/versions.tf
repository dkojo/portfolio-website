terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Created by infra/bootstrap. use_lockfile uses S3's native locking, so no DynamoDB table.
  backend "s3" {
    bucket       = "danielkojomegbenu-tfstate"
    key          = "portfolio/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}

# us-east-1 is required for CloudFront's ACM certificate, so the whole stack lives there
provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "portfolio"
      ManagedBy = "terraform"
      Repo      = "dkojo/portfolio-website"
    }
  }
}
