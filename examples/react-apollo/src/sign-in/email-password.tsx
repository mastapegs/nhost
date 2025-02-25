import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Modal, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useSignInEmailPassword } from '@nhost/react'

import AuthLink from '../components/AuthLink'

export const EmailPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const { signInEmailPassword, needsMfaOtp, sendMfaOtp } = useSignInEmailPassword()
  const navigate = useNavigate()

  const [emailVerificationToggle, setEmailVerificationToggle] = useState(false)

  const signIn = async () => {
    const result = await signInEmailPassword(email, password)
    if (result.isError) {
      showNotification({
        color: 'red',
        title: 'Error',
        message: result.error?.message
      })
    } else if (result.needsEmailVerification) {
      setEmailVerificationToggle(true)
    } else if (!result.needsEmailVerification) {
      navigate('/', { replace: true })
    }
  }

  const sendOtp = async () => {
    sendMfaOtp(otp)
    console.log('TODO')
  }
  if (needsMfaOtp)
    return (
      <>
        <TextInput
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="One-time password"
          size="lg"
          autoFocus
          style={{ marginBottom: '0.5em' }}
        />
        <Button fullWidth onClick={sendOtp}>
          Send 2-step verification code
        </Button>
      </>
    )
  else
    return (
      <>
        <Modal
          title="Awaiting email verification"
          transition="fade"
          centered
          transitionDuration={600}
          opened={emailVerificationToggle}
          onClose={() => {
            setEmailVerificationToggle(false)
          }}
        >
          You need to verify your email first. Please check your mailbox and follow the confirmation
          link to complete the registration.
        </Modal>
        <TextInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          size="lg"
          autoFocus
          style={{ marginBottom: '0.5em' }}
        />
        <TextInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          size="lg"
          style={{ marginBottom: '0.5em' }}
        />

        <Button fullWidth onClick={signIn}>
          Sign in
        </Button>
        <AuthLink link="/sign-in/forgot-password" variant="white">
          Forgot password?
        </AuthLink>
      </>
    )
}
