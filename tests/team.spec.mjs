import { test, expect } from "@playwright/test";
async function mockAccount(page, role) {
  const user = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@example.com",
    aud: "authenticated",
    role: "authenticated",
  };
  await page.addInitScript(
    (user) =>
      localStorage.setItem(
        "sb-lasmoras-test-auth-token",
        JSON.stringify({
          access_token: "test-token",
          refresh_token: "refresh",
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          expires_in: 3600,
          token_type: "bearer",
          user,
        }),
      ),
    user,
  );
  const calls = [];
  let members = [{ user_id: user.id, email: user.email, role }];
  await page.route("https://lasmoras-test.supabase.co/**", async (route) => {
    const req = route.request(),
      url = new URL(req.url());
    let body = [];
    if (url.pathname.includes("/auth/")) body = user;
    if (url.pathname.includes("team_members"))
      body = url.searchParams.get("select") === "role" ? { role } : members;
    if (url.pathname.includes("/functions/v1/manage-team")) {
      const payload = req.postDataJSON();
      calls.push(payload);
      if (payload.action === "create")
        members = [
          ...members,
          { user_id: "new-member", email: payload.email, role: payload.role },
        ];
      if (payload.action === "revoke")
        members = members.filter(
          (member) => member.user_id !== payload.user_id,
        );
      body = { success: true };
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  return calls;
}
test("administrateur : créer un gestionnaire et confirmer le retrait de son accès", async ({
  page,
}) => {
  const calls = await mockAccount(page, "admin");
  await page.goto("http://localhost:5187/admin/equipe");
  await page
    .getByLabel("Adresse e-mail", { exact: true })
    .fill("manager@example.com");
  await page
    .getByLabel("Mot de passe initial", { exact: false })
    .fill("InitialPassword123!");
  await page.getByRole("button", { name: "Créer le compte" }).click();
  await expect(
    page.getByText("manager@example.com", { exact: true }),
  ).toBeVisible();
  expect(calls[0].action).toBe("create");
  expect(calls[0].role).toBe("manager");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Retirer l’accès" }).click();
  expect(calls).toHaveLength(1);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Retirer l’accès" }).click();
  await expect(
    page.getByText("manager@example.com", { exact: true }),
  ).toHaveCount(0);
  expect(calls[1]).toEqual({ action: "revoke", user_id: "new-member" });
});
test("gestionnaire : pas de formulaire de gestion des membres", async ({
  page,
}) => {
  const calls = await mockAccount(page, "manager");
  await page.goto("http://localhost:5187/admin/equipe");
  await expect(
    page.getByText("Seul un administrateur peut gérer les accès."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Équipe et accès" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: "Créer le compte" }),
  ).toHaveCount(0);
  expect(calls).toHaveLength(0);
});
