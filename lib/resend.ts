import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'
import { getResendApiKey, getResendFromEmail } from '@/config/env'

export const resend = new Resend(getResendApiKey())

/**
 * Generate a 6-digit OTP code
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Load and populate email template
 */
function getEmailTemplate(otpCode: string, type: 'signup' | 'reset'): string {
  const templatePath = path.join(process.cwd(), 'templates', 'otp-email.html')
  let template = fs.readFileSync(templatePath, 'utf-8')

  if (type === 'signup') {
    template = template
      .replace('{{TITLE}}', 'Verify Your Email')
      .replace('{{GRADIENT}}', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
      .replace('{{HEADING}}', 'Welcome to Call of Coders!')
      .replace('{{MESSAGE}}', 'Thank you for signing up! To complete your registration, please verify your email address using the code below:')
      .replace('{{CODE_LABEL}}', 'Your Verification Code')
  } else {
    template = template
      .replace('{{TITLE}}', 'Reset Your Password')
      .replace('{{GRADIENT}}', 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)')
      .replace('{{HEADING}}', 'Reset Your Password')
      .replace('{{MESSAGE}}', 'We received a request to reset your password. Use the code below to proceed:')
      .replace('{{CODE_LABEL}}', 'Your Reset Code')
  }

  return template
    .replace('{{OTP_CODE}}', otpCode)
    .replace('{{YEAR}}', new Date().getFullYear().toString())
}

/**
 * Send OTP email
 * @param email - Recipient email address
 * @param otpCode - 6-digit OTP code
 * @param type - Type of OTP email (signup or reset)
 */
export async function sendOtp(
  email: string,
  otpCode: string,
  type: 'signup' | 'reset' = 'signup'
): Promise<{ success: boolean; message: string }> {
  try {
    const subject = type === 'signup' 
      ? 'Verify Your Email - Call of Coders'
      : 'Reset Your Password - Call of Coders'

    const htmlContent = getEmailTemplate(otpCode, type)

    const { data, error } = await resend.emails.send({
      from: getResendFromEmail() || 'Call of Coders <noreply@kushkumar.me>',
      to: email,
      subject,
      html: htmlContent
    })

    if (error) {
      console.error('Resend error:', error)
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      }
    }

    return {
      success: true,
      message: 'OTP sent successfully'
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return {
      success: false,
      message: 'An error occurred while sending OTP'
    }
  }
}
