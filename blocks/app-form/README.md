# app-form

Custom **custom** block. Purpose: static rendering of a transactional application form (sign-in, registration, account recovery, contact, claim); submission is not wired to a backend.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per field: label (end with * for required) | type (text, email, tel, number, password, date, search, url, textarea, select, radio, checkbox, checkboxes, toggle, submit, reset, button) | options (list or comma separated) or help text. Any other row is rich content (heading, instructions, links) kept in order. With the Image option, a picture-only row becomes a media column.

## Supported variations

| Variation | Option class |
| --- | --- |
| Light | `light` |
| Dark | `dark` |
| Image | `image` |
| Dark Red | `dark-red` |

## Universal Editor fields

N/A (Document Authoring project)
