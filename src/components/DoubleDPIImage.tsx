import React from 'react'


export interface DoubleDPIImageProps {
  src: string
  objectFit?: 'contain' | 'fill'
  dimensions: { width: number, height: number }
  style?: React.CSSProperties
  className?: string
}
const DoubleDPIImage: React.FC<DoubleDPIImageProps> =
function ({ src, dimensions, style, className, objectFit }) {
  return <img
    src={src}
    className={className}
    style={{
      ...style,
      width: `${dimensions.width / 2}px`,
      height: `${dimensions.height / 2}px`,
      objectFit: objectFit || 'contain',
      objectPosition: 'top left',
      maxHeight: '10rem',
    }} />
}


export default DoubleDPIImage
