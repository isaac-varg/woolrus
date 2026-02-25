'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { signOut } from 'next-auth/react'
import { updatePreferences } from '@/actions/user/updatePreferences'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/preferences/types'

const SettingsPage = () => {
  const t = useTranslations('settings')
  const currentLocale = useLocale() as Locale
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'user' | 'shipping'>('user')

  const handleLocaleChange = async (locale: Locale) => {
    await updatePreferences({ locale })
    router.refresh()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">{t('title')}</h1>

      <div role="tablist" className="tabs tabs-border mb-6">
        <button
          role="tab"
          className={`tab ${activeTab === 'user' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          {t('tabs.user')}
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === 'shipping' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          {t('tabs.shipping')}
        </button>
      </div>

      {activeTab === 'user' && (
        <div className="flex flex-col gap-6 max-w-md">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t('user.language')}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={currentLocale}
              onChange={(e) => handleLocaleChange(e.target.value as Locale)}
            >
              <option value="en">{t('user.english')}</option>
              <option value="es">{t('user.spanish')}</option>
            </select>
          </div>

          <div>
            <button
              className="btn btn-error btn-outline"
              onClick={() => signOut()}
            >
              {t('user.logout')}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'shipping' && (
        <div>
          <p>Hello World</p>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
