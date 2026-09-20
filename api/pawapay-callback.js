export default async function handler(req, res) {
    console.log('🔔 CALLBACK RECEIVED:', JSON.stringify(req.body, null, 2));

    // Check if payment was successful
    if (req.body.status === 'COMPLETED') {
        console.log('✅ PAYMENT SUCCESSFUL! Unlock premium access here.');
        // In the future, you would update your database here
    }
    
    // Always tell PawaPay you received the message
    res.status(200).send('OK');
}
