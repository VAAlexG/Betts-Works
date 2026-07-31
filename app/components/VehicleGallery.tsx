"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Vehicle } from "@/db/schema";
import { VehicleMedia } from "./VehicleMedia";

type GalleryImage = {
  id: string;
  storageKey: string;
  altText: string;
  width: number | null;
  height: number | null;
};

export function VehicleGallery({ vehicle, images }: { vehicle: Vehicle; images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const isOpen = openIndex !== null;

  function close() {
    setOpenIndex(null);
  }

  function showPrevious() {
    setOpenIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
  }

  function showNext() {
    setOpenIndex((index) => index === null ? null : (index + 1) % images.length);
  }

  function open(index: number) {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpenIndex(index);
  }

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowLeft" && images.length > 1) {
        event.preventDefault();
        setOpenIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
        return;
      }
      if (event.key === "ArrowRight" && images.length > 1) {
        event.preventDefault();
        setOpenIndex((index) => index === null ? null : (index + 1) % images.length);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") || [])];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen, images.length]);

  if (!images.length) {
    return <div className="vehicle-gallery"><div className="vehicle-gallery-main"><VehicleMedia vehicle={vehicle} /></div></div>;
  }

  const activeImage = openIndex === null ? null : images[openIndex];

  return (
    <>
      <div className="vehicle-gallery">
        <div className="vehicle-gallery-main">
          <button className="gallery-image-button" type="button" aria-haspopup="dialog" aria-label={`Enlarge photo 1 of ${images.length}: ${images[0].altText}`} onClick={() => open(0)}>
            <VehicleMedia vehicle={vehicle} image={images[0]} priority />
            <span className="gallery-zoom-hint" aria-hidden="true">＋ Enlarge</span>
          </button>
        </div>
        {images.length > 1 && <div className="vehicle-gallery-thumbs">{images.slice(1).map((image, index) => <button className="gallery-image-button" type="button" key={image.id} aria-haspopup="dialog" aria-label={`Enlarge photo ${index + 2} of ${images.length}: ${image.altText}`} onClick={() => open(index + 1)}><VehicleMedia vehicle={vehicle} image={image} /></button>)}</div>}
      </div>
      {activeImage && (
        <div className="lightbox-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div className="lightbox-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="lightbox-toolbar">
              <div><strong id={titleId}>{vehicle.year} {vehicle.make} {vehicle.model}</strong><span aria-live="polite">Photo {(openIndex ?? 0) + 1} of {images.length}</span></div>
              <button ref={closeRef} className="lightbox-close" type="button" onClick={close} aria-label="Close enlarged photo">×</button>
            </div>
            <div className="lightbox-image"><VehicleMedia vehicle={vehicle} image={activeImage} priority /></div>
            {images.length > 1 && <div className="lightbox-controls"><button type="button" onClick={showPrevious} aria-label="Previous photo">← Previous</button><button type="button" onClick={showNext} aria-label="Next photo">Next →</button></div>}
          </div>
        </div>
      )}
    </>
  );
}
