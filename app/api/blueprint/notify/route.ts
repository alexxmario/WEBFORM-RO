import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { blueprintId, data } = await request.json();

    console.log("Sending email notification for blueprint:", blueprintId);
    console.log("RESEND_API_KEY configured:", !!process.env.RESEND_API_KEY);
    console.log("NOTIFICATION_EMAIL:", process.env.NOTIFICATION_EMAIL || "alexionescu870@gmail.com");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 10px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
            .field { margin: 8px 0; }
            .field-label { font-weight: bold; color: #555; }
            .field-value { color: #333; margin-left: 10px; }
            .list-item { margin: 5px 0 5px 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎨 New Blueprint Submission</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">ID: ${blueprintId}</p>
            </div>
            <div class="content">

              <div class="section">
                <div class="section-title">📋 Identity</div>
                <div class="field">
                  <span class="field-label">Business Name:</span>
                  <span class="field-value">${data.identity.businessName || 'N/A'}</span>
                </div>
                <div class="field">
                  <span class="field-label">One-liner:</span>
                  <span class="field-value">${data.identity.oneLiner || 'N/A'}</span>
                </div>
                <div class="field">
                  <span class="field-label">What they sell:</span>
                  <span class="field-value">${data.identity.whatYouSell || 'N/A'}</span>
                </div>
                <div class="field">
                  <span class="field-label">Brand personality:</span>
                  <span class="field-value">${data.identity.brandPersonality?.join(', ') || 'N/A'}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">🎯 Vision</div>
                <div class="field">
                  <span class="field-label">Main goal:</span>
                  <span class="field-value">${data.vision.mainGoal || 'N/A'}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">🎨 Look & Feel</div>
                ${data.look.references?.length > 0 ? `
                <div class="field">
                  <span class="field-label">Reference sites:</span>
                  ${data.look.references.map((ref: { url: string; notes?: string }) => `
                    <div class="list-item">
                      <a href="${ref.url}" style="color: #667eea;">${ref.url}</a>
                      ${ref.notes ? `<br><span style="color: #666; font-size: 14px;">${ref.notes}</span>` : ''}
                    </div>
                  `).join('')}
                </div>
                ` : ''}
                ${data.look.colorPreference?.length > 0 ? `
                <div class="field">
                  <span class="field-label">Color preferences:</span>
                  <div style="display: flex; gap: 10px; margin-left: 10px; margin-top: 5px;">
                    ${data.look.colorPreference.map((color: string) => `
                      <div style="width: 40px; height: 40px; background-color: ${color}; border-radius: 4px; border: 1px solid #ddd;"></div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
                ${data.look.imageryVibe?.length > 0 ? `
                <div class="field">
                  <span class="field-label">Imagery vibe:</span>
                  <span class="field-value">${data.look.imageryVibe.join(', ')}</span>
                </div>
                ` : ''}
                ${data.look.assetsNote ? `
                <div class="field">
                  <span class="field-label">Assets note:</span>
                  <div style="margin-left: 10px; margin-top: 5px; padding: 10px; background: white; border-radius: 4px;">
                    ${data.look.assetsNote}
                  </div>
                </div>
                ` : ''}
              </div>

              <div class="section">
                <div class="section-title">📝 Content</div>
                <div class="field">
                  <span class="field-label">Pages needed:</span>
                  <span class="field-value">${data.content.pages?.join(', ') || 'N/A'}</span>
                </div>
                ${data.content.ctaDestination ? `
                <div class="field">
                  <span class="field-label">CTA destination:</span>
                  <span class="field-value">${data.content.ctaDestination}</span>
                </div>
                ` : ''}
              </div>

              <div class="section">
                <div class="section-title">⚙️ Technical</div>
                <div class="field">
                  <span class="field-label">Domain status:</span>
                  <span class="field-value">${data.technical.domainStatus === 'have' ? 'Has domain' : 'Needs domain'}</span>
                </div>
                ${data.technical.currentSite ? `
                <div class="field">
                  <span class="field-label">Current site:</span>
                  <span class="field-value">${data.technical.currentSite}</span>
                </div>
                ` : ''}
                ${data.technical.integrations?.length > 0 ? `
                <div class="field">
                  <span class="field-label">Integrations:</span>
                  <span class="field-value">${data.technical.integrations.join(', ')}</span>
                </div>
                ` : ''}
              </div>

              <div class="footer">
                <p>Submitted on ${new Date().toLocaleString()}</p>
                <p>View in Supabase: <a href="https://supabase.com/dashboard/project/tbwsarpmtprqvzvziqma/editor" style="color: #667eea;">Open Database</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: "WebForm <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "alexionescu870@gmail.com",
      subject: `New Blueprint: ${data.identity.businessName || 'Unnamed Business'}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, emailId: emailData?.id });
  } catch (error) {
    console.error("Email notification error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
