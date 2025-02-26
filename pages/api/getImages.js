import { db } from '../../src/db/firebase';

const RESPONSE_OBJ = [{
    "id": "1",
    "error": "SamplerCustomAdvanced.sample() takes 6 positional arguments but 7 were given",
    "height": 1024,
    "image_url": "https://storage.googleapis.com/flux-gen-image-outputs/generated_image_20250226_150505.png",
    "progress": 100,
    "prompt": "Test prompt 2024",
    "sampler_name": "euler",
    "scheduler": "simple",
    "seed": 0,
    "status": "generating",
    "steps": 100,
    "timestamp": "February 26, 2025 at 8:21:20 AM UTC",
    "width": 576
},
{
    "id": "2",
    "error": "SamplerCustomAdvanced.sample() takes 6 positional arguments but 7 were given",
    "height": 1024,
    "image_url": "https://storage.googleapis.com/flux-gen-image-outputs/generated_image_20250226_150505.png",
    "progress": 100,
    "prompt": "Test prompt 2023",
    "sampler_name": "euler",
    "scheduler": "simple",
    "seed": 0,
    "status": "generating",
    "steps": 100,
    "timestamp": "February 26, 2025 at 8:21:20 AM UTC",
    "width": 576
},
{
    "id": "3",
    "error": "SamplerCustomAdvanced.sample() takes 6 positional arguments but 7 were given",
    "height": 1024,
    "image_url": "https://storage.googleapis.com/flux-gen-image-outputs/generated_image_20250226_150505.png",
    "progress": 100,
    "prompt": "Test prompt 2022",
    "sampler_name": "euler",
    "scheduler": "simple",
    "seed": 0,
    "status": "generating",
    "steps": 100,
    "timestamp": "February 26, 2025 at 8:21:20 AM UTC",
    "width": 576
}
]

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

        res.status(200).json({ images: RESPONSE_OBJ, lastVisibleId: "23" });

        // res.status(200).json({ images, lastVisibleId: newLastVisibleId }); // important: Send back last image document ID too!

    } catch (error) {
        console.error("Firestore error:", error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
}