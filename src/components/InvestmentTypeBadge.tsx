import type { InvestmentType } from "../types";
import {
  investmentTypeDescriptions,
  investmentTypePalette,
} from "../lib/investmentType";

export function InvestmentTypeBadge({ type }: { type: InvestmentType }) {
  return (
    <span
      className={"chip text-xs font-semibold " + investmentTypePalette[type]}
      title={investmentTypeDescriptions[type]}
    >
      {type}
    </span>
  );
}
