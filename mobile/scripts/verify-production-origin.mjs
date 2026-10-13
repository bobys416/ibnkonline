import { isIP } from "node:net";

const rawOrigin = process.argv[2];
if (!rawOrigin) {
  console.error("Pass the public production origin as the first argument.");
  process.exit(2);
}

let origin;
try {
  origin = new URL(rawOrigin);
} catch {
  console.error("Production origin must be a valid HTTPS origin.");
  process.exit(2);
}

const host = origin.hostname.toLowerCase();
const addressVersion = isIP(host);
const octets = addressVersion === 4 ? host.split(".").map(Number) : [];
const isPrivateAddress = addressVersion === 6 ||
  octets[0] === 0 ||
  octets[0] === 10 ||
  octets[0] === 127 ||
  (octets[0] === 169 && octets[1] === 254) ||
  (octets[0] === 192 && octets[1] === 168) ||
  (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
  (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127);

if (
  origin.protocol !== "https:" ||
  origin.username ||
  origin.password ||
  origin.search ||
  origin.hash ||
  !["", "/"].includes(origin.pathname) ||
  addressVersion !== 0 ||
  host === "localhost" ||
  host.endsWith(".localhost") ||
  host.endsWith(".local") ||
  host.endsWith(".vercel.app") ||
  isPrivateAddress
) {
  console.error("Release origin must be a public HTTPS production origin, not a local, private, or preview URL.");
  process.exit(2);
}

try {
  const response = await fetch(origin, { signal: AbortSignal.timeout(15_000) });
  const finalUrl = new URL(response.url);
  const canonicalHost = host.startsWith("www.") ? host.slice(4) : host;
  const finalHost = finalUrl.hostname.toLowerCase();
  const sameCanonicalHost = finalHost === canonicalHost || finalHost === `www.${canonicalHost}`;
  const html = await response.text();
  const servesIbnk = /<title[^>]*>\s*iBNK\b/i.test(html);

  if (!response.ok || !sameCanonicalHost || !servesIbnk) {
    console.error(
      `Production origin verification failed (HTTP ${response.status}, final host ${finalHost}). ` +
      "The public page must serve the iBNK website on this domain."
    );
    process.exit(1);
  }
  console.log(`Verified public iBNK production origin: ${origin.origin}`);
} catch (error) {
  console.error(`Could not verify the production origin: ${error.message}`);
  process.exit(1);
}
