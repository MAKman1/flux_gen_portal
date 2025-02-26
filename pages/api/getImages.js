import { db } from '../../src/db/firebase';

export default async function handler(req, res) {
    try {
        const { lastVisibleId } = req.query; // Get the last visible ID from the query

        let query = db.collection('image_generations')
            .orderBy('timestamp', 'desc')
            .limit(5);

        if (lastVisibleId) {
            // Start after the document with the given ID
            const lastVisibleDoc = await db.collection('image_generations').doc(lastVisibleId).get()
            query = query.startAfter(lastVisibleDoc);
        }

        const snapshot = await query.get();

        const images = [];
        snapshot.forEach(doc => {
            images.push({ id: doc.id, ...doc.data() });
        });


        let newLastVisibleId = null;
        if (images.length > 0) {
            newLastVisibleId = images[images.length - 1].id;
        }


        res.status(200).json({ images, lastVisibleId: newLastVisibleId }); // important: Send back last image document ID too!

    } catch (error) {
        console.error("Firestore error:", error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
}