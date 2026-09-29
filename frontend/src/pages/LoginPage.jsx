import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Field from '../components/common/Field'
import AuthLayout from '../components/layout/AuthLayout'
import { useAuth } from '../hooks/useAuth'
import { isEmail } from '../utils/validate'

export default function LoginPage() {
  const { currentUser, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  /*
    Somebody already signed in has no business on this screen, and sending them to "/" lets RoleHome decide which dashboard that means.
  */
  if (currentUser !== null) {
    return <Navigate to="/" replace />
  }

  function clearError(field) {
    setErrors((current) => {
      if (current[field] === undefined && current.form === undefined) {
        return current
      }

      const next = { ...current }
      delete next[field]
      delete next.form
      return next
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const found = {}

    if (email.trim() === '') {
      found.email = 'Enter your email address.'
    } else if (!isEmail(email)) {
      found.email = 'That does not look like an email address.'
    }

    if (password === '') {
      found.password = 'Enter your password.'
    }

    setErrors(found)

    if (Object.keys(found).length > 0) {
      return
    }

    const user = login(email, password)

    /*
      One message covering both a wrong email and a wrong password, rather than saying which. Telling somebody the email was right but the password was not confirms that an account exists, which is worth avoiding even in a mock.
    */
    if (user === null) {
      setErrors({ form: 'We do not recognise that email and password.' })
      return
    }

    toast.success(`Welcome back, ${user.name.split(' ')[0]}`)

    navigate(location.state?.from ?? '/', { replace: true })
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use your university account to see your courses."
      footer={
        <div className="border-border bg-card mt-4 rounded-lg border p-3">
          <p className="text-xs font-medium">Sample accounts</p>
          <p className="text-muted-foreground mt-1 text-xs">
            <span className="font-medium">meera.iyer@university.edu</span> is a professor and{' '}
            <span className="font-medium">aarav.sharma@university.edu</span> is a student. The
            password for every sample account is <span className="font-medium">password123</span>.
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            placeholder="you@university.edu"
            onChange={(event) => {
              setEmail(event.target.value)
              clearError('email')
            }}
          />
        </Field>

        <Field id="password" label="Password" error={errors.password}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              clearError('password')
            }}
          />
        </Field>

        {errors.form ? (
          <p className="text-destructive bg-destructive/5 rounded-lg p-2.5 text-xs">
            {errors.form}
          </p>
        ) : null}

        <Button type="submit" className="w-full">
          Sign in
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          Do not have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
