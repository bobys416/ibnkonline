import Combine
import SwiftUI
import UIKit
import WebKit

@MainActor
final class WebShellModel: NSObject, ObservableObject, WKNavigationDelegate {
    @Published private(set) var isLoading = true
    @Published private(set) var isOffline = false
    @Published private(set) var hasLoadedPage = false
    @Published private(set) var canGoBack = false
    @Published private(set) var isCheckoutOrPayment = false
    let webView: WKWebView
    private let homeURL: URL?
    private let trustedHosts: Set<String>

    override init() {
        let info = Bundle.main.infoDictionary ?? [:]
        #if DEBUG
        let rawOrigin = (info["IBNKDevelopmentURL"] as? String)
            .flatMap { $0.isEmpty ? nil : $0 }
            ?? (info["IBNKProductionURL"] as? String)
        #else
        let rawOrigin = info["IBNKProductionURL"] as? String
        #endif
        let parsedOrigin = rawOrigin.flatMap(URL.init(string:))
        #if DEBUG
        let allowDevelopmentHosts = true
        #else
        let allowDevelopmentHosts = false
        #endif
        let validOrigin = parsedOrigin.flatMap { url -> URL? in
            guard url.scheme == "https",
                  let host = url.host?.lowercased(),
                  !Self.isBlockedHost(host, allowDevelopmentHosts: allowDevelopmentHosts),
                  url.user == nil,
                  url.password == nil,
                  url.query == nil,
                  url.fragment == nil,
                  url.path.isEmpty || url.path == "/" else {
                return nil
            }
            return url
        }
        homeURL = validOrigin
        var hosts = Set<String>()
        if let host = validOrigin?.host?.lowercased() {
            hosts.insert(host)
            if host.hasPrefix("www.") {
                hosts.insert(String(host.dropFirst(4)))
            } else {
                hosts.insert("www." + host)
            }
        }
        hosts.insert("checkout.stripe.com")
        trustedHosts = hosts

        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        webView = WKWebView(frame: .zero, configuration: configuration)
        super.init()
        webView.navigationDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        if let validOrigin {
            load(validOrigin)
        } else {
            isLoading = false
            isOffline = true
        }
    }

    private static func isBlockedHost(_ host: String, allowDevelopmentHosts: Bool) -> Bool {
        if host == "localhost" ||
            host.hasSuffix(".localhost") ||
            host.hasSuffix(".local") {
            return true
        }
        if !allowDevelopmentHosts && (host.hasSuffix(".vercel.app") || host.contains(":")) {
            return true
        }
        let octets = host.split(separator: ".").compactMap { UInt8($0) }
        if octets.count == 4 && !allowDevelopmentHosts { return true }
        guard octets.count == 4 else { return false }
        let first = Int(octets[0])
        let second = Int(octets[1])
        return first == 0 ||
            first == 10 ||
            first == 127 ||
            (first == 169 && second == 254) ||
            (first == 192 && second == 168) ||
            (first == 172 && (16...31).contains(second)) ||
            (first == 100 && (64...127).contains(second))
    }

    func load(_ url: URL? = nil) {
        guard let destination = url ?? webView.url ?? homeURL else {
            isLoading = false
            isOffline = true
            return
        }
        isOffline = false
        isLoading = true
        var request = URLRequest(
            url: destination,
            cachePolicy: .reloadRevalidatingCacheData,
            timeoutInterval: 30
        )
        request.setValue("no-cache", forHTTPHeaderField: "Cache-Control")
        webView.load(request)
        updateNavigationState()
    }

    func goHome() {
        guard !isCheckoutOrPayment else { return }
        load(homeURL)
    }

    func goBack() {
        if webView.canGoBack {
            webView.goBack()
        }
    }

    private func updateNavigationState() {
        canGoBack = webView.canGoBack
        let host = webView.url?.host?.lowercased()
        let path = webView.url?.path.lowercased() ?? ""
        isCheckoutOrPayment = host == "checkout.stripe.com" || path.hasPrefix("/checkout")
    }

    private func showLoadFailure(_ error: Error) {
        let nsError = error as NSError
        guard nsError.code != NSURLErrorCancelled else { return }
        isLoading = false
        isOffline = true
        updateNavigationState()
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        isLoading = true
        isOffline = false
        updateNavigationState()
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        isLoading = false
        isOffline = false
        hasLoadedPage = true
        updateNavigationState()
    }

