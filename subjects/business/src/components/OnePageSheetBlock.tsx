"use client";

import React, { useId, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  ChartColumn,
  Check,
  ClipboardList,
  Clock,
  Coins,
  Columns2,
  Factory,
  Gauge,
  Globe,
  GraduationCap,
  Handshake,
  Landmark,
  Layers,
  LayoutGrid,
  Leaf,
  Lightbulb,
  Lock,
  LockOpen,
  Megaphone,
  MessageSquare,
  Mountain,
  Network,
  Package,
  Percent,
  Recycle,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Table2,
  Tag,
  Target,
  TrendingUp,
  TriangleAlert,
  Truck,
  UserCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  SheetBlock,
  SheetColumn,
  SheetIconName,
  SheetPoint,
  SheetTone,
  SheetVisual,
  SheetVisualItem,
} from "../lib/data/one-page-sheets";

/* ========================================================= */
/* ICON SYSTEM                                               */
/* ========================================================= */

const ICONS: Record<SheetIconName, LucideIcon> = {
  alert: TriangleAlert,
  arrow: ArrowRight,
  banknote: Banknote,
  book: BookOpen,
  briefcase: Briefcase,
  building: Building2,
  calculator: Calculator,
  cash: Banknote,
  chart: ChartColumn,
  check: Check,
  clipboard: ClipboardList,
  clock: Clock,
  coins: Coins,
  cycle: RefreshCw,
  factory: Factory,
  gear: Gauge,
  globe: Globe,
  graduation: GraduationCap,
  handshake: Handshake,
  landmark: Landmark,
  layers: Layers,
  leaf: Leaf,
  lightbulb: Lightbulb,
  lock: Lock,
  megaphone: Megaphone,
  message: MessageSquare,
  mountain: Mountain,
  network: Network,
  package: Package,
  percent: Percent,
  recycle: Recycle,
  scale: Scale,
  search: Search,
  shield: ShieldCheck,
  spark: Sparkles,
  store: Store,
  tag: Tag,
  target: Target,
  trending: TrendingUp,
  truck: Truck,
  unlock: LockOpen,
  userCheck: UserCheck,
  users: Users,
  zap: Zap,
};

const SECTION_ICONS: Record<string, SheetIconName> = {
  "1": "briefcase",
  "2": "users",
  "3": "megaphone",
  "4": "factory",
  "5": "calculator",
  "6": "globe",
};

const VISUAL_ICONS: Record<SheetVisual["kind"], SheetIconName> = {
  formula: "calculator",
  flow: "arrow",
  quad: "layers",
  contrast: "scale",
  table: "clipboard",
  metrics: "calculator",
  pills: "tag",
  channels: "truck",
  chart: "chart",
  waterfall: "chart",
  externality: "globe",
};

const TONES: Record<
  SheetTone,
  { surface: string; border: string; accent: string; chip: string; fill: string }
> = {
  green: {
    surface: "bg-[var(--sheet-sage)]",
    border: "border-[var(--sheet-sage-line)]",
    accent: "text-[#4f6b3a] dark:text-[#c9dfb2]",
    chip: "bg-white/70 text-[#38532f] dark:bg-black/20 dark:text-[#d4e6bd]",
    fill: "var(--sheet-sage)",
  },
  sage: {
    surface: "bg-[var(--sheet-surface)]",
    border: "border-[var(--sheet-sage-line)]",
    accent: "text-[#59724a] dark:text-[#b9d3a3]",
    chip: "bg-white/70 text-[#38532f] dark:bg-black/20 dark:text-[#d4e6bd]",
    fill: "var(--sheet-surface)",
  },
  rose: {
    surface: "bg-[var(--sheet-rose)]",
    border: "border-[var(--sheet-rose-line)]",
    accent: "text-[#97532b] dark:text-[#e6b39b]",
    chip: "bg-white/70 text-[#7c3f25] dark:bg-black/20 dark:text-[#e6b39b]",
    fill: "var(--sheet-rose)",
  },
  sand: {
    surface: "bg-[var(--sheet-sand)]",
    border: "border-[var(--sheet-sand-line)]",
    accent: "text-[#8a6a33] dark:text-[#e0c58f]",
    chip: "bg-white/70 text-[#6f5426] dark:bg-black/20 dark:text-[#e0c58f]",
    fill: "var(--sheet-sand)",
  },
};

function SheetIcon({
  name,
  className = "h-4 w-4",
}: {
  name?: SheetIconName;
  className?: string;
}) {
  const Icon = name ? ICONS[name] : Lightbulb;
  return <Icon aria-hidden="true" className={className} />;
}

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`h-2 w-2 shrink-0 ${className}`}
    >
      <path d="M6 0.7 11.3 6 6 11.3 0.7 6Z" fill="currentColor" />
    </svg>
  );
}

/* ========================================================= */
/* TEXT HIGHLIGHTS                                           */
/* ========================================================= */

