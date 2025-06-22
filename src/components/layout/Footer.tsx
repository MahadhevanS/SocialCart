export function Footer() {
  return (
    <footer className="bg-muted py-8 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} SocialCart. All rights reserved.</p>
        <p className="mt-1">Your one-stop shop for social e-commerce.</p>
      </div>
    </footer>
  );
}
