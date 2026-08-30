# Makhana snack launch: a stage-gated GTM for Delhi NCR

I first worked on this category in college. That version jumped from an interesting market to 1,000 dark stores without proving the three things that matter first: whether people prefer the product, whether they will pay for it and whether the second order still makes money.

I rebuilt the work from that point.

This project treats the product as **flavoured popped makhana**, not an extruded chip. The recommendation is a 12-week Delhi NCR pilot with two familiar flavours, a small trial pack and a core pack. Quick commerce is the main convenience channel, but scale only happens after taste, price, repeat and contribution gates are met.

![Makhana launch decision dashboard](visuals/workbook/decision-dashboard.png)

## The call

**Launch a controlled pilot, not a national brand.**

- Start with Chatpata Masala and Cream & Onion.
- Test a 20 g trial pack around ₹50 and a 50 g core pack around ₹149.
- Use office tastings, selected stores and direct bundles to learn before paying for broad quick-commerce distribution.
- Enter 40 to 60 quick-commerce nodes only after blind taste and willingness-to-pay checks pass.
- Keep D2C for bundles, feedback and gifting. Do not assume people will leave a convenience app for a subscription.
- Stop or reformulate if repeat, contribution or expiry gates fail.

**Pilot objective:** within 12 weeks, find a product-price combination that reaches taste parity, clears the price gate, produces at least 20% identifiable eight-week repeat and has positive second-order CM2. If it does not, do not widen distribution.

These prices, fees and gates are planning assumptions. They are editable in the model and are not presented as negotiated trade terms.

## What is inside

| File | What it answers |
|---|---|
| [Full strategy](report-source.md) | What I would launch, for whom, where, why and in what order |
| [Old work audit](legacy/what-i-would-change.md) | What was wrong in my first model and how I corrected it |
| [Financial model](finance/makhana-gtm-model.xlsx) | Pack economics, scenarios, monthly cash, working capital and sensitivity |
| [Board-style deck](deck/makhana-launch-gtm.pdf) + [editable PowerPoint](deck/makhana-launch-gtm.pptx) | The decision and evidence in presentation form |
| [Launch plan](strategy/launch-plan.md) | Twelve weeks of work, owners, budget and outputs |
| [Experiments and gates](strategy/experiments-and-gates.md) | What must be true before more money is spent |
| [Conversion and recovery](strategy/conversion-and-recovery.md) | How someone moves from first exposure to repeat, and what to do at each drop-off |
| [Consumer interview guide](research/consumer-interview-guide.md) | A practical script for primary research |
| [Taste-test scorecard](research/taste-test-scorecard.csv) | A ready-to-use blind product test sheet |
| [Competitor snapshot](research/competitor-price-snapshot.csv) | Pack and price observations collected on 30 August 2026 |
| [Source ledger](research/source-ledger.csv) | Claim-level sources, caveats and access dates |
| [Economics script](scripts/model.py) | A transparent Python version of the core unit economics |

The original four-page appendix is preserved in `legacy/` so the change in thinking is visible.

## What the model is saying

The old 60 g pack at ₹99 does not work with the public raw-makhana price context I found. APEDA's November 2025 dashboard reported an average domestic price of ₹1,250 per kg in 2025. At that level, 60 g of raw makhana alone would imply ₹75 before sorting loss, seasoning, packaging, conversion or freight. That is not a supplier quote, but it is enough to reject a cost assumption that has no procurement evidence.

The new model therefore separates:

- MRP from actual selling price
- GST from revenue
- retailer or platform deductions from brand-funded promotions
- ingredient, seasoning, packaging and conversion cost
- fulfilment, sampling and performance spend
- fixed operating cost and inventory cash

The base case is a learning plan. It is not a forecast dressed up as certainty.

## How I would use this in a real launch

1. Get three contract-manufacturer quotes and lab-tested nutrition panels.
2. Run 60 interviews and at least 120 blind taste tests.
3. Lock the pack architecture only after a price test.
4. Produce a small pilot batch with traceability and shelf-life checks.
5. Review the gates every two weeks.
6. Scale nodes only when repeat and contribution remain healthy without a permanent discount.

## Scope notes

- No consumer interviews or commercial negotiations are claimed as completed.
- Reddit and retailer comments are used only to generate questions, not to estimate demand.
- Company-reported channel shares are labelled as such.
- Final FSSAI classification, pack claims, GST treatment and shelf-life require specialist sign-off on the actual formulation.

## Reproduce the core economics

```bash
python scripts/model.py
```

The script uses only the Python standard library and writes the scenario and monthly output tables to `outputs/`.
