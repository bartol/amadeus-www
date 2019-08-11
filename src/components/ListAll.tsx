import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import { connect } from 'react-redux'
import CartImage from './cart/cartImage'
import { addToCart } from '../state/actions'

const List: React.FC = () => {
  const data = useStaticQuery(graphql`
    {
      allItems {
        nodes {
          name
          slug
          price
          id__normalized
        }
      }
    }
  `)
  return (
    <ul>
      {data.allItems.nodes.map((item: any) => {
        // TODO add interface
        const { name, slug, price } = item
        return (
          <li>
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
  { addToCart }
)(List)
