# Main Asset Storage Bucket
resource "aws_s3_bucket" "assets" {
  bucket = "${var.app_name}-${var.environment}-assets"
}

# Ownership controls and Public Access Block
resource "aws_s3_bucket_ownership_controls" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Lifecycle Rules: Crucial for cost-optimization of high-volume media
resource "aws_s3_bucket_lifecycle_configuration" "assets_lifecycle" {
  bucket = aws_s3_bucket.assets.id

  # Rule 1: Move assets to Intelligent-Tiering after 0 days to manage hot/cold access automatically
  rule {
    id     = "auto-optimize-storage"
    status = "Enabled"

    transition {
      days          = 0
      storage_class = "INTELLIGENT_TIERING"
    }

    # Clean up incomplete multi-part uploads to save costs during failed migrations
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }

  # Rule 2: Archive very old assets to Glacier Instant Retrieval for long-term "Second Brain" storage
  rule {
    id     = "long-term-archival"
    status = "Enabled"

    filter {
      prefix = "archives/"
    }

    transition {
      days          = 90
      storage_class = "GLACIER_IR"
    }
  }
}

# S3 Cross-Origin Resource Sharing (CORS) for direct-to-S3 frontend uploads
resource "aws_s3_bucket_cors_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"] # In production, restrict to your frontend domain
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}