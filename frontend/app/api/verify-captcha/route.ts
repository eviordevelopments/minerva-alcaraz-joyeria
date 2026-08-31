import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: 'Falta el token de reCAPTCHA' }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
    if (!secretKey) {
      return NextResponse.json({ success: false, message: 'Servidor no configurado para reCAPTCHA' }, { status: 500 });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    if (recaptchaData.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Validación de reCAPTCHA fallida', errors: recaptchaData['error-codes'] }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
