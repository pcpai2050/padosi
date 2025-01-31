import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.USERS_TABLE_NAME || 'Users';

export const lambdaHandler = async (event, context) => {
    console.log("PCP in lambdaHandler for Login");
    const requestBody = JSON.parse(event.body);
    const { mobileNumber, otp } = requestBody;

    // Retrieve the user from the DynamoDB table
    const getParams = {
        TableName: tableName,
        Key: {
            phone: mobileNumber
        }
    };

    try {
        const data = await dynamoDb.get(getParams).promise();
        const user = data.Item;

        if (user && user.otp === otp) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Login successful', authToken: 'your-auth-token' })
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid OTP' })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not login' })
        };
    }
};