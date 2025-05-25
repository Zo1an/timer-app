import "./globals.css";

export const metadata = {
  title: "Timer App",
  description: "Timer app test by Zolan",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body id='body' className={"antialiased overflow-hidden"}>
        {children}
      </body>
    </html>
  );
}