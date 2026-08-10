import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

async function registerDomain() {
  console.log('🔄 Registrando dominio minervaalcarazjoyeria.mx en Resend...');
  try {
    const domain = await resend.domains.create({ name: 'minervaalcarazjoyeria.mx' });
    console.log('✅ Dominio registrado exitosamente en Resend!');
    console.log(JSON.stringify(domain, null, 2));
  } catch (err) {
    console.error('⚠️ Error al registrar dominio (posiblemente ya registrado):', err.message || err);
  }
}

registerDomain();
