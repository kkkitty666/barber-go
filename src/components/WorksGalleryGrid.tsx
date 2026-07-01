import Image from "next/image";
import { siteConfig } from "@/config/site";

export function WorksGalleryGrid() {
  return (
    <div className="works-gallery-grid mx-auto max-w-6xl">
      {siteConfig.worksGallery.map((item) => (
        <figure key={item.src} className="works-gallery-item">
          <Image
            src={item.src}
            alt=""
            width={800}
            height={1000}
            className="h-full w-full object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </figure>
      ))}
    </div>
  );
}
