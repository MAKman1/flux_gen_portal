import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [lastVisibleId, setLastVisibleId] = useState(null);  // ID-based pagination
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/getImages');  // Initial fetch
                const data = await res.json();
                if (res.ok) {
                    setImages(data.images);
                    setLastVisibleId(data.lastVisibleId);
                    setHasMore(data.images.length === 5); // Check for full batch
                } else {
                    console.error("Failed to fetch initial images:", data.error);
                }
            } catch (error) {
                console.error("Error fetching initial images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const loadMoreImages = async () => {
        if (!lastVisibleId || !hasMore || loading) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/getImages?lastVisibleId=${lastVisibleId}`); // Pass lastVisibleId
            const data = await res.json();

            if (res.ok) {
                if (!data.images || data.images.length === 0) {
                    setHasMore(false);
                } else {
                    setImages(prevImages => [...prevImages, ...data.images]);
                    setLastVisibleId(data.lastVisibleId);
                    setHasMore(data.images.length === 5); // Check for full batch
                }

            } else {
                console.error("Failed to fetch more images:", data.error);
                // Consider showing an error message to the user.
            }

        } catch (error) {
            console.error("Error fetching more images:", error);
        } finally {
            setLoading(false);
        }
    };

    // Intersection Observer for infinite scroll - remains largely the same
    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMoreImages();
                }
            },
            { threshold: 0.1 }
        );

        if (loading === false && images.length > 0) {  // ensure it only observes after first page load
            const observedTarget = document.querySelector("#load-more-trigger");  // Observe the new element
            if (observedTarget) {
                observer.current.observe(observedTarget);
            }

        }

        return () => observer.current?.disconnect();
    }, [loading, hasMore, images, lastVisibleId]);  // Re-register observer



    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Image Gallery</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {images.map((image) => (
                    <div key={image.id} style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '75%' }}>
                        <Image
                            src={image.image_url2}
                            alt={`Image ${image.id}`}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>
            {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
            {hasMore && (
                <div id="load-more-trigger" style={{ height: '20px', width: '100%' }}> {/*  trigger element */}
                </div>
            )}
            {!hasMore && <p style={{ textAlign: 'center' }}>No more images to load.</p>}
        </div>
    );
};

export default GalleryPage;