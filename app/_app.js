// pages/_app.js
import "../app/globals.css"; // Import the global CSS where Tailwind directives are defined

function MyApp({ Component, pageProps }) {
   <Head>
        <title>MemeVerse TCG</title> {/* Set the global title */}
      </Head>
  return <Component {...pageProps} />; // Renders the current page
}

export default MyApp;
