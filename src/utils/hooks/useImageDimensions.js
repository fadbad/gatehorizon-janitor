import {useEffect, useState} from 'react'
import { Image } from 'react-native'

export default ( source) => {
  const [result, setResult] = useState({loading: true})

  useEffect(() => {
    try {
      if (typeof source === 'number') {
        const {width, height} = Image.resolveAssetSource(source)

        setResult({
          dimensions: {width, height, aspectRatio: width / height},
          loading: false,
        })

        return
      }

      if (typeof source === 'object' && source.uri) {
        setResult({loading: true})

        Image.getSize(
          source.uri,
          (width, height) =>
            setResult({
              dimensions: {width, height, aspectRatio: width / height},
              loading: false,
            }),
          (error) => setResult({error, loading: false}),
        )

        return
      }

      throw new Error('not implemented')
    } catch (error) {
      setResult({error, loading: false})
    }
  }, [source])

  return result
}
