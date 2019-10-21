import { Link } from 'gatsby'
import Image from 'gatsby-image'
import React, { useContext } from 'react'
import { CartContext, I18nContext } from '../state/global'

const Card = ({
  name,
  slug,
  price,
  quantity,
  availability,
  optimizedImage,
  language,
  id,
}) => {
  const { addToCart, getQuantity } = useContext(CartContext)
  const { currencyConversion } = useContext(I18nContext)

  const addToCartItem = {
    name,
    price,
    quantity,
    availability,
    image: optimizedImage,
    id,
  }

  return (
    <li key={slug} className='w-1/3 p-3 rounded-lg'>
      <div className='w-full h-full rounded-lg border border-gray-200 overflow-hidden flex flex-col justify-between'>
        <Link
          to={`${language === 'hr' ? '/' : `/${language}/`}${slug}/`}
          className='flex-grow'
        >
          <div className='p-3'>
            <Image
              fluid={optimizedImage.childImageSharp.fluid}
              key={optimizedImage.childImageSharp.fluid.src}
              alt={`${name} image`} // TODO seems like it isn't working
              fadeIn
            />
            <h2 className='text-2xl'>{name}</h2>
            <h3 className='text-xl'>{currencyConversion(price)}</h3>
            <h3 className='text-xl'>{getQuantity(id, quantity)}</h3>
          </div>
        </Link>
        <div className='p-3'>
          <button
            type='button'
            onClick={() => addToCart(addToCartItem)}
            className='w-full bg-gray-400 py-2 rounded'
          >
            add to cart
          </button>
        </div>
      </div>
    </li>
  )
}

export default Card
