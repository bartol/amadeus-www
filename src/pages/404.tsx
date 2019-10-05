import React from 'react'
import Layout from '../components/layout'

const NotFound: React.FC = ({ pageContext }) => {
  const { language } = pageContext
  return (
    <Layout language={language}>
      <h1>Page not found</h1>
    </Layout>
  )
}

export default NotFound
