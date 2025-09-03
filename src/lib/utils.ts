import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT' | 'IDR'
    notation?: Intl.NumberFormatOptions['notation']
  } = {}
) {
  const { currency = 'IDR', notation = 'standard' } = options

  const numbericPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numbericPrice)
}
