// One Auth/Storage client for both the restored public site and the administration.
import { supabase as client, configurationError } from "./supabase";
export const supabase = new Proxy({} as NonNullable<typeof client>, {
  get(_target, key) {
    if (!client) throw new Error(configurationError);
    const value = Reflect.get(client, key, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
