import React from 'react'
import Image from 'gatsby-image'
import {
  CarouselProvider,
  Dot,
  Slide,
  Slider,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'

const Banner: React.FC<Props> = ({ banners }) => {
  const {
    optimizedDesktop: desktopImages,
    optimizedMobile: mobileImages,
  } = banners

  return (
    <div className='w-full'>
      <CarouselProvider
        naturalSlideWidth={3}
        naturalSlideHeight={1}
        totalSlides={desktopImages.length}
        isPlaying
        interval={5000}
        infinite='true'
        className='desktopBanner'
      >
        <Slider>
          {desktopImages.map((image, index) => {
            return (
              <Slide index={index} key={index}>
                <Image
                  fluid={image.childImageSharp.fluid}
                  alt={`Banner ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className='select-none'
                  fadeIn
                />
              </Slide>
            )
          })}
        </Slider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
        <nav>
          {desktopImages.map((image, index) => {
            return (
              <Dot
                slide={index}
                key={index}
                className='focus:outline-none focus:shadow-outline mx-1 h-3 w-3 bg-red-500 rounded-full isDisabled'
              />
            )
          })}
        </nav>
      </CarouselProvider>

      <CarouselProvider
        naturalSlideWidth={4}
        naturalSlideHeight={3}
        totalSlides={mobileImages.length}
        isPlaying
        interval={5000}
        infinite='true'
        className='mobileBanner'
      >
        <Slider>
          {mobileImages.map((image, index) => {
            return (
              <Slide index={index} key={index}>
                <Image
                  fluid={image.childImageSharp.fluid}
                  alt={`Banner ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className='select-none'
                  fadeIn
                />
              </Slide>
            )
          })}
        </Slider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
        <nav>
          {mobileImages.map((image, index) => {
            return (
              <Dot
                slide={index}
                key={index}
                className='focus:outline-none focus:shadow-outline mx-1 h-3 w-3 bg-red-500 rounded-full isDisabled'
              />
            )
          })}
        </nav>
      </CarouselProvider>
    </div>
  )
}

export default Banner
