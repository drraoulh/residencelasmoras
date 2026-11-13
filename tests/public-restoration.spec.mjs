import { test, expect } from "@playwright/test";
test.use({ timezoneId: "Africa/Douala" });
const property = {
  id: "00000000-0000-0000-0000-000000000010",
  nom: "Appartement Horizon",
  type: "Appartement",
  prix: 75000,
  statut: "disponible",
  surface: 85,
  photos: ["/images/gallery-preview-1.jpeg", "/images/gallery-preview-2.jpeg"],
  equipements: ["Wi-Fi", "Parking"],
  description: "Un appartement confortable au cœur de la résidence.",
};
const gallery = [
  {
    id: "one",
    label: "Salon lumineux",
    category: "Intérieurs",
    image_url: "/images/gallery-preview-1.jpeg",
    visible: true,
    sort_order: 1,
  },
  {
    id: "two",
    label: "Résidence",
    category: "Résidence",
    image_url: "/images/hero-lcp.jpeg",
    visible: true,
    sort_order: 2,
  },
];
async function mockPublic(page) {
  const requests = [],
    privateReads = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__openedUrls = [];
    window.open = (url) => {
      window.__openedUrls.push(String(url));
      return null;
    };
  });
  await page.route("https://lasmoras-test.supabase.co/**", async (route) => {
    const req = route.request(),
      url = new URL(req.url());
    let body = [];
    if (url.pathname.includes("/rest/v1/logements"))
      body = req.headers().accept?.includes("vnd.pgrst.object")
        ? property
        : [property];
    else if (url.pathname.includes("/rpc/get_availability_slots")) body = [];
    else if (url.pathname.includes("/rpc/create_reservation_request")) {
      requests.push({ kind: "reservation", body: req.postDataJSON() });
      body = {
        id: "00000000-0000-0000-0000-000000000020",
        confirmToken: "0123456789abcdef0123456789abcdef",
      };
    } else if (
      url.pathname.includes("/rest/v1/contacts") &&
      req.method() === "POST"
    ) {
      requests.push({ kind: "contact", body: req.postDataJSON() });
      body = null;
    } else if (url.pathname.includes("/rest/v1/gallery_images")) body = gallery;
    else if (/\/rest\/v1\/(contacts|reservations)/.test(url.pathname)) {
      privateReads.push(url.pathname);
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Private data" }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  return { requests, privateReads, errors };
}
for (const width of [390, 1365])
  test(`Site historique, liens et avis restaurés à ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const mock = await mockPublic(page);
    await page.goto("http://localhost:5187/");
    await expect(
      page.getByRole("heading", { name: "Ce que disent nos voyageurs" }),
    ).toBeVisible();
    for (const name of [
      "François koron Elat",
      "Emmanuel Djiokeng",
      "Dominique Neveu",
      "Bernadette PEH",
    ])
      await expect(page.getByText(name, { exact: true })).toBeVisible();
    const footer = page.locator("footer");
    for (const [name, prefix] of [
      ["Instagram", "https://www.instagram.com/contactlasmoras"],
      ["Facebook", "https://www.facebook.com/share/v/"],
      ["TikTok", "https://vt.tiktok.com/"],
      ["Google Maps", "https://share.google/"],
    ]) {
      await expect(
        footer.getByRole("link", { name, exact: true }),
      ).toHaveAttribute(
        "href",
        new RegExp("^" + prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );
      await expect(
        footer.getByRole("link", { name, exact: true }),
      ).toHaveAttribute("target", "_blank");
    }
    await expect(footer.locator('a[href="tel:+237689888291"]')).toBeVisible();
    await expect(
      footer.locator('a[href="mailto:contactlasmoras@gmail.com"]'),
    ).toBeVisible();
    await footer.getByRole("link", { name: "Galerie", exact: true }).click();
    await expect(page).toHaveURL(/\/galerie$/);
    await page.getByRole("button", { name: /Salon lumineux/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page
      .locator("footer")
      .getByRole("link", { name: "À propos", exact: true })
      .click();
    await expect(page).toHaveURL(/\/a-propos$/);
    await page
      .locator("footer")
      .getByRole("link", { name: "Contact", exact: true })
      .click();
    await expect(page).toHaveURL(/\/contact$/);
    await page
      .locator("footer")
      .getByRole("link", { name: "Nos logements", exact: true })
      .click();
    await expect(page).toHaveURL(/\/catalogue$/);
    await page
      .getByRole("link", { name: "Voir les détails", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: property.nom, exact: true }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    if (width === 390) {
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page
        .locator("nav:visible")
        .getByRole("link", { name: "Galerie", exact: true })
        .first()
        .click();
      await expect(page).toHaveURL(/\/galerie$/);
      await expect(
        page.getByRole("button", { name: "Menu", exact: true }),
      ).toBeVisible();
    }
    await page.goto("http://localhost:5187/");
    await page.screenshot({
      path: `test-results/restored-home-${width}.png`,
      fullPage: true,
    });
    expect(mock.privateReads).toEqual([]);
    expect(mock.errors).toEqual([]);
  });
test("Demande WhatsApp et message de contact, sans lecture de données privées", async ({
  page,
}) => {
  const mock = await mockPublic(page);
  await page.goto("http://localhost:5187/catalogue");
  await page
    .getByRole("button", { name: "Réserver sur WhatsApp", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Prénom", { exact: true }).fill("Visiteur");
  await dialog.getByLabel("Nom", { exact: true }).fill("Test");
  await dialog.getByLabel("Téléphone", { exact: true }).fill("+237600000000");
  await dialog
    .getByLabel("Email (optionnel)", { exact: true })
    .fill("visitor@example.com");
  const date = new Date();
  date.setDate(date.getDate() + 30);
  const arrival = date.toISOString().slice(0, 10);
  date.setDate(date.getDate() + 3);
  const departure = date.toISOString().slice(0, 10);
  await dialog.getByLabel("Arrivée", { exact: true }).fill(arrival);
  await dialog.getByLabel(/Départ/).fill(departure);
  await dialog
    .getByRole("button", { name: "Enregistrer et ouvrir WhatsApp" })
    .click();
  await expect
    .poll(() => mock.requests.filter((r) => r.kind === "reservation").length)
    .toBe(1);
  await expect
    .poll(() => page.evaluate(() => window.__openedUrls.length))
    .toBe(1);
  await expect(
    dialog.getByRole("link", { name: "Envoyer sur WhatsApp", exact: true }),
  ).toHaveAttribute("href", /^https:\/\/wa.me\/237689888291\?text=/);
  const message = await page.evaluate(() =>
    new URL(window.__openedUrls[0]).searchParams.get("text"),
  );
  expect(message).toContain("Appartement Horizon");
  expect(message).toContain(
    "/confirmer/00000000-0000-0000-0000-000000000020?token=",
  );
  expect(Object.keys(mock.requests[0].body).sort()).toEqual(
    [
      "p_logement_id",
      "p_nom",
      "p_email",
      "p_telephone",
      "p_arrivee",
      "p_depart",
    ].sort(),
  );
  await page.goto("http://localhost:5187/contact");
  await page.getByLabel("Nom complet", { exact: true }).fill("Visiteur Test");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page
    .getByPlaceholder("Précisez votre sujet si besoin")
    .fill("Information");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Bonjour, quels sont vos horaires d’accueil ?");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByText(/Message envoyé avec succès/)).toBeVisible();
  const contact = mock.requests.find((r) => r.kind === "contact");
  expect(Object.keys(contact.body).sort()).toEqual(
    ["nom", "email", "sujet", "message"].sort(),
  );
  expect(mock.privateReads).toEqual([]);
  expect(mock.errors).toEqual([]);
  await page.goto(
    "http://localhost:5187/confirmer/00000000-0000-0000-0000-000000000020?token=0123456789abcdef0123456789abcdef",
  );
  await expect(
    page.getByRole("link", { name: "Se connecter pour confirmer" }),
  ).toBeVisible();
});
