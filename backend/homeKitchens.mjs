import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.HOME_KITCHENS_TABLE_NAME || 'HomeKitchens';

export const lambdaHandler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const requestBody = JSON.parse(event.body);
    const kitchenId = uuidv4();

    const homeKitchen = {
        _id: kitchenId,
        seller_id: requestBody.seller_id,
        apartment: requestBody.apartment,
        name: requestBody.name,
        description: requestBody.description,
        rating: requestBody.rating,
        number_of_ratings: requestBody.number_of_ratings,
        location: requestBody.location,
        created_on: new Date().toISOString()
    };

    const putParams = {
        TableName: tableName,
        Item: homeKitchen
    };

    try {
        await dynamoDb.put(putParams).promise();
        console.log('Home kitchen registered successfully:', homeKitchen);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Home kitchen registered successfully', kitchenId: kitchenId })
        };
    } catch (error) {
        console.error('Error registering home kitchen:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not register home kitchen' })
        };
    }
};