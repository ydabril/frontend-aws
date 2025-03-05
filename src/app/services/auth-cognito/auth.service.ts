import { Injectable } from '@angular/core';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  fetchAuthSession,
  getCurrentUser,
  resetPassword,
  confirmResetPassword,
  fetchUserAttributes
} from '@aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  async register(email: string, password: string) {
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: { email }
      }
    });
  }

  async confirmSignUp(email: string, code: string) {
    return await confirmSignUp({ username: email, confirmationCode: code });
  }

  async login(email: string, password: string) {
    const user = await signIn({ username: email, password });
    const session = await this.getCurrentSession();

    if (session) {
      sessionStorage.setItem('accessToken', session.accessToken || '');
      sessionStorage.setItem('idToken', session.idToken || '');
    }

    return user;
  }

  async logout() {
    await signOut();
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('idToken');
  }

  async getCurrentSession() {
    const session = await fetchAuthSession();

    if (!session.tokens) {
      return null;
    }

    return {
      accessToken: session.tokens.accessToken?.toString() || '',
      idToken: session.tokens.idToken?.toString() || ''
    };
  }

  async getCurrentUser() {
    return await getCurrentUser();
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = sessionStorage.getItem('accessToken');
      return !!token;
    } catch {
      return false;
    }
  }

  async forgotPassword(email: string) {
    return await resetPassword({ username: email });
  }

  async forgotPasswordSubmit(email: string, code: string, newPassword: string) {
    return await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
  }

  async getUserAttributes() {
    try {
      const user = await fetchUserAttributes();
      return user;
    } catch (error) {
      console.error('Error obteniendo atributos del usuario', error);
      return null;
    }
  }
  
}
