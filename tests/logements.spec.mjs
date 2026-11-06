import { test } from "@playwright/test";
import assert from "node:assert/strict";
test("photos cohérentes et confirmation de suppression", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const user = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@example.com",
    aud: "authenticated",
    role: "authenticated",
  };
  const session = {
    access_token: "test-token",
    refresh_token: "test-refresh",
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: "bearer",
    user,
  };
  await page.addInitScript(
    (session) =>
      localStorage.setItem(
        "sb-lasmoras-test-auth-token",
        JSON.stringify(session),
      ),
    session,
  );
  let rows = [],
    deletes = 0;
  await page.route("https://lasmoras-test.supabase.co/**", async (route) => {
    const request = route.request(),
      url = new URL(request.url()),
      method = request.method();
    let body = {};
    if (url.pathname.includes("/auth/")) body = user;
    else if (url.pathname.includes("team_members"))
      body =
        url.searchParams.get("select") === "role"
          ? { role: "admin" }
          : [{ user_id: user.id, email: user.email, role: "admin" }];
    else if (url.pathname.includes("/storage/v1/object/") && method === "POST")
      body = { Key: "logements/test.png" };
    else if (url.pathname.includes("/rest/v1/logements")) {
      if (method === "POST") {
        const payload = request.postDataJSON();
        rows = [
          {
            ...payload,
            id: "property-test",
            created_at: new Date().toISOString(),
          },
        ];
        body = { id: "property-test" };
      } else if (method === "PATCH") {
        rows = [{ ...rows[0], ...request.postDataJSON() }];
        body = { id: "property-test" };
      } else if (method === "DELETE") {
        deletes++;
        rows = [];
        body = { id: "property-test" };
      } else body = rows;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  await page.goto("http://localhost:5187/admin/logements");
  await page.getByRole("button", { name: "Ajouter un logement" }).click();
  await page.getByLabel("Nom", { exact: true }).fill("Studio de test");
  await page
    .getByLabel("Description", { exact: true })
    .fill("Un studio confortable avec sa vraie photo.");
  await page.getByLabel("Ajouter des photos").setInputFiles([
    {
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aT2kAAAAASUVORK5CYII=",
        "base64",
      ),
    },
    {
      name: "second.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aT2kAAAAASUVORK5CYII=",
        "base64",
      ),
    },
  ]);
  await page.getByRole("button", { name: "Définir comme principale" }).click();
  const selected = await page
    .locator("section img")
    .first()
    .getAttribute("src");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await page.getByRole("button", { name: "Modifier", exact: true }).waitFor();
  assert.equal(rows[0].photos[0], selected);
  await page.goto("http://localhost:5187/catalogue");
  assert.equal(
    await page.getByAltText("Studio de test").getAttribute("src"),
    selected,
  );
  await page.getByRole("link", { name: "Voir détails" }).click();
  assert.equal(
    await page
      .getByAltText("Studio de test", { exact: true })
      .getAttribute("src"),
    selected,
  );
  await page.goto("http://localhost:5187/admin/logements");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Supprimer", exact: true }).click();
  assert.equal(deletes, 0);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Supprimer", exact: true }).click();
  await page.getByText("Logement supprimé.", { exact: true }).waitFor();
  assert.equal(deletes, 1);
  await page.goto("http://localhost:5187/catalogue");
  await page.getByText("Aucun logement ne correspond à ces filtres.").waitFor();
  console.log(
    "PASS browser with simulated API: create, upload, choose cover, catalogue and details same image, cancel deletion, confirm deletion, removed from catalogue",
  );
});
