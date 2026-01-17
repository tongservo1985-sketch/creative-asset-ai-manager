# Infrastructure as Code for Scaling
resource "aws_s3_bucket" "asset_storage" {
  bucket = "creator-asset-ai-storage"
}

resource "aws_sqs_queue" "media_processing_queue" {
  name                      = "media-processing-queue"
  message_retention_seconds = 86400
  visibility_timeout_seconds = 300 # 5 minutes for AI processing
}

resource "aws_lambda_function" "s3_event_handler" {
  function_name = "s3-to-sqs-router"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  
  # Triggered by S3 ObjectCreated events
}

resource "aws_ecs_cluster" "worker_cluster" {
  name = "ai-processing-cluster"
}

# Auto-scaling for Workers based on Queue Depth
resource "aws_appautoscaling_policy" "worker_cpu_policy" {
  name               = "scale-on-queue-depth"
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.worker_cluster.name}/${aws_ecs_service.worker_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}