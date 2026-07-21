import { assets, siteConfig } from "@/config/site";
import PixelCard from "./PixelCard";
import "./BlogBrandPixelCard.css";

export function BlogBrandPixelCard() {
  return (
    <PixelCard variant="silver" className="blog-brand-pixel-card">
      <div className="pixel-card__content blog-brand-pixel-card__content">
        <div className="blog-brand-pixel-card__logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assets.logoShield}
            alt={siteConfig.name}
            width={132}
            height={132}
            className="blog-brand-pixel-card__logo"
            decoding="async"
          />
        </div>

        <p className="blog-brand-pixel-card__name">{siteConfig.name}</p>
        <p className="blog-brand-pixel-card__tagline">{siteConfig.blogPage.brandTagline}</p>
        <p className="blog-brand-pixel-card__motto">{siteConfig.motto}</p>
      </div>
    </PixelCard>
  );
}
