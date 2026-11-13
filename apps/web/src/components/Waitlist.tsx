import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import ProjectAmbikCta from './ProjectAmbikCta'
import WaitlistForm from './WaitlistForm'

interface WaitlistProps {
  url: string
  src: string
  service: string
  canOpenProject?: boolean
}

const Waitlist = ({
  url,
  src,
  service,
  canOpenProject = false,
}: WaitlistProps): React.JSX.Element => {
  const { t } = useTranslation()
  const [submittedService, setSubmittedService] = useState<string | null>(null)

  return (
    <>
      <div className="mt-auto rounded-b-lg border-t border-[var(--color-border-soft)] bg-[var(--color-surface)]/80 p-2 backdrop-blur-sm">
        {submittedService === service ? (
          <div className="mb-2 text-center font-medium text-[var(--color-accent)]">
            {t('waitlist.thank_you_top')}
            <br />
            {t('waitlist.thank_you_bottom')}
          </div>
        ) : canOpenProject ? (
          <ProjectAmbikCta href={url + (src ? `?src=${src}` : '')} />
        ) : (
          <>
            <div className="px-2 pt-3 text-center">
              <h3 className="font-semibold text-[var(--color-ink)]">
                {t('join_waitlist_title')}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {url ? t('waitlist.subtitle_has_url') : t('join_waitlist_subtitle')}
              </p>
            </div>
            <WaitlistForm
              service={service}
              src={src}
              onSuccess={() => setSubmittedService(service)}
            />
          </>
        )}
        <ToastContainer />
      </div>
    </>
  )
}

export default Waitlist
