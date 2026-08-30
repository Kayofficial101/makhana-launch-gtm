# Makhana snack launch plan for Delhi NCR

This project turns an old college idea into a launch plan that can be tested before a large amount of money is spent.

## What I was trying to solve

My original plan treated a growing category as enough reason to launch. It did not answer the harder questions: Do people prefer the product? Will they pay the planned price? Does the pack make money after channel costs? Will buyers return?

I rebuilt the work around those questions.

## What I did

1. Audited the calculations and assumptions in the college version.
2. Researched the category, competitors, input prices, regulations and sales channels.
3. Built pack economics for downside, base and upside cases.
4. Designed interviews, blind taste tests and price tests.
5. Planned a 12-week Delhi NCR pilot with clear rules to continue, change or stop.

![Makhana launch decision dashboard](visuals/workbook/decision-dashboard.png)

## My recommendation

Start with a controlled pilot, not a wide launch.

- Test Chatpata Masala and Cream & Onion.
- Use a 20 g trial pack near ₹50 and a 50 g main pack near ₹149.
- Begin with office tastings and 20 to 30 selected stores.
- Enter 40 to 60 quick-commerce nodes only after the first tests pass.
- Look for at least 20% identifiable repeat within eight weeks.
- Check that the second order still makes money after product, channel, fulfilment and variable marketing costs.

The pilot budget is capped at ₹30 lakh. Prices, fees and pass rules are editable assumptions, not supplier quotes.

## One important finding

APEDA's November 2025 dashboard showed an average domestic makhana price of ₹1,250 per kg in 2025. At that price, the 60 g pack in my old plan would contain about ₹75 of raw makhana before processing, seasoning, packaging or freight. That made the old ₹99 selling price and cost assumption unrealistic.

In the new base case, the 20 g pack is a paid trial tool and the 50 g pack is the main contribution pack.

## Tools used

Market research, Excel, Python, PowerPoint, consumer-test design and unit-economics modelling.

## Main files

- [Full strategy](report-source.md): market, customer, product, channels, economics and risks
- [Excel model](finance/makhana-gtm-model.xlsx): pack economics, cash plan, pilot budget and sensitivity
- [Presentation](deck/makhana-launch-gtm.pdf): 14-slide summary
- [Original-plan audit](legacy/what-i-would-change.md): what changed and why
- [12-week launch plan](strategy/launch-plan.md): work, owners, budget and outputs
- [Test and scale rules](strategy/experiments-and-gates.md): evidence needed before more money is spent
- [Research kit](research/consumer-interview-guide.md): interview guide, taste-test sheet, competitor prices and source ledger

## What would happen before a real launch

I would collect manufacturer quotes, run the interviews and taste tests, confirm trade terms, test shelf life and get the final product and label reviewed. This project builds the plan and model. It does not claim that those field tests have already happened.

Run `python scripts/model.py` to reproduce the core calculations.
