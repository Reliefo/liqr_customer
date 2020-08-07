sudo service docker start
docker build -t liqr_react .
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 020452232211.dkr.ecr.ap-south-1.amazonaws.com
docker tag liqr_react:latest 020452232211.dkr.ecr.ap-south-1.amazonaws.com/liqr_react:latest
docker push 020452232211.dkr.ecr.ap-south-1.amazonaws.com/liqr_react:latest
sudo service docker stop
