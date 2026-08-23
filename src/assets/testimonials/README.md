# Student photos

Drop a student's photo in here and reference it from their testimonial's
`photo:` field — the filename only, e.g. `photo: "ashwant-subbiah.jpg"`.

Expected files right now:

| File                       | Student              |
| -------------------------- | -------------------- |
| `ashwant-subbiah.jpg`      | Ashwant Subbiah      |
| `natarajan-periyasamy.jpg` | Natarajan Periyasamy |

A testimonial whose photo is missing still publishes — the card shows the
student's initials in a gold circle instead, so nothing is held back waiting
on a picture.

- `.jpg`, `.jpeg`, `.png`, `.webp` or `.avif`.
- Upload the original; Astro crops to a square and resizes at build time.
- Roughly square, head-and-shoulders works best.

**Only publish a photo the student has agreed to have on the site.**
