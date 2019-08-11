import React from 'react'
import { Link } from 'gatsby'
import { connect } from 'react-redux'
import CartImage from '../cart/cartImage'
import { addToCart } from '../../state/actions'

const HitsPreview = ({ hit }: any) => {
  // return JSON.stringify(hit, null, 2)
  const { name, slug, price } = hit
  return (
    <li>
      <CartImage ImageKey={`${slug}-1`} />
      <Link to={`/${slug}/`} key={slug}>
        <h3>{name}</h3>
      </Link>
      {price / 100} kn
      <button type="button" onClick={() => addToCart(hit)}>
        Add to cart
      </button>
    </li>
  )
}

// export default HitsPreview
export default connect(
  null,
  { addToCart }
)(HitsPreview)
