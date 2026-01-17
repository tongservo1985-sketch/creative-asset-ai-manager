# Queue for Ingestion Processing
resource "aws_sqs_queue" "ingestion_queue" {
  name                        = "${var.app_name}-ingestion-queue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = 300 # Match CV Pipeline timeout
}

# Policy to allow S3 to send notifications to SQS
resource "aws_sqs_queue_policy" "ingestion_policy" {
  queue_url = aws_sqs_queue.ingestion_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "sqs:SendMessage"
        Resource  = aws_sqs_queue.ingestion_queue.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" : aws_s3_bucket.assets.arn
          }
        }
      }
    ]
  })
}

# Trigger: When a file is uploaded to the "uploads/" prefix, notify the queue
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.assets.id

  queue {
    queue_arn     = aws_sqs_queue.ingestion_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "uploads/"
  }
}