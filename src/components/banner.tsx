import * as React from 'react'
import Image from 'gatsby-image'
import { CarouselProvider, Dot, Slide, Slider } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'

const Banner: React.FC<Props> = ({ banners }) => {
  const { desktop, mobile } = banners

  return (
    <>
      <CarouselProvider
        naturalSlideWidth={3}
        naturalSlideHeight={1}
        totalSlides={desktop.length}
        isPlaying
        interval={4000}
        infinite={true}
        className='desktopImages'
      >
        <Slider>
          {desktop.map((image, index) => {
            return (
              <Slide index={index} key={index}>
                <Image
                  fluid={image.optimized.childImageSharp.fluid}
                  alt={`Banner ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className='select-none'
                  fadeIn
                />
              </Slide>
            )
          })}
        </Slider>
        <nav>
          {desktop.map((_, index) => {
            return (
              <Dot
                slide={index}
                key={index}
                className='focus:outline-none focus:shadow-outline mx-1 h-3 w-3 bg-red-500 rounded-full isDisabled'
              >
                <span />
              </Dot>
            )
          })}
        </nav>
      </CarouselProvider>
      <CarouselProvider
        naturalSlideWidth={4}
        naturalSlideHeight={3}
        totalSlides={mobile.length}
        isPlaying
        interval={4000}
        infinite={true}
        className='mobileImages'
      >
        <Slider>
          {mobile.map((image, index) => {
            return (
              <Slide index={index} key={index}>
                <Image
                  fluid={image.optimized.childImageSharp.fluid}
                  alt={`Banner ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className='select-none'
                  fadeIn
                />
              </Slide>
            )
          })}
        </Slider>
        <nav>
          {mobile.map((_, index) => {
            return (
              <Dot
                slide={index}
                key={index}
                className='focus:outline-none focus:shadow-outline mx-1 h-3 w-3 bg-red-500 rounded-full isDisabled'
              >
                <span />
              </Dot>
            )
          })}
        </nav>
      </CarouselProvider>
    </>
  )
}

export default Banner

interface Props {
  banners: {
    desktop: Banner[]
    mobile: Banner[]
  }
}

interface Banner {
  link: string
  src: string
  optimized: OptimizedImage
}

interface OptimizedImage {
  childImageSharp: {
    fluid: {
      aspectRatio: number
      src: string
      srcSet: string
      sizes: string
      base64?: string
      tracedSVG?: string
      srcWebp?: string
      srcSetWebp?: string
      media?: string
    }
  }
}
