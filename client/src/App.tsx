import React from 'react'
import 'styles/ReactWelcome.css'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import { useAuth } from './contexts/AuthContext'

const App = () => {
  return (
    <div className='App'>
      <Header />
      <LoggedInStatus />
      <AuthModal />
    </div>
  )
}



const LoggedInStatus = () => {
  const { isLoggedIn, account } = useAuth()

  if (isLoggedIn && !!account) {
    return <p>Hey, {account.username}! I'm happy to let you know: you are authenticated!</p>
  }

  return <p>login</p>
}

export default App
