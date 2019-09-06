import React from 'react'

interface Props {
  children: any
}

const Layout: React.FC<Props> = ({ children }) => {
  return <>{children}</>
}

export default Layout
