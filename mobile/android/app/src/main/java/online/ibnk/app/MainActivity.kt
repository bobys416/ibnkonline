package online.ibnk.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.ActivityNotFoundException
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.GeolocationPermissions
import android.webkit.SslErrorHandler
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.net.URI

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private lateinit var progress: ProgressBar
    private lateinit var offlinePanel: LinearLayout
    private lateinit var homeButton: Button
    private lateinit var reloadButton: Button
    private var pendingGeoOrigin: String? = null
    private var pendingGeoCallback: GeolocationPermissions.Callback? = null
    private var pendingFileCallback: ValueCallback<Array<Uri>>? = null
    private val origin: URI by lazy { URI(BuildConfig.WEB_ORIGIN) }

    private val locationPermission = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { result ->
        val granted = result[Manifest.permission.ACCESS_COARSE_LOCATION] == true ||
            result[Manifest.permission.ACCESS_FINE_LOCATION] == true
        pendingGeoCallback?.invoke(pendingGeoOrigin, granted, false)
        pendingGeoCallback = null
        pendingGeoOrigin = null
    }

    private val filePicker = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val uri = if (result.resultCode == RESULT_OK) result.data?.data else null
        pendingFileCallback?.onReceiveValue(uri?.let { arrayOf(it) })
        pendingFileCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.WHITE
        window.navigationBarColor = android.graphics.Color.WHITE
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        setContentView(R.layout.activity_main)
        val root = findViewById<View>(R.id.root_container)
        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val safeInsets = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
            )
            view.setPadding(safeInsets.left, safeInsets.top, safeInsets.right, safeInsets.bottom)
            insets
        }

        webView = findViewById(R.id.web_view)
        progress = findViewById(R.id.loading_progress)
        offlinePanel = findViewById(R.id.offline_panel)
        homeButton = findViewById(R.id.home_button)
        reloadButton = findViewById(R.id.retry_button)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW
            cacheMode = android.webkit.WebSettings.LOAD_DEFAULT
        }
        android.webkit.CookieManager.getInstance().setAcceptCookie(true)
        android.webkit.CookieManager.getInstance()
            .setAcceptThirdPartyCookies(webView, true)

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progress.visibility = if (newProgress < 100) View.VISIBLE else View.GONE
            }

            override fun onGeolocationPermissionsShowPrompt(
                requestOrigin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                val requestUri = requestOrigin?.let { value ->
                    runCatching { URI(value) }.getOrNull()
                }
                if (!isTrustedHost(requestUri?.host) || requestUri?.scheme != "https" || callback == null) {
                    callback?.invoke(requestOrigin, false, false)
                    return
                }

                if (hasLocationPermission()) {
                    callback.invoke(requestOrigin, true, false)
                    return
                }

                pendingGeoOrigin = requestOrigin
                pendingGeoCallback = callback
                android.app.AlertDialog.Builder(this@MainActivity)
                    .setMessage(R.string.location_permission)
                    .setNegativeButton(android.R.string.cancel) { _, _ ->
                        pendingGeoCallback?.invoke(pendingGeoOrigin, false, false)
                        pendingGeoCallback = null
                        pendingGeoOrigin = null
                    }
                    .setPositiveButton(android.R.string.ok) { _, _ ->
                        locationPermission.launch(
                            arrayOf(
                                Manifest.permission.ACCESS_COARSE_LOCATION,
                                Manifest.permission.ACCESS_FINE_LOCATION
                            )
                        )
                    }
                    .show()
            }

            override fun onShowFileChooser(
                webView: WebView?,
                callback: ValueCallback<Array<Uri>>?,
                params: FileChooserParams?
            ): Boolean {
                pendingFileCallback?.onReceiveValue(null)
                pendingFileCallback = callback
                val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                }
                filePicker.launch(intent)
                return true
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val uri = request?.url ?: return true
                if (isTrustedHost(uri.host) && uri.scheme == "https") {
                    return false
                }

                if (uri.scheme !in setOf("https", "mailto", "tel")) return true
                try {
                    startActivity(Intent(Intent.ACTION_VIEW, uri))
                } catch (_: ActivityNotFoundException) {
                    Toast.makeText(
                        this@MainActivity,
                        "No app is available to open this link.",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                return true
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progress.visibility = View.VISIBLE
                offlinePanel.visibility = View.GONE
                updateCheckoutControls(url)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progress.visibility = View.GONE
                updateCheckoutControls(url)
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                if (request?.isForMainFrame == true) showOfflineState()
            }

            override fun onReceivedHttpError(
                view: WebView?,
                request: WebResourceRequest?,
                errorResponse: android.webkit.WebResourceResponse?
            ) {
                if (request?.isForMainFrame == true && (errorResponse?.statusCode ?: 0) >= 500) {
                    showOfflineState()
                }
            }

            override fun onReceivedSslError(
                view: WebView?,
                handler: SslErrorHandler?,
                error: android.net.http.SslError?
            ) {
                handler?.cancel()
                showOfflineState()
            }
        }

        findViewById<Button>(R.id.back_button).setOnClickListener {
            if (webView.canGoBack()) webView.goBack()
        }
        homeButton.setOnClickListener {
            if (!isCheckoutOrPayment(webView.url)) loadPage(origin.toString())
        }
        reloadButton.setOnClickListener {
            if (!isCheckoutOrPayment(webView.url)) retryCurrentPage()
        }
        findViewById<Button>(R.id.share_button).setOnClickListener {
            val current = webView.url ?: origin.toString()
            val share = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_TEXT, current)
            }
            startActivity(Intent.createChooser(share, getString(R.string.share)))
        }
        findViewById<Button>(R.id.offline_retry_button).setOnClickListener {
            retryCurrentPage()
        }
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })

        loadPage(origin.toString())
    }

    private fun loadPage(url: String) {
        offlinePanel.visibility = View.GONE
        webView.loadUrl(url, mapOf("Cache-Control" to "no-cache"))
    }

    private fun retryCurrentPage() {
        loadPage(webView.url ?: origin.toString())
    }

    private fun showOfflineState() {
        progress.visibility = View.GONE
        offlinePanel.visibility = View.VISIBLE
    }

    private fun hasLocationPermission(): Boolean =
        ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED

    private fun isTrustedHost(host: String?): Boolean {
        val canonical = origin.host?.removePrefix("www.")?.lowercase()
        val actual = host?.lowercase() ?: return false
        return actual == canonical ||
            actual == "www.$canonical" ||
            actual == "checkout.stripe.com"
    }

    private fun isCheckoutOrPayment(url: String?): Boolean {
        val uri = runCatching { URI(url) }.getOrNull() ?: return false
        return uri.host == "checkout.stripe.com" ||
            uri.path.orEmpty().startsWith("/checkout")
    }

    private fun updateCheckoutControls(url: String?) {
        val enabled = !isCheckoutOrPayment(url)
        homeButton.isEnabled = enabled
        reloadButton.isEnabled = enabled
    }

    override fun onDestroy() {
        pendingGeoCallback?.invoke(pendingGeoOrigin, false, false)
        pendingGeoCallback = null
        pendingFileCallback?.onReceiveValue(null)
        pendingFileCallback = null
        webView.destroy()
        super.onDestroy()
    }
}
