import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.USERS_TABLE_NAME || 'Users';

export const lambdaHandler = async (event, context) => {
    console.log("PCP in lambdaHandler for Register");
    const requestBody = JSON.parse(event.body);
    const userId = uuidv4();

    const user = {
        _id: userId,
        name: requestBody.name,
        email: requestBody.email,
        phone: requestBody.phone,
        apartment: requestBody.apartment,
        flat_number: requestBody.flat_number,
        role: requestBody.role,
        profile_picture_url: requestBody.profile_picture_url,
        registered_on: new Date().toISOString()
    };

    const putParams = {
        TableName: tableName,
        Item: user
    };

    try {
        await dynamoDb.put(putParams).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User registered successfully', userId: userId })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not register user' })
        };
    }
};