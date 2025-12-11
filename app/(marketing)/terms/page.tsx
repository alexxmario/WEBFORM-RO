import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container max-w-4xl space-y-8 py-24">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Terms and Conditions</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-foreground">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Service Overview</h2>
            <p>
              WebForm provides website design and development services with a 7-day build timeline
              and 3-day update turnaround for revisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Timeline</h2>
            <p>
              Initial website builds are completed within 7 days of blueprint approval. Updates and
              revisions are completed within 3 days of request submission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. Hosting and Domain</h2>
            <p>
              Hosting and domain services are included in the subscription. If you cancel your
              subscription, hosting services will cease and your website will go offline.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Client Responsibilities</h2>
            <p>
              Clients agree to respond to build checkpoints and revision requests within 24 hours
              to maintain project timeline and quality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Payment Terms</h2>
            <p>
              Services are billed on a subscription basis. Payment is required to maintain active
              hosting and receive updates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Cancellation Policy</h2>
            <p>
              You may cancel your subscription at any time. Upon cancellation, hosting services
              will terminate and your website will no longer be accessible.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
            <p>
              Upon full payment, you own the website design and content. WebForm retains the right
              to showcase the work in our portfolio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
            <p>
              WebForm is not liable for any indirect, incidental, or consequential damages arising
              from the use of our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">9. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of our services
              constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">10. Contact</h2>
            <p>
              For questions about these terms, please contact us at hello@webform.site
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
