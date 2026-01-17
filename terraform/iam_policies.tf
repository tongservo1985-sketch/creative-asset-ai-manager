# IAM Policy for the Backend Service to strictly limit S3 access
resource "aws_iam_policy" "backend_s3_policy" {
  name        = "CreatorAssetAI-Backend-S3-Policy"
  description = "Minimalist permissions for backend to manage assets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:s3:::${var.asset_bucket_name}/*"
      },
      {
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Effect   = "Allow"
        Resource = "${var.kms_key_arn}"
      }
    ]
  })
}