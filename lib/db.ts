import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _instance: NeonQueryFunction<false, false> | null = null;

const getInstance = (): NeonQueryFunction<false, false> => {
  if (!_instance) _instance = neon(process.env.DATABASE_URL!);
  return _instance;
};

// Lazy proxy — same API as neon(), but only initializes on first real DB call.
// This prevents build-time errors when DATABASE_URL is not set locally.
export const sql: NeonQueryFunction<false, false> = new Proxy(
  function () {} as unknown as NeonQueryFunction<false, false>,
  {
    apply(_t, _th, args) {
      return (getInstance() as unknown as (...a: unknown[]) => unknown)(...args);
    },
    get(_t, prop) {
      const inst = getInstance() as unknown as Record<string | symbol, unknown>;
      const val = inst[prop];
      return typeof val === "function" ? (val as (...a: unknown[]) => unknown).bind(inst) : val;
    },
  }
);
