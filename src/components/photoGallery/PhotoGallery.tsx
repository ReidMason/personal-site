import { createSignal, createEffect, For } from "solid-js";
import LightboxModal from "./LightboxModal";

export interface Photo {
  filename: string;
  src: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery(props: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = createSignal<number | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  // Keyboard navigation
  createEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const current = selectedImage();
      if (current === null) return;

      switch (e.key) {
        case "Escape":
          setSelectedImage(null);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setSelectedImage(current > 0 ? current - 1 : props.photos.length - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          setSelectedImage(current < props.photos.length - 1 ? current + 1 : 0);
          break;
      }
    };

    if (selectedImage() !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  });

  const openImage = (index: number) => {
    setIsLoading(true);
    setSelectedImage(index);
    // Simulate loading time for smooth transition
    setTimeout(() => setIsLoading(false), 100);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <For each={props.photos}>
          {(photo, index) => (
            <div class="group relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105">
              <img
                src={photo.src}
                alt="Photography"
                class="h-64 w-full cursor-pointer object-cover transition-opacity duration-300 group-hover:opacity-90"
                loading="lazy"
                onClick={() => openImage(index())}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openImage(index());
                  }
                }}
                tabIndex={0}
              />
            </div>
          )}
        </For>
      </div>

      {/* Lightbox Modal */}
      {selectedImage() !== null && (
        <LightboxModal photos={props.photos} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
      )}
    </>
  );
}
