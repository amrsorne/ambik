import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from 'react-toastify'
import Turnstile from 'react-turnstile'
import { supabase } from '../data/SupabaseClient'

interface WaitlistProps {
  url: string
  src: string
  service: string
}

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const Waitlist = ({ url, src, service }: WaitlistProps): React.JSX.Element => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [submittedService, setSubmittedService] = useState<string | null>(null)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      toast.error(t('waitlist.invalid_email'))
      return
    }

    if (!captchaToken) {
      toast.error(t('waitlist.verify_human'))
      return
    }

    setLoading(true)

    const { data, error: checkError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .eq('service', service)
      .maybeSingle()

    if (checkError) {
      toast.error(t('waitlist.check_failed') + checkError.message)
      setLoading(false)
      return
    }

    if (data) {
      toast.info(t('waitlist.already_joined'))
      setLoading(false)
      return
    }

    const { error } = await supabase.from('waitlist').insert([
      {
        email,
        service,
        source: src || null,
        remark: null,
      },
    ])

    setLoading(false)

    if (error) {
      toast.error(t('waitlist.join_failed') + error.message)
    } else {
      toast.success(t('waitlist.join_success'))
      setEmail('')
      setCaptchaToken(null)
      setSubmittedService(service)
    }
  }

  return (
    <>
      <div className="border-t border-gray-200 bg-gray-50/50 backdrop-blur-xs p-1 rounded-b-lg mt-auto">
        {submittedService === service ? (
          <div className="text-center text-green-600 font-medium mb-2">
            {t('waitlist.thank_you_top')}
            <br />
            {t('waitlist.thank_you_bottom')}
          </div>
        ) : (
          <>
            <div className="text-center mb-0">
              {url ? (
                <p className="text-sm text-gray-500">
                  {t('try_button_subtitle')}
                </p>
              ) : (
                <>
                  <h3 className="text-gray-700 font-semibold">
                    {t('join_waitlist_title')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('join_waitlist_subtitle')}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-1 items-center">
              {url ? (
                <a
                  href={url + (src ? `?src=${src}` : '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 w-80 inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 px-4 rounded-lg hover:from-blue-400 hover:to-blue-700 transition duration-200 text-center"
                >
                  {t('try_button')}
                </a>
              ) : (
                <>
                  <div className="flex w-full max-w-md gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('waitlist.email_placeholder')}
                      className="w-full px-4 py-1 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                    />
                    <button
                      onClick={handleSendEmail}
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-xs hover:shadow-sm flex items-center gap-2"
                    >
                      {loading
                        ? t('waitlist.sending')
                        : t('join_waitlist_button')}{' '}
                      <span className="text-lg">✨</span>
                    </button>
                  </div>

                  <Turnstile
                    sitekey={import.meta.env.VITE_CF_TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setCaptchaToken(token)}
                    className="mt-2"
                    theme="light"
                  />
                </>
              )}
            </div>
          </>
        )}
        <ToastContainer />
      </div>
    </>
  )
}

export default Waitlist
