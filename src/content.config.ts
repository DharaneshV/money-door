import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const programs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/programs" }),
  schema: z.object({
    code: z.enum(["MDC1", "MDC2", "MDC3"]),
    name: z.string(), // e.g. "Foundation Trader"
    tagline: z.string(),
    duration: z.string(), // "1 Month" / "6 Months" / "12 Months"
    // What the student actually pays today, after the standing discount.
    price: z.number(),
    // The undiscounted fee. Rendered struck-through beside `price` so the
    // saving is visible. Omit on a program that isn't discounted.
    listPrice: z.number().optional(),
    currency: z.string().default("USD"),
    priceLabel: z.string().optional(), // e.g. "Free" override
    order: z.number(),
    // Short single-line version — used by the compact tab selector.
    idealFor: z.string().optional(),
    highlights: z.array(z.string()),
    outcome: z.string(),
    // Spec-sheet fields surfaced by the tabbed course selector. Optional so
    // adding them can't break an existing entry.
    mentorship: z.string().optional(),
    format: z.string().optional(),
    level: z.string().optional(),
    // One-word position in the MDC progression — Learn → Apply → Master.
    // Gives visitors a reason to read all three as a path rather than three
    // unrelated products.
    stage: z.string().optional(),

    // ---- Full curriculum detail, rendered on the /courses/mdcN page only ----
    // All optional so an entry without them still validates.
    //
    // Checklist version of `idealFor`, for the full detail page.
    idealForList: z.array(z.string()).optional(),
    // Named blocks of topics, e.g. { title: "Risk Management Fundamentals",
    // items: ["Position sizing", "Lot size calculation", ...] }.
    curriculum: z
      .array(
        z.object({
          title: z.string(),
          items: z.array(z.string()),
        })
      )
      .optional(),
    // The named Money Door strategy models (DPR, DPC, EPR, EPC, GPR, GPC) —
    // MDC2 and MDC3 only.
    strategyModels: z
      .array(
        z.object({
          abbr: z.string(), // "PR"
          name: z.string(), // "Point of Reversal"
          description: z.string(),
        })
      )
      .optional(),
    // What's included / bonuses. `description` optional for a one-line item.
    //
    // COMPLIANCE: never phrase a prop-firm account as "FREE $X" — that reads
    // as a guaranteed cash value. Use "sponsored ... evaluation account,
    // subject to academy terms and partner availability" instead, which is
    // both accurate and doesn't collapse if a partner or offer changes.
    included: z
      .array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
        })
      )
      .optional(),

    // Enrolment benefits carrying a headline money value — the "free
    // giveaways" shown in the offer block and the comparison table.
    //
    // COMPLIANCE: `conditional` marks a benefit that depends on a third-party
    // prop firm honouring its own evaluation rules. Anything flagged here is
    // rendered with an asterisk and the funded-account disclaimer, and must
    // never be described as guaranteed funding, guaranteed profit or risk-free.
    // Terse cell values for the Quick Course Comparison table. Held separately
    // from `bonuses` because the table needs short labels ("$5,000 two-step")
    // where the offer block needs a full explanatory sentence.
    comparison: z
      .object({
        copyTradingFee: z.string(),
        fundedAccount: z.string(),
        propFirmTraining: z.string(),
      })
      .optional(),

    bonuses: z
      .array(
        z.object({
          title: z.string(),
          value: z.string(), // "$100 FREE", "Included"
          description: z.string().optional(),
          conditional: z.boolean().default(false),
        })
      )
      .optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    category: z.enum([
      "Risk Management",
      "Trading Psychology",
      "Beginner Guides",
      "Gold Market Analysis",
      "Strategy",
    ]),
    draft: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/faq" }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    studentName: z.string(),
    quote: z.string(),
    rating: z.number().min(1).max(5).default(5),
    // Gate — keep false until the client sends real student reviews. See plan's
    // "Open items" #2 (testimonials) for why we never ship invented names/quotes.
    published: z.boolean().default(false),
  }),
});

export const collections = { programs, blog, faq, testimonials };
