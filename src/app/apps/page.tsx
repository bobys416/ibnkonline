import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, Apple, Smartphone } from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";

export const metadata = {
  title: "Get the iBNK App",
  description:
    "Access the iBNK marketplace on Android and iOS using the same live store, account, cart, and checkout.",
};

function configuredRelease(
  destination: string | undefined,
  version: string | undefined
): { url: string; version: string } | null {
  if (!destination || !version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    return null;
  }
  try {
    const url = new URL(destination);
    return url.protocol === "https:" && !url.username && !url.password
      ? { url: url.toString(), version }
      : null;
  } catch {
    return null;
  }
}

export default function AppsPage() {
  const androidRelease = configuredRelease(
    process.env.ANDROID_APP_DOWNLOAD_URL,
    process.env.ANDROID_APP_VERSION
  );
  const iosRelease = configuredRelease(
    process.env.IOS_APP_DISTRIBUTION_URL,
    process.env.IOS_APP_VERSION
  );

  return (
    <main className="min-h-[70vh] bg-[#FAFAF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-[#1554D1]">Home</Link>
          <span aria-hidden="true" className="px-2">/</span>
          <span className="text-[#172033]">iBNK Apps</span>
        </nav>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-12">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1554D1]">
                One live iBNK marketplace
              </p>
              <h1 className="text-3xl font-black tracking-tight text-[#172033] sm:text-4xl">
                Shop iBNK on your phone
              </h1>
              <p className="text-base leading-7 text-slate-600">
                The iBNK apps open the same live marketplace as the website, so
                your products, account, delivery options, cart, and checkout
                stay in sync.
              </p>
            </div>
            <IbnkLogo variant="color" className="h-16 w-auto self-start sm:self-auto" width={150} height={90} />
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-[#1554D1]" aria-hidden="true" />
                <h2 className="text-lg font-bold text-[#172033]">Android</h2>
              </div>
              {androidRelease ? (
                <a
                  href={androidRelease.url}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1554D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#0E44B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] focus-visible:ring-offset-2"
                >
                  <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                  Download Android app · v{androidRelease.version}
                </a>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Android download will be posted here after the signed app has
                  been built and device-tested.
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <Apple className="h-6 w-6 text-[#172033]" aria-hidden="true" />
                <h2 className="text-lg font-bold text-[#172033]">iPhone & iPad</h2>
              </div>
              {iosRelease ? (
                <a
                  href={iosRelease.url}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-[#172033] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] focus-visible:ring-offset-2"
                >
                  Open App Store or TestFlight · v{iosRelease.version}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  iOS distribution will be linked here when a signed TestFlight
                  or App Store release is available.
                </p>
              )}
            </article>
          </div>

          <p className="mt-6 text-xs leading-5 text-slate-500">
            Until app downloads are available, you can use the mobile website
            directly. App links are configured server-side and only accept
            HTTPS destinations.
          </p>
        </section>
      </div>
    </main>
  );
}
