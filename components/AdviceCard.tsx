"use client";

export type AdviceTone = "positive" | "warning" | "info";

const TONE_STYLES: Record<AdviceTone, { bg: string; text: string; dot: string }> = {
  positive: { bg: "var(--income-soft)", text: "var(--income)", dot: "#5FA97F" },
  warning: { bg: "var(--expense-soft)", text: "var(--expense)", dot: "#D9789A" },
  info: { bg: "#E6F1FA", text: "#3E7CA6", dot: "#7FB6D9" },
};

export interface Advice {
  tone: AdviceTone;
  title: string;
  body: string;
}

export default function AdviceCard({ advice }: { advice: Advice }) {
  const style = TONE_STYLES[advice.tone];
  return (
    <div
      className="rounded-2xl p-5 border border-rule"
      style={{ background: style.bg }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: style.dot }}
        />
        <p className="text-sm font-medium" style={{ color: style.text }}>
          {advice.title}
        </p>
      </div>
      <p className="text-sm text-ink-soft leading-relaxed">{advice.body}</p>
    </div>
  );
}
