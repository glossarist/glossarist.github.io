import chroma from 'chroma-js'


export const scale = chroma.scale(['#55aadd', 'hotpink']).colors(5, null)

export const link = scale[0].darken(1)