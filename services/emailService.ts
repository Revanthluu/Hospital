import emailjs from '@emailjs/browser';

/**
 * Service to handle email delivery via EmailJS.
 */
export const emailService = {
    /**
     * Retrieves credentials. 
     * Uses explicit dot notation for Vite to avoid replacement issues.
     */
    getCredentials() {
        return {
            serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
            templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
        };
    },

    init() {
        const { publicKey } = this.getCredentials();
        if (publicKey) {
            console.log("[EmailService] Initializing with Public Key");
            emailjs.init(publicKey);
        }
    },

    async sendOTP(email: string, otp: string, fullName: string) {
        const { serviceId, templateId, publicKey } = this.getCredentials();

        console.group('[EmailService] Preparing to send OTP');
        console.log('Target Email:', email);
        console.log('Full Name:', fullName);
        console.log('Service ID:', serviceId ? 'OK' : 'MISSING');
        console.log('Template ID:', templateId ? 'OK' : 'MISSING');
        console.groupEnd();

        if (!serviceId || !templateId || !publicKey) {
            throw new Error("EmailJS configuration is incomplete. Please check your .env.local file.");
        }

        if (!email || email.trim() === "") {
            throw new Error("Recipient email address is empty.");
        }

        try {
            // We pass multiple possible keys to cover common template placeholder names
            const templateParams = {
                to_email: email,
                email: email,
                to_name: fullName,
                user_name: fullName,
                otp: otp,             // {{otp}}
                OTP: otp,             // {{OTP}}
                passcode: otp,        // {{passcode}}
                code: otp,            // {{code}}
                CODE: otp,            // {{CODE}}
            };

            const response = await emailjs.send(
                serviceId,
                templateId,
                templateParams,
                publicKey
            );

            console.log('[EmailService] Send Success:', response);
            return true;
        } catch (error: any) {
            console.error('[EmailService] SEND FAILURE:', error);
            // Extract the most useful error message
            const errorMessage = error?.text || error?.message || "Unknown error";
            throw new Error(`EmailJS Error: ${errorMessage}`);
        }
    }
};
