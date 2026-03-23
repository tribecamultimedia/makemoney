require("../contracts");

function toNumber(value) {
  return Number(value || 0);
}

function buildBalanceSheet(record) {
  const assetBuckets = [
    { key: "liquidCash", label: "Liquid cash", value: toNumber(record?.liquid_cash) },
    { key: "investments", label: "Investments", value: toNumber(record?.investments) },
    { key: "retirement", label: "Retirement", value: toNumber(record?.retirement) },
    { key: "realEstate", label: "Real estate", value: toNumber(record?.real_estate) },
    { key: "businessAssets", label: "Business", value: toNumber(record?.business_assets) },
  ].filter((item) => item.value > 0);

  const debtBuckets = [
    { key: "creditCardDebt", label: "Credit card", value: toNumber(record?.credit_card_debt) },
    { key: "loans", label: "Loans", value: toNumber(record?.loans) },
    { key: "mortgageDebt", label: "Mortgage", value: toNumber(record?.mortgage_debt) },
  ].filter((item) => item.value > 0);

  const totalAssets = assetBuckets.reduce((sum, item) => sum + item.value, 0);
  const totalDebt = debtBuckets.reduce((sum, item) => sum + item.value, 0);
  const netWorth = totalAssets - totalDebt;
  const debtRatio = totalAssets > 0 ? totalDebt / totalAssets : 0;
  const reserveMonths = toNumber(record?.monthly_need) > 0 ? toNumber(record?.liquid_cash) / toNumber(record?.monthly_need) : 0;

  let opinion = "TELAJ sees a balance sheet that can focus on disciplined long-term allocation.";
  if (toNumber(record?.credit_card_debt) > 0) {
    opinion = "TELAJ would likely prioritize expensive consumer debt before stretching into new risk.";
  } else if (debtRatio > 0.6) {
    opinion = "Debt is a large share of the balance sheet, so resilience and repair matter first.";
  } else if (reserveMonths > 0 && reserveMonths < 3) {
    opinion = "Liquidity is still thin, so TELAJ would protect reserves before a bigger investment move.";
  } else if (totalAssets === 0) {
    opinion = "The financial map is still incomplete, so TELAJ should stay cautious until more of the balance sheet is mapped.";
  }

  return {
    liquidCash: toNumber(record?.liquid_cash),
    investments: toNumber(record?.investments),
    retirement: toNumber(record?.retirement),
    realEstate: toNumber(record?.real_estate),
    businessAssets: toNumber(record?.business_assets),
    creditCardDebt: toNumber(record?.credit_card_debt),
    loans: toNumber(record?.loans),
    mortgageDebt: toNumber(record?.mortgage_debt),
    totalAssets,
    totalDebt,
    netWorth,
    debtRatio,
    assetBuckets,
    debtBuckets,
    opinion,
  };
}

module.exports = {
  buildBalanceSheet,
};
