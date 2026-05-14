export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getTopCoins(limit = 20): Promise<CoinData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true`
    );
    if (!response.ok) throw new Error('Failed to fetch crypto data');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function getCoinHistory(coinId: string, days = 7): Promise<any> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch coin history');
    return await response.json();
  } catch (error) {
    console.error('History fetch error:', error);
    return null;
  }
}
