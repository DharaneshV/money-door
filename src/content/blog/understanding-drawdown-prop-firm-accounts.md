---
title: "Understanding Drawdown: The Rule That Ends Most Prop Firm Accounts"
description: "Most failed evaluations aren't lost to a bad strategy — they're lost to a drawdown limit the trader never fully understood. Here's how the two limits work and how to trade inside them."
publishDate: 2026-08-19
category: "Risk Management"
---

Ask a trader why their funded account was closed and you'll usually hear "I had a bad week." Look at the account history and you'll usually find something more specific: they breached a drawdown limit they could have calculated in advance.

Drawdown is the single most common reason evaluations end. Not strategy. Not market conditions. A number in the rulebook that most traders skim once and never model against their own position sizing.

## Two limits, not one

Nearly every prop firm applies two separate drawdown rules, and they fail independently. Breach either one and the account is gone.

**Daily drawdown** caps how much you can lose in a single trading day. It typically resets at a fixed server time — often 00:00 platform time, which may not be midnight where you live.

**Maximum (overall) drawdown** caps how far the account can fall from its starting balance, or from its highest point, across the entire evaluation. It does not reset.

A trader can sit comfortably inside the overall limit and still be closed out by the daily one on a single bad session. The reverse is also true: a slow bleed over three weeks, never breaching a daily limit, can quietly walk the account into the overall one.

## Balance or equity — this is where accounts die

The detail that ends most accounts is *what* the limit measures.

If drawdown is calculated on **equity**, your floating open positions count. An open trade sitting 2% underwater counts against the limit right now, before you have closed anything and before it has become a real loss. A trade you fully intended to hold through a retracement can breach the rule while it is still, in your mind, a perfectly good trade.

If it is calculated on **balance**, only closed trades count.

Read your firm's rule and know which one applies. An equity-based daily limit means your maximum acceptable open risk at any moment is smaller than your daily limit — not equal to it.

## Static versus trailing

The overall limit comes in two forms:

- **Static** — measured from the starting balance. A $50,000 account with a 10% static limit fails at $45,000, whatever happens in between.
- **Trailing** — measured from the account's high-water mark. Make $2,000 and the floor rises with you.

Trailing drawdown catches people out because profit *tightens* the rule. Run the account up 4%, give it back, and you can breach a limit that your original starting balance would never have reached. Some firms trail only until the account reaches its initial balance plus the profit target, then lock the floor. Some trail the whole way. These are materially different products.

## Sizing to the limit, not to the target

Here is the arithmetic most traders never do.

Take a 5% daily drawdown limit. If you risk 2% per trade, three consecutive losses put you at 6% — the account is gone, on a losing streak that any strategy produces regularly.

At 1% per trade, the same three losses cost 3%. You are still trading, and a fourth loss still leaves room.

The profit target is not what should determine your position size. The daily limit is. Work backwards: decide how many consecutive losses your strategy realistically produces, then set risk per trade so that run cannot breach the limit. If the answer is uncomfortably small, that is useful information about the account size you have chosen.

## The rules that quietly interact

Drawdown does not sit on its own. Two other rules regularly combine with it to end accounts:

- **Consistency rules** cap how much of your total profit may come from a single day. A trader who makes the whole target in one trade may pass on paper and fail on consistency.
- **News and weekend restrictions** can force closures at times you did not plan for, turning a managed position into a realised loss that counts against the daily limit.

## What this looks like in practice

Traders who last inside evaluations tend to do the same unglamorous things:

- They calculate the exact currency value of the daily limit before the session, not the percentage.
- They stop trading for the day at a self-imposed level well inside it — often half.
- They know whether their limit is equity-based, and cap total open risk accordingly.
- They treat the drawdown limit as the real target and the profit target as a by-product.

An evaluation is not a test of how much you can make. It is a test of whether you can stay inside a defined risk envelope while making a modest return. Those are different skills, and the second one is the one being assessed.

---

*Money Door FX Academy's MDC2 and MDC3 programs include structured prop firm training covering evaluation rules, drawdown management, account protection and strategy execution under evaluation conditions.*

*Educational content only — not investment advice. Funded-account access is subject to the applicable provider's rules, eligibility criteria, evaluation requirements, terms and conditions. Funding and trading profits are not guaranteed.*
