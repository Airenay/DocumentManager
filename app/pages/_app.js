import '../styles/bootstrap.scss'
import '../styles/datepicker.scss'
import '../styles/styles.css'

import { StorageProvider } from '../hooks/useStorage'

export default function MyApp({ Component, pageProps }) {
  return (
    <StorageProvider>
      <Component {...pageProps} />
    </StorageProvider>
  )
}
