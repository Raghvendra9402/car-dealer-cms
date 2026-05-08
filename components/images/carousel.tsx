"use client";

import { ListingImage } from "@/lib/generated/prisma/client";
import FsLightbox from "fslightbox-react";
// import "swiper/css";
// import "swiper/css/effect-fade";
// import "swiper/css/virtual";
import { EffectFade, Navigation, Thumbs, Virtual } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { SwiperButton } from "../shared/swiper-button";
import { CarouselSkeleton } from "./carousel-skeleton";

type ListingImageWithSignedUrlType = {
  signedUrl: string;
  id: string;
  listingId: string;
  imageUrl: string;
};

interface CarouselProps {
  images: ListingImageWithSignedUrlType[];
}

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
  loading: () => <CarouselSkeleton />,
});
const SwiperThumb = dynamic(
  () => import("swiper/react").then((mod) => mod.Swiper),
  {
    ssr: false,
    loading: () => null,
  },
);

export function Carousel({ images }: CarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeidx, setActiveIdx] = useState(0);
  const [lightboxController, setLightBoxController] = useState({
    toggler: false,
    sourceIndex: 0,
  });

  const isThumbsReady =
    thumbsSwiper && !thumbsSwiper.destroyed && thumbsSwiper.el;

  const setSwiper = (swiper: SwiperType) => {
    setThumbsSwiper(swiper);
  };
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIdx(swiper.activeIndex);
  }, []);

  const handleImageClick = useCallback(() => {
    setLightBoxController({
      toggler: !lightboxController.toggler,
      sourceIndex: activeidx,
    });
  }, [lightboxController.toggler, activeidx]);

  const sources = images.map((image) => image.signedUrl);

  return (
    <>
      <FsLightbox
        toggler={lightboxController.toggler}
        sourceIndex={lightboxController.sourceIndex}
        sources={sources}
        type="image"
      />
      <div className="relative">
        <Swiper
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          effect="fade"
          spaceBetween={10}
          fadeEffect={{ crossFade: true }}
          thumbs={isThumbsReady ? { swiper: thumbsSwiper } : undefined}
          modules={[EffectFade, Virtual, Navigation, Thumbs]}
          virtual={{
            addSlidesAfter: 8,
            enabled: true,
          }}
          className="aspect-3/2"
          onSlideChange={handleSlideChange}
        >
          {images.map((image, idx) => (
            <SwiperSlide key={image.id} virtualIndex={idx}>
              <Image
                src={image.signedUrl}
                alt={"car"}
                width={1200}
                height={800}
                className="aspect-3/2 object-cover rounded-md cursor-pointer"
                onClick={handleImageClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperButton
          prevClassName="left-4 bg-white"
          nextClassName="right-4 bg-white"
        />
      </div>
      <SwiperThumb
        onSwiper={setSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        modules={[Navigation, Thumbs, EffectFade]}
      >
        {images.map((image) => (
          <SwiperSlide
            key={image.id}
            className="relative mt-2 h-fit w-full cursor-grab"
          >
            <Image
              src={image.signedUrl}
              alt={"car"}
              width={300}
              height={200}
              className="aspect-3/2 object-cover rounded"
            />
          </SwiperSlide>
        ))}
      </SwiperThumb>
    </>
  );
}
