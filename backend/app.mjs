import AWS from 'aws-sdk';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PADOSI_TABLE_NAME || 'PadosiTable';

export const lambdaHandler = async (event, context) => {
    console.log("PCP in lambdaHandler for app");
    // Retrieve the item from the DynamoDB table
    const getParams = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id
        }
    };

    try {
        const data = await dynamoDb.get(getParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve item' })
        };
    }
};