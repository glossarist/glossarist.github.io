import React from 'react'


const DoubleDPIImage:
React.FC<{ src: string, dimensions: { width: number, height: number } }> =
function ({ src, dimensions }) {
  return <img
    src={src}
    style={{
      width: `${dimensions.width / 2}px`,
      height: `${dimensions.height / 2}px`,
      objectFit: 'contain',
      objectPosition: 'top left',
      maxHeight: '10rem',
    }} />
}


export default DoubleDPIImage
