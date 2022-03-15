import { connectToDatabase } from "../../lib/db";
import { getSession } from "next-auth/react";

export default async (req, res) => {

    const session = await getSession({ req });

    // Check if signed in
    if (session) {
        const client = await connectToDatabase();
        const db = client.db();
        const options = {
            projection: { _id: 0, watchlist: 1 }
        };

        const watchlist = await db.collection('watchlists').findOne({ email: session.user.email }, options);

        // If watchlist doesn't exist for user then create one for user
        if (!watchlist) {
            const result = await db.collection('watchlists').insertOne({
                email: session.user.email,
                watchlist: []
            });
            
            const newWatchlist = await db.collection('watchlists').findOne({ email: session.user.email }, options);

            res.status(200).send(newWatchlist);
        } else {
            res.status(200).send(watchlist);
        }

    } else {
        res.status(401).json({ err: "Not authenticated!" });
    }
    
}