export function SheetRichText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong
            key={index}
            className="font-semibold text-[var(--ink)] dark:text-white"
          >
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}

/* ========================================================= */
/* PRIMITIVE VISUALS                                          */
/* ========================================================= */

type FormulaToken = Extract<SheetVisual, { kind: "formula" }>["tokens"][number];

/** Keep each operator attached to the operand that follows it, so rows never
 *  break with an orphaned “=” or “÷” at the start of a line. */
function groupFormulaTokens(tokens: FormulaToken[]) {
  const groups: { operator?: FormulaToken; token?: FormulaToken }[] = [];
  let pendingOperator: FormulaToken | undefined;

  for (const token of tokens) {
    if (token.kind === "operator") {
      pendingOperator = token;
    } else {
      groups.push({ operator: pendingOperator, token });
      pendingOperator = undefined;
    }
  }
  if (pendingOperator) groups.push({ operator: pendingOperator });
  return groups;
}

function FormulaVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "formula" }>;
}) {
  const groups = groupFormulaTokens(visual.tokens);

  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-stretch">
      {groups.map((group, index) => {
        const token = group.token;
        const operator = group.operator;
        const isResult = token?.kind === "result";

        return (
          <div
            key={index}
            className="flex min-w-0 flex-1 items-stretch gap-1.5 sm:basis-[150px]"
          >
            {operator && operator.kind === "operator" && (
              <span className="flex w-6 shrink-0 items-center justify-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--sheet-sand-line)] bg-[var(--sheet-sand)] font-mono text-[13px] font-bold leading-none text-[#97532b] dark:text-[#e6b39b]">
                  {operator.value}
                </span>
              </span>
            )}
            {token && token.kind !== "operator" && (
              <div
                className={`flex min-h-[44px] min-w-0 flex-1 flex-col justify-center rounded-lg border px-2.5 py-2 text-center ${
                  isResult
                    ? "border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)]"
                    : "border-[var(--line)] bg-[var(--white)] dark:bg-neutral-900"
                }`}
              >
                <div
                  className={`text-[11px] font-bold leading-snug ${
                    isResult
                      ? "text-[var(--green)] dark:text-[#dce9c8]"
                      : "text-[var(--ink)] dark:text-white"
                  }`}
                >
                  {token.label}
                </div>
                <div className="mt-0.5 text-[9px] leading-snug text-[var(--muted)] dark:text-neutral-400">
                  {token.text}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FlowVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "flow" }>;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-stretch">
      {visual.steps.map((step, index) => {
        const tone = TONES[step.tone ?? (index % 2 === 0 ? "green" : "sand")];
        return (
          <React.Fragment key={index}>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--white)] px-2.5 py-2 dark:bg-neutral-900 sm:flex-col sm:justify-start sm:text-center">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${tone.surface} ${tone.border} ${tone.accent}`}
              >
                <SheetIcon name={step.icon} className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold leading-tight text-[var(--ink)] dark:text-white">
                  {step.title}
                </div>
                <div className="mt-0.5 text-[9px] leading-snug text-[var(--muted)] dark:text-neutral-400">
                  {step.text}
                </div>
              </div>
            </div>
            {index < visual.steps.length - 1 && (
              <div className="flex items-center justify-center text-[#97532b] dark:text-[#e6b39b]">
                <ArrowRight className="hidden h-4 w-4 shrink-0 sm:block" />
                <ArrowDown className="h-4 w-4 shrink-0 sm:hidden" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function QuadVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "quad" }>;
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {visual.items.map((item, index) => {
        const tone =
          TONES[item.tone ?? (["green", "sand", "rose", "sage"] as SheetTone[])[index % 4]];
        return (
          <div
            key={index}
            className={`rounded-lg border p-2.5 ${tone.surface} ${tone.border}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md bg-white/70 dark:bg-black/20 ${tone.accent}`}
              >
                <SheetIcon name={item.icon} className="h-3.5 w-3.5" />
              </span>
              {item.meta && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${tone.chip}`}
                >
                  {item.meta}
                </span>
              )}
            </div>
            <div className="mt-1.5 text-[11px] font-bold text-[var(--ink)] dark:text-white">
              {item.title}
            </div>
            {item.text && (
              <div className="mt-0.5 text-[9.5px] leading-snug text-[var(--muted)] dark:text-neutral-300">
                {item.text}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ContrastVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "contrast" }>;
}) {
  const gridClass =
    visual.columns.length >= 3 ? "lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className={`grid gap-2.5 ${gridClass}`}>
      {visual.columns.map((column: SheetColumn, index) => {
        const tone = TONES[column.tone ?? "green"];
        return (
          <div
            key={index}
            className={`rounded-lg border p-2.5 ${tone.surface} ${tone.border}`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/70 dark:bg-black/20 ${tone.accent}`}
              >
                <SheetIcon name={column.icon} className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold leading-tight text-[var(--ink)] dark:text-white">
                  {column.title}
                </div>
                {column.subtitle && (
                  <div className="mt-0.5 text-[8.5px] font-medium leading-snug text-[var(--muted)] dark:text-neutral-400">
                    {column.subtitle}
                  </div>
                )}
              </div>
            </div>
            <ul className="mt-2 space-y-1.5">
              {column.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-1.5">
                  <Diamond className={`mt-[3px] ${tone.accent}`} />
                  <SheetRichText
                    text={item}
                    className="text-[9.5px] leading-snug text-[var(--muted)] dark:text-neutral-300"
                  />
                </li>
              ))}
            </ul>
            {column.footer && (
              <div className="mt-2 rounded-md border border-[var(--line)] bg-white/55 px-2 py-1 text-[8.5px] leading-snug text-[var(--muted)] dark:bg-black/15 dark:text-neutral-300">
                <SheetRichText text={column.footer} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TableVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "table" }>;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-[var(--line)] bg-[var(--white)] dark:bg-neutral-900">
      <table className="w-full min-w-[340px] sm:min-w-0 border-collapse text-left text-[8.5px]">
        <thead>
          <tr>
            {visual.headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="border-b border-[var(--sheet-blush-line)] bg-[var(--sheet-blush)] px-2 py-1 font-mono text-[7.5px] font-bold uppercase tracking-[0.06em] text-[var(--green)] dark:text-[#e7c9cf]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visual.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 1
                  ? "bg-[var(--sheet-surface)] dark:bg-[#171d19]"
                  : "bg-[var(--white)] dark:bg-neutral-900"
              }
            >
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th
                    key={cellIndex}
                    scope="row"
                    className="border-b border-[var(--line)] px-2 py-1 align-top text-[8.5px] font-bold leading-snug text-[var(--ink)] dark:text-white"
                  >
                    <SheetRichText text={cell} />
                  </th>
                ) : (
                  <td
                    key={cellIndex}
                    className="border-b border-[var(--line)] px-2 py-1 align-top text-[8.5px] leading-snug text-[var(--muted)] dark:text-neutral-300"
                  >
                    <SheetRichText text={cell} />
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricsVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "metrics" }>;
}) {
  return (
    <div
      className={`grid gap-2 ${
        visual.items.length >= 3
          ? "sm:grid-cols-2 xl:grid-cols-3"
          : "sm:grid-cols-2"
      }`}
    >
      {visual.items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-[var(--line)] bg-[var(--white)] p-2.5 dark:bg-neutral-900"
        >
          <div className="text-[9.5px] font-bold leading-tight text-[var(--green)] dark:text-[#dce9c8]">
            {item.label}
          </div>
          <div className="mt-1 rounded-md border border-[var(--line)] bg-[var(--sheet-surface)] px-2 py-1.5 font-mono text-[9.5px] font-semibold leading-snug text-[var(--ink)] dark:text-white">
            {item.formula}
          </div>
          {item.note && (
            <div className="mt-1 text-[8.5px] leading-snug text-[var(--muted)] dark:text-neutral-400">
              {item.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PillsVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "pills" }>;
}) {
  const gridClass =
    visual.columns === 4
      ? "sm:grid-cols-2 xl:grid-cols-4"
      : visual.columns === 3
        ? "sm:grid-cols-2 xl:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <div className={`grid gap-1.5 ${gridClass}`}>
      {visual.items.map((item, index) => {
        const tone =
          TONES[item.tone ?? (["green", "sand", "rose", "sage"] as SheetTone[])[index % 4]];
        return (
          <div
            key={index}
            className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 ${tone.surface} ${tone.border}`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 dark:bg-black/20 ${tone.accent}`}
            >
              <SheetIcon name={item.icon} className="h-3 w-3" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-bold leading-tight text-[var(--ink)] dark:text-white">
                {item.title}
              </div>
              {item.text && (
                <div className="mt-0.5 text-[8.5px] leading-snug text-[var(--muted)] dark:text-neutral-300">
                  {item.text}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChannelsVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "channels" }>;
}) {
  return (
    <div className="space-y-1.5">
      {visual.channels.map((channel, channelIndex) => (
        <div
          key={channelIndex}
          className="rounded-lg border border-[var(--line)] bg-[var(--white)] px-2.5 py-2 dark:bg-neutral-900"
        >
          <div className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--muted)] dark:text-neutral-400">
            {channel.label}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {channel.steps.map((step, stepIndex) => (
              <React.Fragment key={stepIndex}>
                <span className="rounded-full border border-[var(--line)] bg-[var(--sheet-surface)] px-2 py-0.5 text-[9px] font-semibold text-[var(--ink)] dark:text-white">
                  {step}
                </span>
                {stepIndex < channel.steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-[#97532b] dark:text-[#e6b39b]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WaterfallVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "waterfall" }>;
}) {
  return (
    <div className="space-y-1.5">
      {visual.steps.map((step, index) => {
        const tone = TONES[step.tone];
        const isResult = step.label.includes("=");
        return (
          <div
            key={index}
            className={`flex items-center gap-2 ${isResult ? "sm:pl-4" : ""}`}
          >
            <div className="flex min-h-7 w-[112px] shrink-0 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--white)] px-2 py-1 text-center font-mono text-[8.5px] font-bold leading-tight text-[var(--ink)] dark:bg-neutral-900 dark:text-white">
              {step.label}
            </div>
            <div
              className={`flex min-h-7 flex-1 items-center rounded-md border px-2.5 py-1 text-[9.5px] font-semibold leading-snug text-[var(--ink)] dark:text-white ${tone.surface} ${tone.border}`}
            >
              {step.formula}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExternalityVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "externality" }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_128px_1fr] sm:items-center">
      <div
        className={`order-2 rounded-lg border p-2.5 sm:order-none ${TONES.rose.surface} ${TONES.rose.border}`}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#97532b] dark:text-[#e6b39b]">
          <TriangleAlert className="h-3.5 w-3.5" />
          External costs
        </div>
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {visual.costs.map((cost) => (
            <li
              key={cost}
              className="rounded-full bg-white/65 px-2 py-0.5 text-[8.5px] font-semibold text-[#7c3f25] dark:bg-black/20 dark:text-[#e6b39b]"
            >
              {cost}
            </li>
          ))}
        </ul>
      </div>

      <div className="order-1 rounded-lg border border-[var(--green)] bg-[var(--sheet-blush)] p-2.5 text-center sm:order-none">
        <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[var(--green)] dark:bg-black/20 dark:text-[#e4eeb2]">
          <Factory className="h-4 w-4" />
        </span>
        <div className="mt-1 text-[10px] font-bold leading-tight text-[var(--green)] dark:text-white">
          Business activity
        </div>
        <div className="mt-0.5 text-[8px] leading-snug text-[var(--sheet-ink-soft)]">
          Effects on outsiders
        </div>
      </div>

      <div
        className={`order-3 rounded-lg border p-2.5 sm:order-none ${TONES.green.surface} ${TONES.green.border}`}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4f6b3a] dark:text-[#c9dfb2]">
          <Sparkles className="h-3.5 w-3.5" />
          External benefits
        </div>
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {visual.benefits.map((benefit) => (
            <li
              key={benefit}
              className="rounded-full bg-white/65 px-2 py-0.5 text-[8.5px] font-semibold text-[#38532f] dark:bg-black/20 dark:text-[#d4e6bd]"
            >
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ========================================================= */
/* INTERACTIVE CHARTS                                         */
/* ========================================================= */

function StageButtons({
  stages,
  active,
  onChange,
}: {
  stages: SheetVisualItem[];
  active: number;
  onChange: (index: number) => void;
}) {
  return (
    <div
      className={`mt-2 grid gap-1.5 ${
        stages.length >= 5 ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"
      }`}
    >
      {stages.map((stage, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(index)}
          aria-pressed={active === index}
          className={`rounded-md border px-2 py-1.5 text-[9px] font-bold transition-colors ${
            active === index
              ? "border-[var(--green)] bg-[var(--green)] text-[#e4eeb2]"
              : "border-[var(--line)] bg-[var(--white)] text-[var(--muted)] hover:bg-[var(--sheet-surface)] dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          }`}
        >
          {stage.title}
        </button>
      ))}
    </div>
  );
}

function StageDetail({ stage }: { stage?: SheetVisualItem }) {
  if (!stage) return null;
  const tone = TONES[stage.tone ?? "green"];
  return (
    <div
      className={`mt-2 rounded-lg border p-2.5 ${tone.surface} ${tone.border}`}
    >
      <div className="text-[10px] font-bold text-[var(--ink)] dark:text-white">
        {stage.title}
      </div>
      {stage.text && (
        <SheetRichText
          text={stage.text}
          className="mt-0.5 block text-[9.5px] leading-snug text-[var(--muted)] dark:text-neutral-300"
        />
      )}
      {stage.meta && (
        <SheetRichText
          text={stage.meta}
          className="mt-1 block text-[8.5px] leading-snug text-[var(--muted)] dark:text-neutral-400"
        />
      )}
    </div>
  );
}

function BusinessCycleChart({
  stages,
}: {
  stages: SheetVisualItem[];
}) {
  const [active, setActive] = useState(0);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const points = [
    { x: 110, y: 140 },
    { x: 250, y: 65 },
    { x: 390, y: 120 },
    { x: 530, y: 185 },
  ];
  const wave =
    "M 40 175 C 70 175 80 150 110 140 C 155 125 190 75 250 65 C 300 58 340 100 390 120 C 440 140 480 190 530 185 C 565 182 590 165 610 150";
  const area = `${wave} L 610 220 L 40 220 Z`;

  return (
    <div className="grid gap-2.5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
      <div className="min-w-0">
        <svg
          viewBox="0 0 640 260"
          className="mx-auto h-auto max-h-[160px] w-full max-w-[460px] text-[var(--green)] dark:text-[#cfe3b8]"
          role="img"
          aria-label="The business cycle moving through growth, boom, recession and slump"
        >
        <defs>
          <linearGradient id={`cycle-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <line
          x1="40"
          y1="220"
          x2="610"
          y2="220"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeDasharray="4 5"
        />
        <path d={area} fill={`url(#cycle-${id})`} />
        <path
          d={wave}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={active === index ? 8 : 6}
            fill={active === index ? "#97532b" : "var(--sheet-surface)"}
            stroke={active === index ? "#97532b" : "currentColor"}
            strokeWidth="2.5"
          />
        ))}
        <text
          x="600"
          y="246"
          textAnchor="end"
          fill="currentColor"
          opacity="0.55"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          TIME →
        </text>
        <text
          x="14"
          y="132"
          transform="rotate(-90 14 132)"
          fill="currentColor"
          opacity="0.55"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          SALES / GDP
        </text>
        </svg>
      </div>
      <div className="min-w-0">
        <div className="hidden items-center justify-between font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--muted)] dark:text-neutral-400 lg:flex">
          <span>Select a stage</span>
          <span>Tap to inspect</span>
        </div>
        <StageButtons stages={stages} active={active} onChange={setActive} />
        <StageDetail stage={stages[active]} />
      </div>
    </div>
  );
}

function ProductLifeCycleChart({
  stages,
}: {
  stages: SheetVisualItem[];
}) {
  const [active, setActive] = useState(0);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const points = [
    { x: 110, y: 196 },
    { x: 270, y: 91 },
    { x: 430, y: 70 },
    { x: 560, y: 158 },
  ];
  const wave =
    "M 60 205 C 95 202 120 195 155 180 C 200 160 220 120 275 90 C 315 70 365 65 420 70 C 470 75 500 100 545 140 C 575 165 590 190 615 205";
  const area = `${wave} L 615 225 L 60 225 Z`;

  return (
    <div className="grid gap-2.5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
      <div className="min-w-0">
        <svg
          viewBox="0 0 640 260"
          className="mx-auto h-auto max-h-[160px] w-full max-w-[460px] text-[var(--green)] dark:text-[#cfe3b8]"
          role="img"
          aria-label="The product life cycle moving through introduction, growth, maturity and decline"
        >
        <defs>
          <linearGradient id={`plc-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <line
          x1="45"
          y1="225"
          x2="615"
          y2="225"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeDasharray="4 5"
        />
        <path d={area} fill={`url(#plc-${id})`} />
        <path
          d={wave}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={active === index ? 8 : 6}
            fill={active === index ? "#97532b" : "var(--sheet-surface)"}
            stroke={active === index ? "#97532b" : "currentColor"}
            strokeWidth="2.5"
          />
        ))}
        <text
          x="608"
          y="248"
          textAnchor="end"
          fill="currentColor"
          opacity="0.55"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          TIME →
        </text>
        <text
          x="14"
          y="140"
          transform="rotate(-90 14 140)"
          fill="currentColor"
          opacity="0.55"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          SALES
        </text>
        </svg>
      </div>
      <div className="min-w-0">
        <div className="hidden items-center justify-between font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--muted)] dark:text-neutral-400 lg:flex">
          <span>Select a stage</span>
          <span>Tap to inspect</span>
        </div>
        <StageButtons stages={stages} active={active} onChange={setActive} />
        <StageDetail stage={stages[active]} />
      </div>
    </div>
  );
}

function MaslowChart({ stages }: { stages: SheetVisualItem[] }) {
  const [active, setActive] = useState(Math.max(stages.length - 1, 0));
  const tiers = [
    { points: "230,30 370,30 400,82 200,82", labelY: 61 },
    { points: "200,82 400,82 430,134 170,134", labelY: 113 },
    { points: "170,134 430,134 460,186 140,186", labelY: 165 },
    { points: "140,186 460,186 490,238 110,238", labelY: 217 },
    { points: "110,238 490,238 520,290 80,290", labelY: 269 },
  ];

  return (
    <div className="grid gap-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
      <div className="min-w-0">
        <div className="mb-1 flex items-center justify-between font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--muted)] dark:text-neutral-400 md:hidden">
          <span>Tap a tier</span>
          <span>Top ↑</span>
        </div>
        <div className="overflow-x-auto">
          <svg
            viewBox="55 10 490 300"
            className="mx-auto h-auto max-h-[175px] w-full max-w-[360px] text-[var(--ink)] dark:text-white"
            role="img"
            aria-label="Maslow's hierarchy of needs, from physiological needs at the base to self-actualisation at the top"
          >
        {tiers.map((tier, displayIndex) => {
          const stageIndex = Math.max(stages.length - 1 - displayIndex, 0);
          const stage = stages[stageIndex];
          const tone = TONES[stage?.tone ?? "green"];
          const isActive = active === stageIndex;
          return (
            <g
              key={displayIndex}
              role="button"
              tabIndex={0}
              aria-label={stage?.title ?? "Maslow tier"}
              aria-pressed={isActive}
              onClick={() => setActive(stageIndex)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(stageIndex);
                }
              }}
              className="cursor-pointer outline-none"
            >
              <polygon
                points={tier.points}
                style={{ fill: tone.fill }}
                stroke={isActive ? "#97532b" : "var(--sheet-blush-line)"}
                strokeWidth={isActive ? 3 : 1}
              />
              <text
                x="300"
                y={tier.labelY}
                textAnchor="middle"
                fill="currentColor"
                fontSize="12"
                fontWeight="700"
              >
                {stage?.title}
              </text>
            </g>
          );
        })}
          </svg>
        </div>
        <div className="md:hidden">
          <StageButtons stages={stages} active={active} onChange={setActive} />
        </div>
      </div>
      <div className="min-w-0">
        <div className="mb-1 hidden items-center justify-between font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--muted)] dark:text-neutral-400 md:flex">
          <span>Tap a tier to inspect</span>
          <span>Top ↑</span>
        </div>
        <StageDetail stage={stages[active]} />
      </div>
    </div>
  );
}

function OrgChart() {
  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 640 235"
          className="mx-auto h-auto max-h-[165px] w-full min-w-[360px] max-w-[540px] text-[var(--green)] dark:text-[#cfe3b8] sm:min-w-0"
          role="img"
          aria-label="Organisation chart: the board or CEO at the top, functional managers in the middle and teams below. The chain of command runs downward; span of control describes how many people a manager supervises."
        >
      <g
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        fill="none"
      >
        <line x1="320" y1="55" x2="320" y2="72" />
        <line x1="135" y1="72" x2="505" y2="72" />
        <line x1="135" y1="72" x2="135" y2="88" />
        <line x1="320" y1="72" x2="320" y2="88" />
        <line x1="505" y1="72" x2="505" y2="88" />
        <line x1="130" y1="128" x2="130" y2="146" />
        <line x1="92" y1="146" x2="168" y2="146" />
        <line x1="92" y1="146" x2="92" y2="164" />
        <line x1="168" y1="146" x2="168" y2="164" />
        <line x1="315" y1="128" x2="315" y2="146" />
        <line x1="277" y1="146" x2="353" y2="146" />
        <line x1="277" y1="146" x2="277" y2="164" />
        <line x1="353" y1="146" x2="353" y2="164" />
        <line x1="510" y1="128" x2="510" y2="146" />
        <line x1="472" y1="146" x2="548" y2="146" />
        <line x1="472" y1="146" x2="472" y2="164" />
        <line x1="548" y1="146" x2="548" y2="164" />
      </g>

      <g>
        <rect
          x="240"
          y="15"
          width="160"
          height="40"
          rx="8"
          fill="var(--sheet-blush)"
          stroke="currentColor"
          strokeOpacity="0.35"
        />
        <text
          x="320"
          y="39"
          textAnchor="middle"
          fill="currentColor"
          fontSize="11"
          fontWeight="700"
        >
          Board / CEO
        </text>

        {[
          { x: 60, label: "Marketing" },
          { x: 245, label: "Operations" },
          { x: 430, label: "Finance" },
        ].map((manager) => (
          <g key={manager.label}>
            <rect
              x={manager.x}
              y="88"
              width="150"
              height="40"
              rx="7"
              fill="var(--sheet-surface)"
              stroke="currentColor"
              strokeOpacity="0.35"
            />
            <text
              x={manager.x + 75}
              y="112"
              textAnchor="middle"
              fill="currentColor"
              fontSize="10"
              fontWeight="700"
            >
              {manager.label}
            </text>
          </g>
        ))}

        {[
          { x: 60, labels: ["Team A", "Team B"] },
          { x: 245, labels: ["Team C", "Team D"] },
          { x: 430, labels: ["Team E", "Team F"] },
        ].map((group) =>
          group.labels.map((label, index) => {
            const boxX = group.x + (index === 0 ? 7 : 83);
            return (
              <g key={label}>
                <rect
                  x={boxX}
                  y="164"
                  width="60"
                  height="30"
                  rx="5"
                  fill="var(--sheet-sage)"
                  stroke="currentColor"
                  strokeOpacity="0.28"
                />
                <text
                  x={boxX + 30}
                  y="183"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="8"
                  fontWeight="600"
                >
                  {label}
                </text>
              </g>
            );
          })
        )}
      </g>

      <g
        fill="currentColor"
        opacity="0.5"
        fontFamily="var(--font-mono)"
        fontSize="8"
      >
        <text x="8" y="38">LEVEL 1</text>
        <text x="8" y="111">LEVEL 2</text>
        <text x="8" y="182">LEVEL 3</text>
      </g>
        </svg>
      </div>
      <p className="mt-1 text-center font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--muted)] dark:text-neutral-400 sm:hidden">
        Swipe chart →
      </p>
    </div>
  );
}

function BreakEvenChart() {
  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 640 300"
          className="mx-auto h-auto max-h-[185px] w-full min-w-[360px] max-w-[520px] text-[var(--green)] dark:text-[#cfe3b8] sm:min-w-0"
          role="img"
          aria-label="Break-even chart: total cost starts at fixed costs, revenue starts at zero, and the break-even point is where the revenue and total cost lines cross. The margin of safety is the gap between current output and break-even output."
        >
        <line
          x1="70"
          y1="250"
          x2="610"
          y2="250"
          stroke="currentColor"
          strokeOpacity="0.35"
        />
        <line
          x1="70"
          y1="250"
          x2="70"
          y2="30"
          stroke="currentColor"
          strokeOpacity="0.35"
        />

        <polygon
          points="70,245 324,149 70,185"
          fill="var(--sheet-rose)"
          opacity="0.9"
        />
        <polygon
          points="324,149 600,45 600,110"
          fill="var(--sheet-sage)"
          opacity="0.95"
        />

        <line
          x1="70"
          y1="185"
          x2="600"
          y2="185"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeDasharray="5 4"
        />
        <line
          x1="70"
          y1="185"
          x2="600"
          y2="110"
          stroke="#97532b"
          strokeWidth="2.5"
        />
        <line
          x1="70"
          y1="245"
          x2="600"
          y2="45"
          stroke="currentColor"
          strokeWidth="2.5"
        />

        <line
          x1="324"
          y1="149"
          x2="324"
          y2="250"
          stroke="#97532b"
          strokeOpacity="0.55"
          strokeDasharray="4 4"
        />
        <circle
          cx="324"
          cy="149"
          r="7"
          fill="#97532b"
          stroke="var(--sheet-surface)"
          strokeWidth="3"
        />

        <path
          d="M 324 266 L 324 272 L 500 272 L 500 266"
          fill="none"
          stroke="#97532b"
          strokeWidth="1.5"
        />
        <text
          x="412"
          y="288"
          textAnchor="middle"
          fill="#97532b"
          fontSize="9"
          fontWeight="700"
        >
          Margin of safety
        </text>

        <text
          x="330"
          y="138"
          fill="#97532b"
          fontSize="9"
          fontWeight="700"
        >
          Break-even
        </text>
        <text
          x="540"
          y="58"
          textAnchor="end"
          fill="currentColor"
          fontSize="9"
          fontWeight="700"
        >
          Sales revenue
        </text>
        <text
          x="540"
          y="124"
          textAnchor="end"
          fill="#97532b"
          fontSize="9"
          fontWeight="700"
        >
          Total cost
        </text>
        <text
          x="540"
          y="178"
          textAnchor="end"
          fill="currentColor"
          opacity="0.55"
          fontSize="9"
          fontWeight="600"
        >
          Fixed costs
        </text>

        <text
          x="604"
          y="266"
          textAnchor="end"
          fill="currentColor"
          opacity="0.55"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          OUTPUT →
        </text>
        <text
          x="14"
          y="140"
          transform="rotate(-90 14 140)"
          fill="currentColor"
          opacity="0.55"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          COSTS / REVENUE
        </text>
        </svg>
      </div>
      <p className="mt-1 text-center font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--muted)] dark:text-neutral-400 sm:hidden">
        Swipe chart →
      </p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[8px] font-bold uppercase tracking-wide text-[var(--muted)] dark:text-neutral-400">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
          Revenue
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#97532b]" />
          Total cost
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full border border-dashed border-current" />
          Fixed cost
        </span>
      </div>
    </div>
  );
}

function ChartVisual({
  visual,
}: {
  visual: Extract<SheetVisual, { kind: "chart" }>;
}) {
  const stages = visual.stages ?? [];
  switch (visual.chart) {
    case "businessCycle":
      return <BusinessCycleChart stages={stages} />;
    case "productLifeCycle":
      return <ProductLifeCycleChart stages={stages} />;
    case "maslow":
      return <MaslowChart stages={stages} />;
    case "orgChart":
      return <OrgChart />;
    case "breakEven":
      return <BreakEvenChart />;
    default:
      return null;
  }
}

/* ========================================================= */
/* VISUAL WRAPPER                                             */
/* ========================================================= */

function VisualBody({ visual }: { visual: SheetVisual }) {
  switch (visual.kind) {
    case "formula":
      return <FormulaVisual visual={visual} />;
    case "flow":
      return <FlowVisual visual={visual} />;
    case "quad":
      return <QuadVisual visual={visual} />;
    case "contrast":
      return <ContrastVisual visual={visual} />;
    case "table":
      return <TableVisual visual={visual} />;
    case "metrics":
      return <MetricsVisual visual={visual} />;
    case "pills":
      return <PillsVisual visual={visual} />;
    case "channels":
      return <ChannelsVisual visual={visual} />;
    case "chart":
      return <ChartVisual visual={visual} />;
    case "waterfall":
      return <WaterfallVisual visual={visual} />;
    case "externality":
      return <ExternalityVisual visual={visual} />;
    default:
      return null;
  }
}

function VisualCard({ visual }: { visual: SheetVisual }) {
  return (
    <figure
      className={`min-w-0 rounded-lg border border-[var(--line)] bg-[var(--sheet-surface)] p-2 sm:p-2.5 ${
        visual.wide ? "md:col-span-2" : ""
      }`}
    >
      <figcaption className="mb-1.5 flex items-center gap-1.5 border-b border-dashed border-[var(--line)] pb-1">
        <span className="flex h-4 w-4 items-center justify-center rounded border border-[var(--line)] bg-[var(--white)] text-[var(--green)] dark:bg-neutral-900 dark:text-[#dce9c8]">
          <SheetIcon name={VISUAL_ICONS[visual.kind]} className="h-2.5 w-2.5" />
        </span>
        <span className="text-[8px] font-mono font-bold uppercase tracking-[0.12em] text-[var(--muted)] dark:text-neutral-400">
          {visual.title}
        </span>
      </figcaption>
      <VisualBody visual={visual} />
      {visual.note && (
        <p className="mt-1.5 border-t border-dashed border-[var(--line)] pt-1 text-[8.5px] leading-snug text-[var(--muted)] dark:text-neutral-400">
          <SheetRichText text={visual.note} />
        </p>
      )}
    </figure>
  );
}

/* ========================================================= */
/* SHEET TOPIC BAND                                           */
/* ========================================================= */

function PointItem({ point }: { point: SheetPoint }) {
  return (
    <li className="flex gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-[var(--sheet-surface)]">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)] text-[var(--green)] dark:text-[#dce9c8]">
        <SheetIcon name={point.icon} className="h-2.5 w-2.5" />
      </span>
      <div className="min-w-0">
        <div className="text-[9.5px] font-bold leading-tight text-[var(--ink)] dark:text-white">
          {point.title}
        </div>
        <SheetRichText
          text={point.text}
          className="mt-0.5 block text-[9px] leading-snug text-[var(--muted)] dark:text-neutral-300"
        />
      </div>
    </li>
  );
}

export function OnePageSheetBlockCard({ block }: { block: SheetBlock }) {
  const sectionIcon = SECTION_ICONS[block.code.split(".")[0]] ?? "briefcase";

  return (
    <section
      aria-labelledby={`sheet-block-${block.code}`}
      className="border-b border-dashed border-[var(--line)] pb-3 last:border-b-0 last:pb-0"
    >
      <header className="relative flex flex-wrap items-center justify-between gap-2 overflow-hidden rounded-lg border border-[var(--sheet-blush-line)] bg-[var(--sheet-blush)] px-2.5 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--sheet-blush-line)] bg-white/75 text-[var(--green)] dark:bg-black/20 dark:text-[#e4eeb2]">
            <SheetIcon name={sectionIcon} className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-[var(--green)] px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wide text-[#e4eeb2]">
                {block.code}
              </span>
              <h2
                id={`sheet-block-${block.code}`}
                className="font-academic-serif text-[14px] font-bold leading-tight text-[var(--green)] dark:text-white sm:text-[15.5px]"
              >
                {block.title}
              </h2>
              <span className="hidden text-[8px] font-mono font-semibold uppercase tracking-[0.1em] text-[var(--sheet-ink-soft)] sm:inline">
                · {block.eyebrow}
              </span>
            </div>
          </div>
        </div>
        <div className="shrink-0 font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--sheet-ink-soft)]">
          {block.visuals.length} visuals · {block.points.length} key ideas
        </div>
      </header>

      <div className="mt-2">
        <div className="grid items-start gap-2 md:grid-cols-2">
          {block.visuals.map((visual, index) => (
            <VisualCard key={index} visual={visual} />
          ))}
        </div>

        <ul className="mt-2 grid gap-x-3 gap-y-0.5 sm:grid-cols-2">
          {block.points.map((point, index) => (
            <PointItem key={index} point={point} />
          ))}
        </ul>

        <div className="mt-2 flex items-start gap-2 rounded-lg border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)] px-2.5 py-1.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-[#e4eeb2]">
            <Lightbulb className="h-3 w-3" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="mr-1.5 font-mono text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#4f6b3a] dark:text-[#c9dfb2]">
              Exam takeaway:
            </span>
            <SheetRichText
              text={block.takeaway}
              className="text-[9px] leading-snug text-[var(--ink)] dark:text-neutral-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
