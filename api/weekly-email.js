export const config = { maxDuration: 60 };

const RECIPIENT = "vaishnavi.p.we@gmail.com";
const FROM = "PM Radar <onboarding@resend.dev>";; // update after Resend domain setup

async function getWeeklyCompanies() {
  const today = new Date().toDateString();
  const prompt = `Search the web for startups that announced funding, are actively hiring PMs, or are in the news in the last 7 days (week of ${today}).

Return ONLY a valid JSON array with no markdown or explanation. Each object must have exactly:
- name (string)
- tagline (string, 1 sentence)  
- sector (string)
- stage (string e.g. "Seed", "Series A", "Series B")
- amount (string e.g. "$12M" or "Undisclosed")
- investors (string, max 2-3 names)
- tags (array, subset of ["funded","hiring","news"])
- why_pm_relevant (string, 1 sentence on PM opportunity)
- bd_angle (string, 1 sentence on how BD background helps)
- gtm_motion (string, 1 sentence on how they sell)
- news_headline (string, the most recent notable news)

Return 6 real companies from the past 7 days. Only JSON, nothing else.`;

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content || "";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in Groq response");
  return JSON.parse(match[0]);
}

function getWeekLabel() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[monday.getMonth()]} ${monday.getDate()}–${sunday.getDate()}, ${sunday.getFullYear()}`;
}

function tagBadge(tag) {
  const styles = {
    funded: "background:#003D33;color:#00C9A7;border:1px solid #00C9A7;",
    hiring: "background:#3D2800;color:#F5A623;border:1px solid #F5A623;",
    news:   "background:#2A1F4A;color:#A78BFA;border:1px solid #A78BFA;"
  };
  const labels = { funded: "💰 funded", hiring: "🟡 hiring", news: "📰 news" };
  return `<span style="${styles[tag]||''}font-size:11px;font-family:monospace;padding:2px 8px;border-radius:4px;margin-right:4px;">${labels[tag]||tag}</span>`;
}

function companyCard(c, i) {
  const tags = (c.tags || []).map(tagBadge).join("");
  return `
  <div style="background:#1A2236;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 24px;margin-bottom:16px;border-left:4px solid #00C9A7;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;gap:12px;">
      <div>
        <div style="font-size:17px;font-weight:600;color:#F5F2EB;margin-bottom:2px;">${i+1}. ${c.name}</div>
        <div style="font-size:13px;color:#8A93A8;">${c.tagline}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-size:16px;font-weight:600;color:#00C9A7;font-family:monospace;">${c.amount}</div>
        <div style="font-size:11px;color:#4E5A70;font-family:monospace;">${c.stage}</div>
      </div>
    </div>

    <div style="margin-bottom:10px;">${tags}</div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
      <tr>
        <td style="width:50%;padding:6px 0;vertical-align:top;">
          <div style="font-size:10px;font-family:monospace;color:#4E5A70;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Investors</div>
          <div style="font-size:12px;color:#8A93A8;">${c.investors}</div>
        </td>
        <td style="width:50%;padding:6px 0;vertical-align:top;">
          <div style="font-size:10px;font-family:monospace;color:#4E5A70;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Sector</div>
          <div style="font-size:12px;color:#8A93A8;">${c.sector}</div>
        </td>
      </tr>
    </table>

    <div style="background:#0B0F1A;border-radius:8px;padding:12px 14px;margin-bottom:10px;">
      <div style="font-size:10px;font-family:monospace;color:#4E5A70;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px;">📰 Latest news</div>
      <div style="font-size:12px;color:#C8CDD8;line-height:1.5;">${c.news_headline}</div>
    </div>

    <div style="background:#0F1F18;border:1px solid rgba(0,201,167,0.15);border-radius:8px;padding:12px 14px;margin-bottom:10px;">
      <div style="font-size:10px;font-family:monospace;color:#00C9A7;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px;">🎯 PM opportunity</div>
      <div style="font-size:12px;color:#C8CDD8;line-height:1.5;">${c.why_pm_relevant}</div>
    </div>

    <div style="background:#1F1A0F;border:1px solid rgba(245,166,35,0.15);border-radius:8px;padding:12px 14px;margin-bottom:10px;">
      <div style="font-size:10px;font-family:monospace;color:#F5A623;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px;">💼 Your BD angle</div>
      <div style="font-size:12px;color:#C8CDD8;line-height:1.5;">${c.bd_angle}</div>
    </div>

    <div style="background:#170F2A;border:1px solid rgba(167,139,250,0.15);border-radius:8px;padding:12px 14px;">
      <div style="font-size:10px;font-family:monospace;color:#A78BFA;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px;">🚀 GTM motion</div>
      <div style="font-size:12px;color:#C8CDD8;line-height:1.5;">${c.gtm_motion}</div>
    </div>
  </div>`;
}

function buildEmail(companies, weekLabel) {
  const cards = companies.map((c, i) => companyCard(c, i)).join("");
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0B0F1A;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:640px;margin:0 auto;padding:24px 16px 48px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:32px;padding:28px 24px;background:#131929;border-radius:16px;border:1px solid rgba(255,255,255,0.07);">
    <div style="font-size:28px;font-weight:300;color:#F5F2EB;letter-spacing:-0.5px;margin-bottom:4px;">PM <em style="font-style:italic;color:#00C9A7;">Radar</em></div>
    <div style="font-size:13px;color:#4E5A70;margin-bottom:16px;">Your weekly BD-to-PM intelligence brief</div>
    <div style="display:inline-block;background:rgba(0,201,167,0.1);border:1px solid rgba(0,201,167,0.25);border-radius:20px;padding:6px 16px;font-size:12px;font-family:monospace;color:#00C9A7;">
      ● Week of ${weekLabel}
    </div>
  </div>

  <!-- Intro -->
  <div style="background:#131929;border-radius:10px;padding:16px 20px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.07);">
    <div style="font-size:13px;color:#8A93A8;line-height:1.7;">
      Good morning Vaishnavi 👋 Here are this week's <strong style="color:#F5F2EB;">${companies.length} companies</strong> — funded, hiring, or in the news. 
      Your Tuesday playbook: pick <strong style="color:#F5F2EB;">2 companies max</strong>, read their angle, send one LinkedIn message before 11am while inboxes are open.
    </div>
  </div>

  <!-- Company Cards -->
  ${cards}

  <!-- CTA -->
  <div style="text-align:center;margin-top:28px;margin-bottom:28px;">
    <a href="https://pm-radar-1yart.vercel.app" style="display:inline-block;background:#00C9A7;color:#0B0F1A;font-size:13px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
      Open PM Radar for full dossiers →
    </a>
    <div style="font-size:11px;color:#4E5A70;margin-top:10px;font-family:monospace;">
      Resume match · Interview prep · Cover letter generator · LinkedIn links
    </div>
  </div>

  <!-- Tuesday Checklist -->
  <div style="background:#131929;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px 20px;margin-bottom:24px;">
    <div style="font-size:11px;font-family:monospace;color:#4E5A70;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Your Tuesday checklist</div>
    <div style="font-size:12px;color:#8A93A8;line-height:2;">
      ☐ &nbsp;Pick 2 companies from this email<br>
      ☐ &nbsp;Open PM Radar → read GTM tab for each<br>
      ☐ &nbsp;Generate your cover letter<br>
      ☐ &nbsp;Send one LinkedIn message before 11am<br>
      ☐ &nbsp;Mark as "Contacted" in your pipeline tracker
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding-top:16px;border-top:1px solid rgba(255,255,255,0.05);">
    <div style="font-size:11px;color:#4E5A70;font-family:monospace;">
      PM Radar · Refreshes every Tuesday 8am IST<br>
      Built by Vaishnavi Pai · <a href="https://pm-radar-1yart.vercel.app" style="color:#4E5A70;">pm-radar-1yart.vercel.app</a>
    </div>
  </div>

</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  // Allow manual trigger via GET (for testing) and scheduled cron via GET
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify cron secret to prevent unauthorized triggers
  const authHeader = req.headers["authorization"];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Step 1: Get this week's companies from Groq
    const companies = await getWeeklyCompanies();
    const weekLabel = getWeekLabel();

    // Step 2: Build the HTML email
    const html = buildEmail(companies, weekLabel);
    const subject = `PM Radar · ${companies.length} companies this week · ${weekLabel}`;

    // Step 3: Send via Resend
    const emailResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [RECIPIENT],
        subject,
        html,
      }),
    });

    const emailData = await emailResp.json();

    if (!emailResp.ok) {
      throw new Error(`Resend error: ${JSON.stringify(emailData)}`);
    }

    return res.status(200).json({
      success: true,
      week: weekLabel,
      companies: companies.length,
      email_id: emailData.id,
    });

  } catch (err) {
    console.error("Weekly email error:", err);
    return res.status(500).json({ error: err.message });
  }
}
