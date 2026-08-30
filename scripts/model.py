"""Transparent scenario model for the makhana pilot.

The values are planning assumptions, not actual supplier or channel terms.
"""

from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "finance" / "model-assumptions.csv"
OUTPUT = ROOT / "outputs"


def load_assumptions() -> dict[tuple[str, str], dict[str, str]]:
    with INPUT.open(encoding="utf-8-sig", newline="") as handle:
        return {
            (row["section"], row["input"]): row
            for row in csv.DictReader(handle)
        }


def value(data: dict, section: str, name: str, scenario: str) -> float:
    return float(data[(section, name)][scenario])


def pack_economics(data: dict, pack: str, scenario: str) -> dict[str, float | str]:
    mrp = value(data, pack, "MRP", scenario)
    discount = value(data, pack, "Consumer discount", scenario)
    gst = value(data, pack, "GST", scenario)
    channel = value(data, pack, "Channel deduction", scenario)
    product_cost = value(data, pack, "Product cost", scenario)
    fulfilment = value(data, pack, "Fulfilment and variable ops", scenario)
    marketing = value(data, pack, "Variable marketing and samples", scenario)

    selling_price = mrp * (1 - discount)
    ex_gst_sales = selling_price / (1 + gst)
    channel_cost = ex_gst_sales * channel
    cm1 = ex_gst_sales - channel_cost - product_cost
    cm2 = cm1 - fulfilment - marketing

    return {
        "scenario": scenario,
        "pack": pack,
        "mrp_inr": round(mrp, 2),
        "selling_price_inr": round(selling_price, 2),
        "ex_gst_sales_inr": round(ex_gst_sales, 2),
        "channel_cost_inr": round(channel_cost, 2),
        "product_cost_inr": round(product_cost, 2),
        "cm1_inr": round(cm1, 2),
        "cm2_inr": round(cm2, 2),
        "cm2_margin": round(cm2 / ex_gst_sales, 4),
    }


def monthly_plan(data: dict, scenario: str) -> list[dict[str, float | int | str]]:
    nodes_peak = int(value(data, "Pilot", "Quick-commerce nodes at peak", scenario))
    weekly_velocity = value(data, "Pilot", "Median core packs per node per week", scenario)
    fixed_cost = value(data, "Pilot", "Fixed operating cost", scenario)
    core = pack_economics(data, "Core pack", scenario)
    ramp = [0, 0, 0.25, 0.50, 0.75, 1.00]
    rows = []
    cumulative = 0.0
    for month, ramp_share in enumerate(ramp, start=1):
        nodes = round(nodes_peak * ramp_share)
        core_units = round(nodes * weekly_velocity * 4.33)
        trial_units = round(core_units * 0.45)
        trial = pack_economics(data, "Trial pack", scenario)
        contribution = core_units * float(core["cm2_inr"]) + trial_units * float(trial["cm2_inr"])
        cash_result = contribution - fixed_cost
        cumulative += cash_result
        rows.append({
            "scenario": scenario,
            "month": month,
            "active_nodes": nodes,
            "core_units": core_units,
            "trial_units": trial_units,
            "cm2_before_fixed_inr": round(contribution, 2),
            "fixed_cost_inr": round(fixed_cost, 2),
            "monthly_cash_result_inr": round(cash_result, 2),
            "cumulative_cash_result_inr": round(cumulative, 2),
        })
    return rows


def write_csv(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = load_assumptions()
    scenarios = ["downside", "base", "upside"]
    packs = ["Trial pack", "Core pack"]
    economics = [pack_economics(data, pack, scenario) for scenario in scenarios for pack in packs]
    months = [row for scenario in scenarios for row in monthly_plan(data, scenario)]
    write_csv(OUTPUT / "scenario-summary.csv", economics)
    write_csv(OUTPUT / "monthly-plan.csv", months)
    print(f"Wrote {len(economics)} pack scenarios and {len(months)} monthly rows to {OUTPUT}")


if __name__ == "__main__":
    main()

