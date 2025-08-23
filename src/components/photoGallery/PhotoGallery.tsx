import { createSignal, For } from "solid-js";
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

  const openImage = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <>
      <div class="columns-1 gap-6 md:columns-2 lg:columns-3">
        <For each={props.photos}>
          {(photo, index) => (
            <div class="group relative mb-6 break-inside-avoid overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-103">
              <img
                src={photo.src}
                alt="Photography"
                class="block w-full cursor-pointer object-cover transition-opacity duration-300 group-hover:opacity-90"
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
        <LightboxModal
          photos={props.photos}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  );
}
