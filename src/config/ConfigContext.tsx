import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { config as defaultConfig } from './institution.config'

type InstitutionConfig = typeof defaultConfig

const STORAGE_KEY = 'hpc-demo-config'

function loadConfig(): InstitutionConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultConfig
}

interface ConfigContextValue {
  config: InstitutionConfig
  setConfig: (cfg: InstitutionConfig) => void
  resetConfig: () => void
}

const ConfigContext = createContext<ConfigContextValue>({
  config: defaultConfig,
  setConfig: () => {},
  resetConfig: () => {},
})

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<InstitutionConfig>(loadConfig)

  const setConfig = (cfg: InstitutionConfig) => {
    setConfigState(cfg)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
  }

  const resetConfig = () => {
    setConfigState(defaultConfig)
    localStorage.removeItem(STORAGE_KEY)
  }

  useEffect(() => {
    document.title = config.institution.pageTitle
  }, [config.institution.pageTitle])

  return (
    <ConfigContext.Provider value={{ config, setConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  return useContext(ConfigContext)
}
