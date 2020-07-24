# Serverless project

## A File upload application using AWS S3, Lambda, SNS, DynamoDB and Serverless Framework
 - The application will allow user to upload image file to S3 bucket.
 - Once the image finished upload, an SNS will trigger one of the Lambda function to save the S3
 Bucket url to dynamoDB. Another Lambda function will create another thumbnail image and save to thumbnail S3 bucket


## Deployment
### Before using AWS services, you need to do aws envoirnment 'aws configure' to setup the environment
```
npm install
sls deploy -v
```