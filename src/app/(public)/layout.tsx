
import PublicHeader from "@/components/PublicHeader";


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PublicHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
