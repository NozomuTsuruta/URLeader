import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="ja-JP" dir="ltr">
        <title>URLeader</title>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap"
            rel="stylesheet"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-mobile-web-app-title" content="URLeader" />
          <link rel="apple-touch-icon" href="/icons/57x57.png" sizes="57x57" />
          <link rel="apple-touch-icon" href="/icons/60x60.png" sizes="60x60" />
          <link rel="apple-touch-icon" href="/icons/72x72.png" sizes="72x72" />
          <link rel="apple-touch-icon" href="/icons/76x76.png" sizes="76x76" />
          <link
            rel="apple-touch-icon"
            href="/icons/114x114.png"
            sizes="114x114"
          />
          <link
            rel="apple-touch-icon"
            href="/icons/120x120.png"
            sizes="120x120"
          />
          <link
            rel="apple-touch-icon"
            href="/icons/144x144.png"
            sizes="144x144"
          />
          <link
            rel="apple-touch-icon"
            href="/icons/152x152.png"
            sizes="152x152"
          />
          <link
            rel="apple-touch-icon"
            href="/icons/180x180.png"
            sizes="180x180"
          />
          <meta name="msapplication-TileImage" content="/icons/144x144.png" />
          <meta name="msapplication-TileColor" content="#fff" />
          <meta name="theme-color" content="#282c34" />
          <meta
            name="description"
            content="URLと時間を登録して、予定を管理するアプリ"
          />
          <script async defer src="https://apis.google.com/js/api.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
