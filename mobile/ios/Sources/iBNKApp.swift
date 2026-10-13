import SwiftUI

@main
struct iBNKApp: App {
    var body: some Scene {
        WindowGroup {
            WebShellView()
                .preferredColorScheme(.light)
        }
    }
}
