import AppRoutes from './routes/AppRoutes'
import { TransactionProvider } from './context/TransactionContext'
import { SettingsProvider } from './context/SettingsContext'
function App() {

  return (
    <>
     <TransactionProvider>
       <SettingsProvider>
         <AppRoutes />
       </SettingsProvider>
     </TransactionProvider>
    </>
  )
}

export default App
