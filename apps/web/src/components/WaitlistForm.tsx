import React, { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { supabase } from '../data/SupabaseClient'
import {
  assertSubmitCooldown,
  isAllowedService,
  isDuplicateKeyError,
  isValidEmail,
  markSubmitAttempt,
  normalizeEmail,
} from '../lib/waitlist/validate'

interface WaitlistFormProps {
  service: string
  src: string
  onSuccess: () => void
}

const WaitlistForm = ({ service, src, onSuccess }: WaitlistFormProps) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const errorId = useId()

  const validateEmailField = (value: string): string | null => {
    const normalized = normalizeEmail(value)
    if (!normalized) {
      return t('waitlist.email_required')
    }
    if (!isValidEmail(normalized)) {
      return t('waitlist.invalid_email')
    }
    return null
  }

  const handleBlur = () => {
    if (!email.trim()) {
      setFieldError(null)
      return
    }
    setFieldError(validateEmailField(email))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (honeypotRef.current?.value) {
      return
    }

    const emailValidation = validateEmailField(email)
    if (emailValidation) {
      setFieldError(emailValidation)
      return
    }

    if (!assertSubmitCooldown()) {
      setFieldError(t('waitlist.rate_limited'))
      return
    }

    if (!isAllowedService(service)) {
      setFieldError(t('waitlist.invalid_service'))
      return
    }

    const normalized = normalizeEmail(email)
    setFieldError(null)
    setLoading(true)
    markSubmitAttempt()

    const { error } = await supabase.from('waitlist').insert([
      {
        email: normalized,
        service,
        source: src || null,
        remark: null,
      },
    ])

    setLoading(false)

    if (error) {
      if (isDuplicateKeyError(error)) {
        toast.info(t('waitlist.already_joined'))
        onSuccess()
        return
      }
      if (error.message?.includes('waitlist_rate_limited')) {
        setFieldError(t('waitlist.rate_limited'))
        return
      }
      toast.error(t('waitlist.join_failed') + error.message)
      return
    }

    toast.success(t('waitlist.join_success'))
    setEmail('')
    onSuccess()
  }

  return (
    <form
      className="relative flex w-full flex-col gap-3 px-3 pb-4 pt-1"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={loading}
    >
      <div
        className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden
      >
        <label htmlFor="waitlist-company">Company</label>
        <input
          ref={honeypotRef}
          id="waitlist-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="waitlist-email"
          className="mb-1.5 block text-left text-sm font-medium text-[var(--color-ink)]"
        >
          {t('waitlist.email_label')}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <input
            id="waitlist-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (fieldError) {
                setFieldError(null)
              }
            }}
            onBlur={handleBlur}
            placeholder={t('waitlist.email_placeholder')}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? errorId : undefined}
            disabled={loading}
            className="min-h-11 w-full flex-1 rounded-lg border border-[var(--color-border-soft)] bg-white px-4 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-strong)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-brand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? t('waitlist.sending') : t('join_waitlist_button')}
          </button>
        </div>
        {fieldError ? (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-left text-sm text-red-700"
          >
            {fieldError}
          </p>
        ) : (
          <p className="mt-2 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
            {t('waitlist.email_hint')}
          </p>
        )}
      </div>
    </form>
  )
}

export default WaitlistForm
