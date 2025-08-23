import type { Accessor, JSX } from "solid-js";
import type { Photo } from "./PhotoGallery";
import { createSignal, createEffect, onCleanup } from "solid-js";

interface LightboxModalProps {
  photos: Photo[];
  selectedImage: Accessor<number | null>;
  setSelectedImage: (index: number | null) => void;
}

export default function LightboxModal({
  photos,
  selectedImage,
  setSelectedImage,
}: LightboxModalProps) {
  const [isClosing, setIsClosing] = createSignal(false);

  onCleanup(() => {
    document.body.style.overflow = "auto";
  });

  // Keyboard navigation and body scroll lock
  createEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isClosing()) return; // Don't handle keys during closing animation

      switch (e.key) {
        case "Escape":
          closeImage();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevImage();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextImage();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const closeImage = () => {
    if (isClosing()) return; // Prevent multiple close calls during animation
    setIsClosing(true);
    document.body.style.overflow = "auto";

    setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
    }, 200); // Match the animation duration
  };

  const nextImage = () => {
    const current = selectedImage();
    if (current !== null && !isClosing()) {
      setSelectedImage(current < photos.length - 1 ? current + 1 : 0);
    }
  };

  const prevImage = () => {
    const current = selectedImage();
    if (current !== null && !isClosing()) {
      setSelectedImage(current > 0 ? current - 1 : photos.length - 1);
    }
  };

  return (
    <div
      class="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={closeImage}
      style={{
        animation: isClosing()
          ? "fadeOut 0.2s ease-out"
          : "fadeIn 0.2s ease-out",
      }}
    >
      <div class="relative flex h-full w-full items-center justify-center p-4">
        {/* Main image */}
        <img
          src={photos[selectedImage()!].src}
          alt="Photography"
          class="max-h-full max-w-full object-contain transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
          style="max-height: calc(100vh - 4rem);" // Account for padding and UI elements
        />

        {/* Navigation buttons */}
        <Button onClick={prevImage} ariaLabel="Previous image" position="left">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>

        <Button onClick={nextImage} ariaLabel="Next image" position="right">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>

        {/* Close button */}
        <Button onClick={closeImage} ariaLabel="Close" position="close">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>

        {/* Image counter */}
        <div class="bg-opacity-50 absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black px-3 py-1 text-sm text-white">
          {selectedImage()! + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
}

function Button({
  onClick,
  ariaLabel,
  children,
  position,
}: {
  onClick: () => void;
  ariaLabel: string;
  children: JSX.Element;
  position: "left" | "right" | "close";
}) {
  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "absolute left-4 top-1/2 -translate-y-1/2 transform p-3";
      case "right":
        return "absolute right-4 top-1/2 -translate-y-1/2 transform p-3";
      case "close":
        return "absolute top-4 right-4 p-2";
      default:
        return "";
    }
  };

  return (
    <button
      class={`bg-opacity-50 hover:bg-opacity-70 rounded-full bg-black text-white transition-all duration-200 ${getPositionClasses()} cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
