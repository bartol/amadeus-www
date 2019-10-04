import { Link } from 'gatsby'
import Image from 'gatsby-image'
import React, { useContext } from 'react'
import { CartContext, I18nContext } from '../state/global'

const Card = ({ name, slug, price, optimizedImage, item }) => {
  const { addToCart } = useContext(CartContext)
  const { currencyConversion } = useContext(I18nContext)

  return (
    <li
      key={slug}
      className='w-1/4 p-3 rounded-lg border border-gray-200  mx-auto'
    >
      <Link to={`/${slug}/`} className='w-full h-full'>
        <Image
          fixed={optimizedImage.childImageSharp.fixed}
          key={optimizedImage.childImageSharp.fixed.src}
          alt={`${name} image`} // TODO seems like it isn't working
        />
        <h2 className='text-2xl'>{name}</h2>
        <h3 className='text-xl'>{currencyConversion(price)}</h3>
      </Link>
      <button type='button' onClick={() => addToCart(item)}>
        add to cart
      </button>
    </li>
  )
}

export default Card
