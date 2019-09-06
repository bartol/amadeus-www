import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import { connect } from 'react-redux'
import CartImage from './cart/cartImage'
// @ts-ignore
import { addToCart as reduxAddToCart } from '../state/actions'

interface Props {
  addToCart: any
}

const List: React.FC<Props> = ({ addToCart }: any) => {
  const data = useStaticQuery(graphql`
    {
      allItems {
        nodes {
          name
          slug
          price
          id__normalized
          qt
        }
      }
    }
  `)
  return (
    <ul className="list">
      {data.allItems.nodes.map((item: any) => {
        const { name, slug, price } = item
        return (
          <li key={slug}>
            <CartImage ImageKey={`${slug}-1`} />
            <Link to={`/${slug}/`} key={slug}>
              <h3>{name}</h3>
            </Link>
            {price / 100} kn
            <button type="button" onClick={() => addToCart(item)}>
              Add to cart
            </button>
          </li>
        )
      })}
    </ul>
  )
}

// export default List
export default connect(
  null,
  { addToCart: reduxAddToCart }
)(List)
