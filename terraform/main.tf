provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

# Create a new VPC
resource "aws_vpc" "mbp_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "mbp_vpc"
  }
}

# Create public subnets
resource "aws_subnet" "mbp_public_subnet_1" {
  vpc_id            = aws_vpc.mbp_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "mbp_public_subnet_1"
  }
}

resource "aws_subnet" "mbp_public_subnet_2" {
  vpc_id            = aws_vpc.mbp_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "mbp_public_subnet_2"
  }
}

# Create private subnets
resource "aws_subnet" "mbp_private_subnet_1" {
  vpc_id            = aws_vpc.mbp_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "mbp_private_subnet_1"
  }
}

resource "aws_subnet" "mbp_private_subnet_2" {
  vpc_id            = aws_vpc.mbp_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "mbp_private_subnet_2"
  }
}

# Create an internet gateway
resource "aws_internet_gateway" "mbp_igw" {
  vpc_id = aws_vpc.mbp_vpc.id
  tags = {
    Name = "mbp_igw"
  }
}

# Create a route table for public subnets
resource "aws_route_table" "mbp_public_rt" {
  vpc_id = aws_vpc.mbp_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.mbp_igw.id
  }
  tags = {
    Name = "mbp_public_rt"
  }
}

# Associate the public route table with the public subnets
resource "aws_route_table_association" "mbp_public_rt_assoc_1" {
  subnet_id      = aws_subnet.mbp_public_subnet_1.id
  route_table_id = aws_route_table.mbp_public_rt.id
}

resource "aws_route_table_association" "mbp_public_rt_assoc_2" {
  subnet_id      = aws_subnet.mbp_public_subnet_2.id
  route_table_id = aws_route_table.mbp_public_rt.id
}

# Create a security group
resource "aws_security_group" "mbp_app_sg" {
  vpc_id      = aws_vpc.mbp_vpc.id
  name        = "mbp_app_sg"
  description = "Allow HTTP traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
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

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs_task_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# RDS Instance
resource "aws_db_instance" "mbp_db" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "13.3"
  instance_class       = "db.t2.micro"
  identifier           = "mbp-app"
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
    bucket = "mbp-app-terraform-bucket"
    key    = "path/to/my/key"
    region = "us-east-1"
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
      image     = "${aws_ecr_repository.mbp_app_repo.repository_url}:latest"
      cpu       = 256
      memory    = 512
    }
  ])
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

# ECS Service
resource "aws_ecs_service" "mbp_app_ecs" {
  name            = "mbp_app_ecs"
  cluster         = aws_ecs_cluster.mbp_ecs_cluster.id
  task_definition = aws_ecs_task_definition.mbp_app_task.arn
  desired_count   = 1
  launch_type     = "EC2"
  load_balancer {
    target_group_arn = aws_lb_target_group.mbp_app_tg.arn
    container_name   = "mbp_app_container"
    container_port   = 80
  }
  depends_on = [aws_lb_listener.mbp_app_listener]
}

# Load Balancer
resource "aws_lb" "mbp_app_lb" {
  name               = "mbp-app-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.mbp_app_sg.id]
  subnets            = [aws_subnet.mbp_public_subnet_1.id, aws_subnet.mbp_public_subnet_2.id]
}

# Load Balancer Target Group
resource "aws_lb_target_group" "mbp_app_tg" {
  name     = "mbp-app-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.mbp_vpc.id
}

# Load Balancer Listener
resource "aws_lb_listener" "mbp_app_listener" {
  load_balancer_arn = aws_lb.mbp_app_lb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.mbp_app_tg.arn
  }
}