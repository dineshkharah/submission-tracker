import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Field from '../components/common/Field'
import AuthLayout from '../components/layout/AuthLayout'
import { useAuth } from '../hooks/useAuth'
import { isEmail } from '../utils/validate'

const MIN_PASSWORD = 8

export default function RegisterPage() {
  const { currentUser, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('student')
  const [errors, setErrors] = useState({})

  if (currentUser !== null) {
    return <Navigate to="/" replace />
  }

  function clearError(field) {
    setErrors((current) => {
      if (current[field] === undefined) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function findErrors() {
    const found = {}

    if (name.trim() === '') {
      found.name = 'Enter your full name.'
    }

    if (email.trim() === '') {
      found.email = 'Enter your email address.'
    } else if (!isEmail(email)) {
      found.email = 'That does not look like an email address.'
    }

    if (password.length < MIN_PASSWORD) {
      found.password = `Use at least ${MIN_PASSWORD} characters.`
    }

    if (confirm !== password) {
      found.confirm = 'Both passwords have to match.'
    }

    return found
  }

  function handleSubmit(event) {
    event.preventDefault()

    const found = findErrors()
    setErrors(found)

    if (Object.keys(found).length > 0) {
      return
    }

    const user = register({ name, email, password, role })

    /*
      register returns null only when the email is already taken, so the message goes under that field rather than at the foot of the form.
    */
    if (user === null) {
      setErrors({ email: 'An account already uses that email address.' })
      return
    }

    toast.success(`Welcome, ${user.name.split(' ')[0]}`)

    navigate('/', { replace: true })
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Register as a student or a professor."
      footer={
        <p className="text-muted-foreground mt-4 text-center text-xs">
          A new account starts with no courses, since enrolment and teaching are set by the
          university. Sign in with a sample account to see a full dashboard.
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field id="name" label="Full name" error={errors.name}>
          <Input
            id="name"
            value={name}
            placeholder="Aarav Sharma"
            onChange={(event) => {
              setName(event.target.value)
              clearError('name')
            }}
          />
        </Field>

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

        <Field id="role" label="I am a">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="professor">Professor</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field
          id="password"
          label="Password"
          error={errors.password}
          hint={`At least ${MIN_PASSWORD} characters.`}
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              clearError('password')
            }}
          />
        </Field>

        <Field id="confirm" label="Confirm password" error={errors.confirm}>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => {
              setConfirm(event.target.value)
              clearError('confirm')
            }}
          />
        </Field>

        <Button type="submit" className="w-full">
          Create account
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
