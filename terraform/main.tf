provider "aws" {
  region = "us-west-2"
}

# S3 Bucket for Terraform State
resource "aws_s3_bucket" "terraform_state" {
  bucket = "mbp_app_terraform_bucket"
  acl    = "private"
}

# DynamoDB Table for State Locking
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

# ECR Repository
resource "aws_ecr_repository" "mbp_app_repo" {
  name = "mbp_app"
}

# RDS Instance
resource "aws_db_instance" "mbp_db" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "13.3"
  instance_class       = "db.t2.micro"
  name                 = "mbp_app"
  username             = "mbp_app"
  password             = var.db_password
  parameter_group_name = "default.postgres13"
  skip_final_snapshot  = true

  lifecycle {
    prevent_destroy = true
  }
}

variable "db_password" {
  description = "The password for the database"
  type        = string
  sensitive   = true
}

terraform {
  backend "s3" {
    bucket = "mbp_app_terraform_bucket"
    key    = "path/to/my/key"
    region = "us-west-2"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "mbp_ecs_cluster" {
  name = "mbp_ecs_cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "mbp_app_task" {
  family                   = "mbp_app_task"
  container_definitions    = jsonencode([
    {
      name      = "mbp_app_container"
      image     = "${aws_ecr_repository.app_repo.repository_url}:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
    }
  ])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
}

# ECS Service
resource "aws_ecs_service" "mbp_app_ecs" {
  name            = "mbp_app_ecs"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = ["subnet-12345678"] # Replace with your subnet IDs
    security_groups = ["sg-12345678"]     # Replace with your security group IDs
  }
}