import Link from "next/link";
export default function ConfirmEmailPage() {
  return (
    <main
      id="main"
      className="container min-h-screen flex flex-col justify-center items-center text-center"
    >
      <h1 className="text-3xl">Continuă în contul tău.</h1>
      <p className="text-muted-foreground my-5">
        După confirmarea adresei de email, te poți autentifica pentru a alege
        planul.
      </p>
      <Link href="/login" className="action action-dark">
        Autentificare
      </Link>
    </main>
  );
}
