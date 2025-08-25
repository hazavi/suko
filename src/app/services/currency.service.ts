import { Injectable, signal } from '@angular/core';

export type Currency = 'DKK' | 'EUR' | 'USD' | 'GBP' | 'SWE';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  DKK: 'kr',
  SWE: 'sek',
  EUR: '€',
  USD: '$',
  GBP: '£',
};

const CURRENCY_RATES: Record<Currency, number> = {
  DKK: 7.45, // 1 EUR = 7.45 DKK
  SWE: 11.13, // 1 EUR = 11.13 SEK
  EUR: 1,
  USD: 1.09, // 1 EUR = 1.09 USD
  GBP: 0.85, // 1 EUR = 0.85 GBP
};

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private _currency = signal<Currency>('EUR');

  get currency() {
    return this._currency;
  }

  setCurrency(currency: Currency) {
    this._currency.set(currency);
  }

  getSymbol(currency: Currency = this._currency()) {
    return CURRENCY_SYMBOLS[currency];
  }

  convertFromEUR(amount: number, to: Currency = this._currency()): number {
    return Math.round(amount * CURRENCY_RATES[to] * 100) / 100;
  }
}
