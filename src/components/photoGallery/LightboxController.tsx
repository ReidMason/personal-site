import { createSignal, onMount, onCleanup } from "solid-js";
import LightboxModal from "./LightboxModal";
import type { Photo } from "./PhotoGallery";

interface LightboxControllerProps {
  photos: Photo[];
}

export default function LightboxController(props: LightboxControllerProps) {
  const [selectedImage, setSelectedImage] = createSignal<number | null>(null);

  onMount(() => {
    const handleImageClick = (event: Event) => {
      const target = event.target as HTMLElement;

      // Check if clicked element is a gallery image
      if (target.classList.contains("gallery-image")) {
        const index = parseInt(target.getAttribute("data-index") || "0", 10);
        setSelectedImage(index);
      }
    };

    // Add event listener to the document for event delegation
    document.addEventListener("click", handleImageClick);

    // Cleanup function
    onCleanup(() => {
      document.removeEventListener("click", handleImageClick);
    });
  });

  return (
    <>
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
