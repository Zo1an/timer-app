import "./globals.css";

export const metadata = {
  title: "Timer App",
  description: "Timer app test by Zolan",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body id='body' className={"antialiased overflow-auto"}>
        {children}
      </body>
    </html>
  );
}

// TODO: Add rain sound effect
// TODO: Add settings page (rain sound, rain effect, background image)
// TODO: Add timer settings and save to local storage
// TODO: Add way to change timer time +1m +5m +15m +30m +1h same with -1m -5m -15m -30m -1h
// TODO: Center timers to screen
// TODO: Fix scroll bug caused by rain