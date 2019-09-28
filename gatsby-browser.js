/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
// import mediumZoom from 'medium-zoom'
import wrapWithProvider from './src/state/createStore'

export const wrapRootElement = wrapWithProvider

// @see https://github.com/francoischalifour/medium-zoom#options
// const defaultOptions = {
//   margin: 24,
//   background: '#fff',
//   scrollOffset: 0,
//   container: null,
//   template: null,
//   zIndex: 999
// }

// @see https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-images/src/constants.js#L1
// const imageClass = '.gatsby-resp-item-image img'

// const ZOOM_STYLE_ID = 'medium-zoom-styles'
// const TRANSITION_EFFECT = 'opacity 0.5s, transform .3s cubic-bezier(.2,0,.2,1)'

// function injectStyles(options) {
//   const styleTag = document.querySelector(`#${ZOOM_STYLE_ID}`)
//   if (styleTag) {
//     return
//   }

//   const { zIndex } = options
//   const node = document.createElement('style')
//   const styles = `
//     .medium-zoom--opened > .medium-zoom-overlay,
//     .medium-zoom--opened > .medium-zoom-image {
//       z-index: ${zIndex};
//     }
//   `
//   node.id = ZOOM_STYLE_ID
//   node.innerHTML = styles
//   document.head.appendChild(node)
// }

// function applyZoomEffect(options) {
//   const images = Array.from(document.querySelectorAll(imageClass)).map(el => {
//     function onImageLoad() {
//       const originalTransition = el.style.transition

//       el.style.transition = `${originalTransition}, ${TRANSITION_EFFECT}`
//       el.removeEventListener('load', onImageLoad)
//     }
//     el.addEventListener('load', onImageLoad)
//     return el
//   })

//   if (images.length > 0) {
//     mediumZoom(images, options)
//   }
// }

// export const onRouteUpdate = (_, pluginOptions) => {
//   const options = { ...defaultOptions, ...pluginOptions }
//   injectStyles(options)

//   applyZoomEffect(options)
// }
