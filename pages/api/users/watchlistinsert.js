import { connectToDatabase } from "../../lib/db";
import { getSession } from "next-auth/react";

export default async (req, res) => {
    if (req.method !== 'POST') {
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ err: 'Not authenticated!' });
        return;
    }

    const userEmail = session.user.email;
    const targetTicker = req.body.ticker;

    const client = await connectToDatabase();

    const watchlistsCollection = client.db().collection('watchlists');

    // Since this is activated by clicking on the button for a particular stock, it means that
    // the watchlist can never be empty or missing the item since you clicked on that item to get here
    // directly remove/filter out the ticker
    const userWatchlist = await watchlistsCollection.findOneAndUpdate(
        { email: userEmail },
        { $addToSet: { watchlist: targetTicker }},
        { returnDocument: 'after' }
    );

    client.close();
    res.status(200).send(userWatchlist);
    
}