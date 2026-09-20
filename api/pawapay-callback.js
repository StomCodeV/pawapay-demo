module.exports = async (req, res) => {
    // PawaPay sends a POST request with the payment status
    console.log('🔔 CALLBACK RECEIVED:', JSON.stringify(req.body, null, 2));

    if (req.body.status === 'COMPLETED') {
        console.log('✅ PAYMENT SUCCESSFUL! Unlocking access...');
        // Add your database logic here to grant the user access
    }
    
    res.status(200).send('OK');
};