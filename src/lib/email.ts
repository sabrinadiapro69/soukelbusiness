import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// En attendant qu'un nom de domaine soit vérifié sur Resend, l'envoi se
// fait depuis leur domaine de test — ne délivre qu'à l'adresse du
// compte Resend tant qu'aucun domaine n'est configuré.
const FROM = "Souk El Business <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function baseTemplate(bodyHtml: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #2a2621;">
      <p style="font-weight: bold; font-size: 18px; color: #b5502e;">Souk El Business</p>
      ${bodyHtml}
      <p style="margin-top: 32px; font-size: 12px; color: #767066;">
        Vous recevez cet email car vous avez un compte sur Souk El Business.
      </p>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn(`RESEND_API_KEY absent — email non envoyé (${subject}) à ${to}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html: baseTemplate(html) });
  } catch (err) {
    console.error("Échec de l'envoi d'email :", err);
  }
}

export async function sendListingApprovedEmail(
  to: string,
  listingTitle: string,
  listingId: number
) {
  await sendEmail(
    to,
    "Votre annonce a été approuvée",
    `<p>Bonne nouvelle ! Votre annonce <strong>${escapeHtml(listingTitle)}</strong> a été approuvée et est maintenant visible par tous les visiteurs de Souk El Business.</p>
     <p><a href="${SITE_URL}/produits/${listingId}" style="color: #b5502e;">Voir mon annonce</a></p>`
  );
}

export async function sendListingRejectedEmail(to: string, listingTitle: string) {
  await sendEmail(
    to,
    "Votre annonce n'a pas été approuvée",
    `<p>Votre annonce <strong>${escapeHtml(listingTitle)}</strong> n'a pas été approuvée par notre équipe de modération et n'est pas visible sur le site.</p>
     <p>Si vous pensez qu'il s'agit d'une erreur, vous pouvez nous contacter depuis la page Contact du site.</p>`
  );
}

export async function sendTalentApprovedEmail(to: string) {
  await sendEmail(
    to,
    "Votre profil Talentueux est vérifié",
    `<p>Félicitations ! Votre profil professionnel a été vérifié et affiche désormais le badge <strong>Talentueux</strong> sur Souk El Business.</p>
     <p><a href="${SITE_URL}/profil" style="color: #b5502e;">Voir mon profil</a></p>`
  );
}

export async function sendTalentRejectedEmail(to: string) {
  await sendEmail(
    to,
    "Votre profil Talentueux n'a pas été vérifié",
    `<p>Après examen, votre profil professionnel n'a pas été vérifié pour le moment.</p>
     <p>Vous pouvez compléter votre profil et votre portfolio puis nous contacter depuis la page Contact du site pour une nouvelle demande.</p>`
  );
}

export async function sendWarningEmail(to: string, motif: string) {
  await sendEmail(
    to,
    "Avertissement concernant votre compte",
    `<p>Notre équipe de modération a examiné un signalement vous concernant, pour le motif suivant : <strong>${escapeHtml(motif)}</strong>.</p>
     <p>Ceci est un avertissement. Merci de respecter les règles d'utilisation de Souk El Business — en cas de nouveau signalement, votre compte pourrait être suspendu.</p>`
  );
}

export async function sendSuspensionEmail(to: string) {
  await sendEmail(
    to,
    "Votre compte a été suspendu",
    `<p>Votre compte Souk El Business a été suspendu par notre équipe de modération suite à un ou plusieurs signalements.</p>
     <p>Si vous pensez qu'il s'agit d'une erreur, vous pouvez nous contacter depuis la page Contact du site.</p>`
  );
}
