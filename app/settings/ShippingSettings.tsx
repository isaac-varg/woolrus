'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { getShippingCarriers, type ShippingCarrierWithServices } from '@/actions/shipping/getCarriers'
import { syncCarriers } from '@/actions/shipping/syncCarriers'
import { toggleCarrier, toggleCarrierService } from '@/actions/shipping/toggleCarrier'

const ShippingSettings = () => {
  const t = useTranslations('settings.shipping')
  const [carriers, setCarriers] = useState<ShippingCarrierWithServices[]>([])
  const [syncing, setSyncing] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async () => {
    const data = await getShippingCarriers()
    setCarriers(data)
    setLoaded(true)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await syncCarriers()
      await load()
    } finally {
      setSyncing(false)
    }
  }

  const handleToggleCarrier = async (id: string, enabled: boolean) => {
    setCarriers(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, enabled, services: c.services.map(s => ({ ...s, enabled })) }
          : c,
      ),
    )
    await toggleCarrier(id, enabled)
  }

  const handleToggleService = async (carrierId: string, serviceId: string, enabled: boolean) => {
    setCarriers(prev =>
      prev.map(c =>
        c.id === carrierId
          ? {
              ...c,
              services: c.services.map(s =>
                s.id === serviceId ? { ...s, enabled } : s,
              ),
            }
          : c,
      ),
    )
    await toggleCarrierService(serviceId, enabled)
  }

  const enabledServiceCount = (carrier: ShippingCarrierWithServices) =>
    carrier.services.filter(s => s.enabled).length

  if (!loaded) return null

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/60">{t('description')}</p>
        </div>
        <button
          className="btn btn-sm btn-primary"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing && <span className="loading loading-spinner loading-xs" />}
          {t('syncButton')}
        </button>
      </div>

      {carriers.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          {t('noCarriers')}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {carriers.map(carrier => (
            <div key={carrier.id} className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title flex items-center justify-between pr-12">
                <div className="flex items-center gap-3">
                  <div className="relative z-10" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-primary"
                      checked={carrier.enabled}
                      onChange={() => handleToggleCarrier(carrier.id, !carrier.enabled)}
                    />
                  </div>
                  <div>
                    <span className="font-medium">{carrier.friendlyName}</span>
                    {carrier.nickname !== carrier.friendlyName && (
                      <span className="text-sm text-base-content/50 ml-2">({carrier.nickname})</span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-base-content/50">
                  {t('servicesEnabled', {
                    enabled: enabledServiceCount(carrier),
                    total: carrier.services.length,
                  })}
                </span>
              </div>
              <div className="collapse-content">
                <div className="flex flex-col gap-1 pt-2">
                  {carrier.services.map(service => (
                    <label
                      key={service.id}
                      className={`flex items-center justify-between py-1.5 px-2 rounded ${
                        !carrier.enabled ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="toggle toggle-xs toggle-primary"
                          checked={service.enabled}
                          disabled={!carrier.enabled}
                          onChange={() =>
                            handleToggleService(carrier.id, service.id, !service.enabled)
                          }
                        />
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <div className="flex gap-2">
                        {service.domestic && (
                          <span className="badge badge-xs badge-ghost">{t('domestic')}</span>
                        )}
                        {service.international && (
                          <span className="badge badge-xs badge-ghost">{t('international')}</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShippingSettings
