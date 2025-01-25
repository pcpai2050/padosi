import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.HOME_KITCHENS_TABLE_NAME || 'HomeKitchens';

export const lambdaHandler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const scanParams = {
        TableName: tableName
    };

    try {
        const data = await dynamoDb.scan(scanParams).promise();
        console.log('Home kitchens retrieved successfully:', data.Items);
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        console.error('Error retrieving home kitchens:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve home kitchens' })
        };
    }
};