// src/hooks/useLanguage.ts
import { useState, useEffect } from 'react'
import en from '../i18n/en.json'
import kn from '../i18n/kn.json'

export const useLanguage = () => {
  const [lang, setLang] = useState<'en' | 'kn'>(
    (localStorage.getItem('lang') as 'en' | 'kn') || 'en'
  )

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const t = (path: string, params?: Record<string, string>) => {
    const dict = lang === 'en' ? en : kn;
    
    const keys = path.split('.');
    let value: any = dict;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return path;
      }
    }

    if (typeof value !== 'string') {
      return path;
    }

    let str = value;
    if (params) {
      Object.keys(params).forEach((p) => {
        str = str.replace(`{{${p}}}`, params[p])
      })
    }
    return str
  }

  return { lang, setLang, t, language: lang }
}