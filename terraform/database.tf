# Managed RDS PostgreSQL Instance (Optimized for pgvector)
resource "aws_db_instance" "metadata_db" {
  allocated_storage      = 20
  max_allocated_storage  = 100 # Auto-scaling storage
  engine                 = "postgres"
  engine_version         = "15.4" # Latest stable with pgvector support
  instance_class         = "db.t4g.micro"
  db_name                = "creator_asset_ai"
  username               = "dbadmin"
  password               = "ChooseSecurePassword123!" # Ideally use Secrets Manager
  parameter_group_name   = "default.postgres15"
  skip_final_snapshot    = true
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}

resource "aws_security_group" "db_sg" {
  name        = "${var.app_name}-db-sg"
  description = "Allow DB access from backend services"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # Restricted to internal VPC
  }
}