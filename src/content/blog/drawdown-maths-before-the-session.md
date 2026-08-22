---
title: "Do the Drawdown Maths Before You Place a Trade"
description: "A funded account is a risk envelope with a profit target attached, not the other way round. Here is the arithmetic that tells you your real position size — worked through with actual numbers."
publishDate: 2026-08-20
category: "Risk Management"
---

Here is a question worth answering before your next session: in currency, not percentages, how much can you lose today before your account is closed?

If you had to pause and work it out, that is the problem. Traders who lose funded accounts almost never lose them to one catastrophic idea. They lose them because they were sizing positions against a profit target while a limit they had never converted into rupees or dollars quietly counted down behind them.

## Start with the number that ends you

Take a $50,000 account with a 5% daily limit. That is **$2,500** — the amount that closes your account today, regardless of how the rest of the month has gone.

Now decide how many consecutive losing trades your strategy realistically produces. Not how many you hope for. Look at your last hundred trades and find the worst run. For most rule-based strategies the honest answer is somewhere between four and seven.

Say six. The arithmetic is then simple:

```
$2,500 ÷ 6 = $416 maximum risk per trade
```

On a $50,000 account, $416 is **0.83%**. That is your ceiling — not a conservative suggestion, a ceiling. Anything larger means a normal losing streak, the kind your strategy produces several times a year, can end the account on an ordinary Tuesday.

Most traders arrive at 2% because it is the number they read somewhere. At 2% on this account, three losses cost $3,000. The account is gone before the streak is even unusual.

## The limit that does not reset

The daily figure is only half of it. The overall limit — often 10%, so $5,000 here — does not reset at midnight. It is the total the account can fall from its starting balance, or from its highest point, across the whole evaluation.

Two forms exist and they behave very differently:

**Static** measures from your starting balance. A $50,000 account with a 10% static limit fails at $45,000, whatever route it took.

**Trailing** measures from the account's high-water mark. Make $2,000 and the floor rises to $47,000 with you.

Trailing is the one that surprises people, because **profit tightens the rule**. Run the account to $52,000, give it back, and you breach at a balance your starting figure would never have reached. Some firms stop trailing once you clear the profit target; some trail the entire way. Those are different products sold under the same word.

## The detail that closes accounts while the trade is still open

Find out whether your limit is measured on **balance** or **equity**.

On balance, only closed trades count. On equity, your open floating loss counts *right now* — before you have closed anything, before it has become a real loss at all.

This matters more than it sounds. A trade sitting 2% underwater, which you fully intend to hold through a normal retracement, is already consuming your daily allowance on an equity-based account. A perfectly reasonable position can breach the rule while your analysis is still correct.

If your limit is equity-based, your maximum **open** risk at any moment must be smaller than your daily limit — not equal to it. If you hold two positions at once, they share that allowance.

## Where the timezone gets people

Daily limits reset at a fixed server time, and it is very often not midnight where you live. A trader in India working a broker on a New York reset can be two calendar days into what the platform still counts as one session.

Check the reset time in your firm's own stated timezone, then convert it to yours once and write it down. This is a two-minute job that prevents an entire category of accidental breach.

## A worked example, end to end

$50,000 account. 5% daily ($2,500), 10% trailing overall ($5,000), equity-based, resets 00:00 New York.

- Worst historical losing run: 6
- Maximum risk per trade: $2,500 ÷ 6 = **$416**
- Self-imposed daily stop: **$1,250** — half the real limit, which leaves room for a mistake, a slipped fill, or a gap
- Maximum concurrent open risk: **$1,250**, so two full-size positions and no more
- Reset time in IST: **09:30**, so anything held across that is a new session's risk

None of that required a view on the market. It is all arithmetic, and it can be done once and reused every day.

## The reframe

An evaluation is not a test of how much you can make. It is a test of whether you can produce a modest return while staying inside a defined risk envelope. Those are different skills, and only the second one is actually being assessed.

Traders who treat the drawdown limit as the real target — and the profit target as something that happens on its own if they keep showing up — are the ones still trading the account a year later.

---

*Money Door FX Academy's MDC2 and MDC3 programs include structured prop firm training covering evaluation rules, drawdown management, account protection and strategy execution under evaluation conditions.*

*Educational content only — not investment advice. Funded-account access is subject to the applicable provider's rules, eligibility criteria, evaluation requirements, terms and conditions. Funding and trading profits are not guaranteed.*
