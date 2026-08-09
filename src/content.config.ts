import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const programs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/programs" }),
  schema: z.object({
    code: z.enum(["MDC1", "MDC2", "MDC3"]),
    name: z.string(), // e.g. "Foundation Trader"
    tagline: z.string(),
    duration: z.string(), // "1 Week" / "6 Months" / "12 Months"
    price: z.number(), // 0 / 300 / 1000
    currency: z.string().default("USDT"),
    priceLabel: z.string().optional(), // e.g. "Free" override for MDC1
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
    // The named Money Door strategy models (PR, PC, EPR, EPC, GPR, GPC) —
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
