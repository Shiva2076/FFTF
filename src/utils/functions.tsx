import { setFarmMetaData } from '@/app/slices/farmLocationMetaSlice';

const updateFarmLocationMeta = (farmCountry: string, dispatch: any) => {
  if (!farmCountry) return;

  const currencyByCountry: Record<string, string> = {
    'India': '₹',
    'United Arab Emirates': 'AED',
    'USA': '$',
    'UK': '£'
  };

  const currency = currencyByCountry[farmCountry] || 'USD';
  const weight = 'kg';

  dispatch(setFarmMetaData({ currency, weight }));
};

export default updateFarmLocationMeta;

export function formatEventTime(timestamp?: string): string {
  if (!timestamp) return '—';
  try {
    return new Date(timestamp).toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}