//const REGION = process.env.REGION;
//const environment = process.env.ENV
//const storageS3BucketName = process.env.STORAGE_S3_BUCKETNAME
//const AWS = require('aws-sdk');
//AWS.config.update({ region: REGION });

const ElasticsearchHostName = process.env.ES_HOST_NAME;
const ElasticsearchPort = process.env.ES_PORT;

const { sendRequest } = require('./request');

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
    try{
        const response = await sendRequest({
            serviceUrl: `http://${ElasticsearchHostName}`,
            httpMethod: 'GET',
            options: { 
                port: ElasticsearchPort
             }
        });
        console.log(JSON.parse(response.body));
        return true;
    } catch(error) {
        console.error(error);
        return false;
    }
}