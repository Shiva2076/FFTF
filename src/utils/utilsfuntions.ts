export const checkMarketTrendSubscription = (usersubscription: any[]): boolean => {
    if (!Array.isArray(usersubscription)) return false;
    if (usersubscription.length === 0) return false;
    return usersubscription.some(
      (x) =>
        (x.product_name === 'monthly_market_trend' || x.product_name === 'yearly_market_trend') &&
        x.status === 'ACTIVE'
    );
};