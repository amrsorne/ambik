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
    <div className="shrink-0 border-t border-[var(--color-border-soft)] bg-[var(--color-surface)]/90 backdrop-blur-sm">
      {submittedService === service ? (
        <div
          className="px-4 py-5 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="font-semibold text-[var(--color-accent)]">
            {t('waitlist.thank_you_top')}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {t('waitlist.thank_you_bottom')}
          </p>
        </div>
      ) : canOpenProject ? (
        <ProjectAmbikCta href={url + (src ? `?src=${src}` : '')} />
      ) : (
        <>
          <div className="border-b border-[var(--color-border-soft)] px-4 pb-2 pt-4 text-center">
            <h3 className="text-balance text-base font-semibold text-[var(--color-ink)]">
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
      <ToastContainer
        position="bottom-center"
        className="!bottom-[max(1rem,env(safe-area-inset-bottom))]"
        toastClassName="!rounded-lg !text-sm"
      />
    </div>
  )
}

export default Waitlist
