# ORVIA Web

Static website source for ORVIA Web. The homepage is `index.html`; the artist page is `artists/index.html`. Images and the optimized homepage film are included. No build command or package install is needed.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the **contents of this ZIP** to its root (not the ZIP file itself).
2. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. GitHub will provide a `github.io` URL. The relative links and assets work under a repository path.

The contact form opens the visitor's email app with an enquiry draft; it does not submit to a backend. Analytics and Meta Pixel identifiers are blank, so no optional tracking loads. Payment buttons lead to hosted Stripe checkout.

The page also contains links to `web.orvia.org.uk`. If moving that custom domain from its current host to GitHub Pages, configure the domain and DNS in GitHub Pages separately; uploading the files alone does not transfer the domain.
