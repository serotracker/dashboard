"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export interface CarouselProps {
  children: React.ReactNode;
}

export const Carousel = (props: CarouselProps) => {
  const { children } = props;

  return (
    <div className="bg-background pl-10 pr-10 pb-10 pt-4 rounded-2xl">
      <Slider
        dots={true}
        infinite={true}
        arrows={true}
        speed={500}
        slidesToShow={4}
        slidesToScroll={4}
        responsive={[
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 1048,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 720,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: false
            }
          }
        ]}
      >
        {children}
      </Slider>
    </div>
  );
};