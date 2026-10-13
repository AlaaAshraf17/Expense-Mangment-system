import AppRoutes from './routes/AppRoutes'
import { TransactionProvider } from './context/TransactionContext'
function App() {

  return (
    <>
     <TransactionProvider>
       <AppRoutes />
     </TransactionProvider>
    </>
  )
}

export default App
