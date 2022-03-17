import { connectToDatabase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

export default async (req, res) => {
    if (req.method !== 'PATCH') {
        return;
    }

    const userEmail = req.body.email;
    const newPassword = req.body.newPassword;

    const client = await connectToDatabase();

    const usersCollection = client.db().collection('users');

    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
        res.status(404).json({ err: 'User not found.' });
        client.close();
        return;
    }

    const hashedPassword = await hashPassword(newPassword);

    const result = await usersCollection.updateOne(
        { email: userEmail },
        { $set: { password: hashedPassword } }
    );

    client.close();
    res.status(200).json({ message: 'Password updated!' });

}