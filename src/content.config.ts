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
    idealFor: z.string().optional(),
    highlights: z.array(z.string()),
    outcome: z.string(),
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
