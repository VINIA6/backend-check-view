import { Request, Response } from 'express';
import { makeValidateShareLink } from '../../application/factories/makeValidateShareLink';

export class ValidateShareLinkController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.params;

      console.log('🔍 Validating share link with token:', token);

      if (!token) {
        console.log('❌ No token provided');
        return res.status(400).json({ error: 'Token is required' });
      }

      const validateShareLink = makeValidateShareLink();
      const result = await validateShareLink.execute({ token });

      console.log('✅ Validation result:', { isValid: result.isValid, hasProject: !!result.project });

      if (!result.isValid) {
        console.log('❌ Link is invalid or expired');
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('❌ Error validating share link:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

