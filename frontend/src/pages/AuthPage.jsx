import React from 'react'
import SignUpCard from '../components/SignUpCard'
import LoginCard from '../components/LoginCard'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../../atom/authAtom'
import { useSetRecoilState } from 'recoil'

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)

    // useSetRecoilState(authScreenState)
  return (
    <>
      {authScreenState === "login" ? <LoginCard/> : <SignUpCard/>}
    </>
  )
}

export default AuthPage