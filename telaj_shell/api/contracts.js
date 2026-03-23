/**
 * @typedef {Object} UserState
 * @property {string} userId
 * @property {boolean} authenticated
 * @property {string} email
 * @property {string} marketRegion
 * @property {string} source
 */

/**
 * @typedef {Object} BalanceSheet
 * @property {number} liquidCash
 * @property {number} investments
 * @property {number} retirement
 * @property {number} realEstate
 * @property {number} businessAssets
 * @property {number} creditCardDebt
 * @property {number} loans
 * @property {number} mortgageDebt
 * @property {number} totalAssets
 * @property {number} totalDebt
 * @property {number} netWorth
 * @property {number} debtRatio
 * @property {Array<{key: string, label: string, value: number}>} assetBuckets
 * @property {Array<{key: string, label: string, value: number}>} debtBuckets
 * @property {string} opinion
 */

/**
 * @typedef {Object} LiquidityState
 * @property {number} liquidCash
 * @property {number} monthlyNeed
 * @property {number} reserveMonths
 * @property {number} reserveTargetMonths
 * @property {number} reserveTargetAmount
 * @property {number} reserveGap
 * @property {string} liquidityPosture
 * @property {string} summary
 */

/**
 * @typedef {Object} SignalDecision
 * @property {string} headline
 * @property {string} signal
 * @property {string} primaryAction
 * @property {string} why
 * @property {string} whatCouldGoWrong
 * @property {string} saferOption
 * @property {number} confidence
 * @property {string} timeHorizon
 * @property {Array<string>} reasons
 */

/**
 * @typedef {Object} ActionPlanStep
 * @property {string} label
 * @property {number} percent
 * @property {number} amount
 * @property {string} note
 */

/**
 * @typedef {Object} ActionPlan
 * @property {string} headline
 * @property {string} summary
 * @property {string} primaryAction
 * @property {string} secondaryAction
 * @property {string} growthSleeve
 * @property {string} watchout
 * @property {string} plainEnglish
 * @property {Array<string>} reasons
 * @property {Array<ActionPlanStep>} steps
 */

module.exports = {};
