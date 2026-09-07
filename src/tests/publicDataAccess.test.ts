import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const fetcher = vi.fn();
beforeEach(() => { vi.resetModules(); vi.stubEnv("VITE_API_BASE_URL", "https://api.vinoveil.com"); vi.stubGlobal("fetch", fetcher); fetcher.mockReset(); });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("native public and owner-data transport", () => {
  it("uses credentialed catalog/order reads with truthful empty data", async () => {
    const { dataClient } = await import("../lib/dataClient");
    fetcher.mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });
    expect(await dataClient.listProducts()).toEqual({ data: [] });
    expect(await dataClient.listOrders()).toEqual({ data: [] });
    expect(fetcher).toHaveBeenLastCalledWith("https://api.vinoveil.com/api/orders", { method: "GET", credentials: "include" });
  });
  it("reports contact acceptance only after the native service confirms acceptance", async () => {
    const { sendContactMessage } = await import("../lib/contact");
    const input = { name: "Offline", email: "unit@example.invalid", message: "Never sent" };
    fetcher.mockResolvedValueOnce({ ok: true, json: async () => ({ data: { ok: true } }) });
    await sendContactMessage(input);
    expect(fetcher.mock.calls[0][0]).toBe("https://api.vinoveil.com/api/contact");
    expect(fetcher.mock.calls[0][1].credentials).toBe("include");
    fetcher.mockResolvedValueOnce({ ok: true, json: async () => ({ data: null }) });
    await expect(sendContactMessage(input)).rejects.toThrow("Contact message was not accepted.");
  });
  it("does not turn an unavailable checkout into a fake local order or payment URL", async () => {
    const { createDraftOrder, createCheckoutSession } = await import("../lib/checkout");
    fetcher.mockResolvedValue({ ok: false, json: async () => ({ error: "Checkout is not available yet." }) });
    await expect(createDraftOrder({ items: [], products: [], variants: [], email: "unit@example.invalid", shippingAddress: {} })).rejects.toThrow("Checkout is not available yet.");
    await expect(createCheckoutSession("offline-order")).rejects.toThrow("Checkout is not available yet.");
  });
  it("fails without a configured HTTPS backend instead of fetching another store", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    const { dataClient } = await import("../lib/dataClient");
    await expect(dataClient.listProducts()).rejects.toThrow("not configured");
    expect(fetcher).not.toHaveBeenCalled();
  });
});
