import { test, expect } from "@playwright/test";
const properties = [
  {
    id: "one",
    nom: "Appartement Horizon",
    type: "Appartement",
    prix: 75000,
    statut: "disponible",
    surface: 85,
    photos: ["/src/assets/residencelasmoras1.jpeg"],
    equipements: ["Wi-Fi", "Parking"],
    description: "Appartement confortable.",
  },
  {
    id: "two",
    nom: "Studio Jardin",
    type: "Studio",
    prix: 35000,
    statut: "occupe",
    surface: 35,
    photos: ["/src/assets/residencelasmoras2.jpeg"],
    equipements: [],
    description: "Un studio calme.",
  },
];
async function setup(page) {
  const user = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "administration.longue@lasmoras.com",
    aud: "authenticated",
    role: "authenticated",
  };
  await page.addInitScript(
    (user) =>
      localStorage.setItem(
        "sb-lasmoras-test-auth-token",
        JSON.stringify({
          access_token: "test-token",
          refresh_token: "test-refresh",
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          expires_in: 3600,
          token_type: "bearer",
          user,
        }),
      ),
    user,
  );
  await page.route("https://lasmoras-test.supabase.co/**", async (route) => {
    const url = new URL(route.request().url());
    let body = [];
    if (url.pathname.includes("/auth/")) body = user;
    else if (url.pathname.includes("team_members"))
      body =
        url.searchParams.get("select") === "role"
          ? { role: "admin" }
          : [{ user_id: user.id, email: user.email, role: "admin" }];
    else if (url.pathname.includes("logements")) body = properties;
    else if (url.pathname.includes("reservations"))
      body = [
        {
          id: "reservation",
          client_nom: "Client de la résidence",
          client_email: "un.adresse.tres.longue.pour.verifier@exemple.com",
          client_telephone: "+237 699 999 999",
          date_arrivee: "2026-11-10",
          date_depart: "2026-11-15",
          statut_reservation: "demande",
          logements: { nom: "Appartement Horizon" },
        },
      ];
    else if (url.pathname.includes("contacts"))
      body = [
        {
          id: "contact",
          nom: "Visiteur",
          email: "visiteur@example.com",
          sujet: "Préparer mon prochain séjour",
          message:
            "Bonjour, je souhaite connaître les disponibilités de la résidence.",
          lu: false,
          created_at: "2026-11-07T10:00:00Z",
        },
      ];
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}
for (const width of [320, 390, 768, 1440])
  test(`Administration responsive à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    await setup(page);
    for (const route of [
      "dashboard",
      "logements",
      "reservations",
      "messages",
      "equipe",
      "compte",
    ]) {
      await page.goto(`http://localhost:5187/admin/${route}`);
      await expect(page.locator("#admin-content h1")).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      if (route === "dashboard" && (width === 390 || width === 1440))
        await page.screenshot({
          path: `test-results/admin-dashboard-${width}.png`,
          fullPage: true,
        });
    }
    if (width < 1024) {
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "Logements", exact: true })
        .click();
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Gestion des logements" }),
      ).toBeVisible();
    }
    await page.goto("http://localhost:5187/admin/logements");
    await page
      .getByRole("heading", { name: "Gestion des logements" })
      .waitFor();
    await page
      .getByRole("textbox", { name: "Rechercher un logement" })
      .fill("Jardin");
    await expect(
      page.getByRole("heading", { name: "Appartement Horizon" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Studio Jardin" }),
    ).toBeVisible();
  });
