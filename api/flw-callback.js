export default async function handler(req, res) {
    // Flutterwave sends data back in the URL query parameters
    const { status, tx_ref, transaction_id } = req.query;

    console.log("Flutterwave Redirect Received:", { status, tx_ref, transaction_id });

    // Redirect the user back to your homepage with a success or failure message
    if (status === 'successful') {
        res.redirect(302, 'https://pawapay-demo.vercel.app/?payment=success');
    } else {
        res.redirect(302, 'https://pawapay-demo.vercel.app/?payment=failed');
    }
}
