import * as React from 'react'
import { useContext } from 'react'
import { Link } from 'gatsby'
import Image from 'gatsby-image'
import { CartContext, I18nContext } from '../state/global'
import {
  CarouselProvider,
  Slide,
  Slider,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'

const Featured: React.FC<Props> = ({ items, language }) => {
  const { addToCart, getQuantity } = useContext(CartContext)
  const { currencyConversion } = useContext(I18nContext)

  const DesktopSlides = () => {
    return (
      <div>
        <div className='flex justify-between lg:justify-center'>
          <ButtonBack className='lg:hidden'>Back</ButtonBack>
          <h2 className='text-2xl sm:text-3xl'>istaknuti proizvodi</h2>
          <ButtonNext className='lg:hidden'>Next</ButtonNext>
        </div>
        <div className='flex'>
          <ButtonBack className='hidden lg:block'>Back</ButtonBack>
          <Slider className='flex-grow'>
            {items.map((item, index) => {
              const {
                type,
                slug,
                name,
                price,
                availability,
                images,
                id,
                quantity,
              } = item

              const addToCartItem = {
                name,
                price,
                quantity,
                availability,
                image: images[0],
                id,
              }

              return (
                <Slide
                  index={index}
                  key={index}
                  className='featured-slide-container'
                >
                  <div className='w-full lg:w-3/4 relative rounded-lg border border-gray-200 overflow-hidden flex flex-col justify-between'>
                    <Link
                      to={`${language === 'hr' ? '/' : `/${language}/`}${type[
                        language
                      ].toLowerCase()}/${slug}/`}
                      className='flex-grow'
                    >
                      <div className='p-3 flex'>
                        <Image
                          fluid={images[0].optimized.childImageSharp.fluid}
                          key={images[0].optimized.childImageSharp.fluid.src}
                          alt={`${name[language]} image`}
                          className='h-full w-1/2'
                          fadeIn
                        />
                        <div className='px-12 py-4 md:py-6 xl:py-10'>
                          <h2 className='text-3xl'>{name[language]}</h2>
                          <h3 className='text-xl'>
                            {currencyConversion(price)}
                          </h3>
                          <h3 className='text-xl'>
                            {getQuantity(id, quantity)}
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <div className='px-12 py-8 md:py-10 w-1/2 absolute right-0 bottom-0'>
                      <button
                        type='button'
                        onClick={() => addToCart(addToCartItem)}
                        className='w-full bg-gray-400 py-2 rounded'
                      >
                        add to cart
                      </button>
                    </div>
                  </div>
                </Slide>
              )
            })}
          </Slider>
          <ButtonNext className='hidden lg:block'>Next</ButtonNext>
        </div>
      </div>
    )
  }

  return (
    <section>
      <CarouselProvider
        naturalSlideWidth={33}
        naturalSlideHeight={10}
        totalSlides={items.length}
        infinite={true}
        className='hidden lg:block'
      >
        <DesktopSlides />
      </CarouselProvider>
      <CarouselProvider
        naturalSlideWidth={25}
        naturalSlideHeight={10}
        totalSlides={items.length}
        infinite={true}
        className='hidden sm:block lg:hidden'
      >
        <DesktopSlides />
      </CarouselProvider>
    </section>
  )
}

export default Featured

interface Props {
  language: string
  items: Item[]
}

interface Item {
  name: {
    hr: string
    en: string
  }
  price: number
  description: {
    hr: string
    en: string
  }
  slug: string
  type: {
    hr: string
    en: string
  }
  id: string
  quantity: number
  availability: string
  images: ItemImage[]
}

interface ItemImage {
  index: number
  src: string
  optimized: OptimizedImage
}

interface OptimizedImage {
  childImageSharp: {
    fluid: {
      tracedSVG: string
      aspectRatio: number
      src: string
      srcSet: string
      srcWebp: string
      srcSetWebp: string
      sizes: string
    }
    fixed: {
      tracedSVG: string
      width: number
      height: number
      src: string
      srcSet: string
      srcWebp: string
      srcSetWebp: string
    }
  }
}
