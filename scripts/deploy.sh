#!/usr/bin/env bash
# Upload dist/ to the S3 site bucket with cache headers per file type, then clear CloudFront's cache.
# Run `npm run build` first (with SITE_URL set). Used locally and by the GitHub Actions deploy workflow.
#
#   SITE_BUCKET=danielkojomegbenu-site DISTRIBUTION_ID=E123... scripts/deploy.sh
set -euo pipefail

: "${SITE_BUCKET:?Set SITE_BUCKET to the S3 bucket name}"
: "${DISTRIBUTION_ID:?Set DISTRIBUTION_ID to the CloudFront distribution ID}"

cd "$(dirname "$0")/../dist"
dest="s3://$SITE_BUCKET"
quiet=(--only-show-errors)

# Fingerprinted build output: the file name changes when the content does, so cache for a year
long="public, max-age=31536000, immutable"
aws s3 sync assets "$dest/assets" "${quiet[@]}" --cache-control "$long" --exclude "*.woff2"
aws s3 cp assets "$dest/assets" "${quiet[@]}" --recursive --exclude "*" --include "*.woff2" --cache-control "$long" --content-type font/woff2

# Images, logos, resume: a day in browsers. Content types set explicitly where the CLI's guess varies by OS.
day="public, max-age=86400"
static=(--exclude "assets/*" --exclude "*.html" --exclude "robots.txt" --exclude "sitemap.xml")
aws s3 sync . "$dest" "${quiet[@]}" "${static[@]}" --exclude "*.webp" --exclude "*.svg" --cache-control "$day"
aws s3 cp . "$dest" "${quiet[@]}" --recursive --exclude "*" --include "*.webp" --exclude "assets/*" --cache-control "$day" --content-type image/webp
aws s3 cp . "$dest" "${quiet[@]}" --recursive --exclude "*" --include "*.svg" --exclude "assets/*" --cache-control "$day" --content-type image/svg+xml

# Pages last, so they never reference assets that aren't uploaded yet. Browsers always revalidate;
# CloudFront keeps them for a day, and the invalidation below clears that on every deploy.
page="public, max-age=0, s-maxage=86400, must-revalidate"
aws s3 cp . "$dest" "${quiet[@]}" --recursive --exclude "*" --include "*.html" --cache-control "$page" --content-type "text/html; charset=utf-8"
aws s3 cp . "$dest" "${quiet[@]}" --recursive --exclude "*" --include "robots.txt" --include "sitemap.xml" --exclude "assets/*" --cache-control "$page"

# Remove files that are no longer in the build (size-only, so the uploads above aren't repeated)
aws s3 sync . "$dest" "${quiet[@]}" --delete --size-only

id=$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" --query Invalidation.Id --output text)
echo "Uploaded to $dest and started CloudFront invalidation $id"