    func webView(
        _ webView: WKWebView,
        didFailProvisionalNavigation navigation: WKNavigation!,
        withError error: Error
    ) {
        showLoadFailure(error)
    }

    func webView(
        _ webView: WKWebView,
        didFail navigation: WKNavigation!,
        withError error: Error
    ) {
        showLoadFailure(error)
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }

        let host = url.host?.lowercased()
        let isTrusted = url.scheme == "https" && host.map(trustedHosts.contains) == true
        if isTrusted {
            if host == "checkout.stripe.com" || url.path.lowercased().hasPrefix("/checkout") {
                isCheckoutOrPayment = true
            }
            if navigationAction.targetFrame == nil {
                webView.load(URLRequest(url: url, cachePolicy: .reloadRevalidatingCacheData))
                decisionHandler(.cancel)
            } else {
                decisionHandler(.allow)
            }
            return
        }

        decisionHandler(.cancel)
        if ["https", "mailto", "tel"].contains(url.scheme?.lowercased() ?? "") {
            UIApplication.shared.open(url)
        }
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationResponse: WKNavigationResponse,
        decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void
    ) {
        if let response = navigationResponse.response as? HTTPURLResponse,
           response.statusCode >= 500 {
            isLoading = false
            isOffline = true
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }
}

struct WebShellView: View {
    @StateObject private var model = WebShellModel()

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                Button(action: model.goBack) {
                    Image(systemName: "chevron.left")
                }
                .disabled(!model.canGoBack)
                .accessibilityLabel("Go back")

                Button(action: model.goHome) {
                    Image(systemName: "house")
                }
                .disabled(model.isCheckoutOrPayment)
                .accessibilityLabel("Open iBNK home")

                Text("iBNK")
                    .font(.headline.weight(.bold))
                    .foregroundStyle(Color(red: 23 / 255, green: 32 / 255, blue: 51 / 255))
                    .frame(maxWidth: .infinity)

                Button {
                    guard !model.isCheckoutOrPayment else { return }
                    model.load()
                } label: {
                    Image(systemName: "arrow.clockwise")
                }
                .disabled(model.isCheckoutOrPayment)
                .accessibilityLabel("Reload page")

                ShareLink(item: model.webView.url?.absoluteString ?? "") {
                    Image(systemName: "square.and.arrow.up")
                }
                .disabled(model.webView.url == nil)
                .accessibilityLabel("Share page")
            }
            .buttonStyle(.plain)
            .font(.system(size: 17, weight: .semibold))
            .foregroundStyle(Color(red: 21 / 255, green: 84 / 255, blue: 209 / 255))
            .padding(.horizontal, 16)
            .frame(height: 48)
            .background(.white)

            if model.isLoading {
                ProgressView()
                    .tint(Color(red: 21 / 255, green: 84 / 255, blue: 209 / 255))
                    .frame(maxWidth: .infinity)
                    .frame(height: 2)
            }

            ZStack {
                WebViewContainer(webView: model.webView)
                if !model.hasLoadedPage && model.isLoading {
                    VStack(spacing: 18) {
                        Image("BrandLogo")
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: 220)
                        ProgressView()
                            .tint(Color(red: 21 / 255, green: 84 / 255, blue: 209 / 255))
                    }
                    .padding(32)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(red: 250 / 255, green: 250 / 255, blue: 247 / 255))
                }
                if model.isOffline {
                    VStack(spacing: 14) {
                        Image(systemName: "wifi.exclamationmark")
                            .font(.system(size: 34))
                            .foregroundStyle(Color(red: 21 / 255, green: 84 / 255, blue: 209 / 255))
                        Text("iBNK isn’t available right now")
                            .font(.title3.bold())
                            .foregroundStyle(Color(red: 23 / 255, green: 32 / 255, blue: 51 / 255))
                        Text("Check your connection and try again.")
                            .font(.body)
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                        Button("Try again") { model.load() }
                            .buttonStyle(.borderedProminent)
                            .tint(Color(red: 21 / 255, green: 84 / 255, blue: 209 / 255))
                    }
                    .padding(32)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(red: 250 / 255, green: 250 / 255, blue: 247 / 255))
                }
            }
        }
        .background(Color(red: 250 / 255, green: 250 / 255, blue: 247 / 255))
    }
}

private struct WebViewContainer: UIViewRepresentable {
    let webView: WKWebView

    func makeUIView(context: Context) -> WKWebView {
        webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
