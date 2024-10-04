rm -rf backend-source.zip
zip -r backend-source.zip . -x "dist/**/*" -x "node_modules/**/*" -x .env
scp backend-source.zip ec2-user@54.152.229.127:~/sources