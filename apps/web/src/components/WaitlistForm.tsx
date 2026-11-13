import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Turnstile } from 'react-turnstile'
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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [turnstileKey, setTurnstileKey] = useState(0)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (honeypotRef.current?.value) {
      return
    }

    if (!assertSubmitCooldown()) {
      toast.error(t('waitlist.rate_limited'))
      return
    }

    if (!isAllowedService(service)) {
      toast.error(t('waitlist.invalid_service'))
      return
    }

    const normalized = normalizeEmail(email)
    if (!isValidEmail(normalized)) {
      toast.error(t('waitlist.invalid_email'))
      return
    }

    if (!captchaToken) {
      toast.error(t('waitlist.verify_human'))
      return
    }

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
        toast.error(t('waitlist.rate_limited'))
        return
      }
      toast.error(t('waitlist.join_failed') + error.message)
      return
    }

    toast.success(t('waitlist.join_success'))
    setEmail('')
    setCaptchaToken(null)
    setTurnstileKey((key) => key + 1)
    onSuccess()
  }

  return (
    <form
      className="relative flex w-full max-w-md flex-col items-center gap-2 px-2 pb-2"
      onSubmit={handleSubmit}
      noValidate
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

      <label htmlFor="waitlist-email" className="sr-only">
        {t('waitlist.email_placeholder')}
      </label>
      <div className="flex w-full gap-2">
        <input
          id="waitlist-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('waitlist.email_placeholder')}
          className="min-h-11 w-full rounded-lg border border-[var(--color-border-soft)] bg-white/90 px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--color-brand)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[var(--color-brand-strong)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t('waitlist.sending') : t('join_waitlist_button')}
        </button>
      </div>

      <Turnstile
        key={turnstileKey}
        sitekey={import.meta.env.VITE_CF_TURNSTILE_SITE_KEY}
        onSuccess={(token) => setCaptchaToken(token)}
        onExpire={() => setCaptchaToken(null)}
        className="mt-1"
        theme="light"
      />
    </form>
  )
}

export default WaitlistForm
