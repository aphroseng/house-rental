import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const loginTranslations = {
  rw: {
    title: "Injira mu Konti Yawe",
    emailLabel: "Email / Imeri",
    passwordLabel: "Ijambo ry'ibanga (Password)",
    emailPlaceholder: "Andika email yawe...",
    passwordPlaceholder: "Andika ijambo ry'ibanga...",
    loginBtn: "Injira",
    noAccount: "Nta konti ufite?",
    signupLink: "Iwandikishe hano",
    fillAll: "Nyamuneka yuzuza ibyo usabwa byose!",
    userNotFound: "Imeri cyangwa ijambo ry'ibanga si byo!",
    loginSuccess: "Winjiye neza!"
  },
  en: {
    title: "Login to Your Account",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    emailPlaceholder: "Enter your email...",
    passwordPlaceholder: "Enter your password...",
    loginBtn: "Login",
    noAccount: "Don't have an account?",
    signupLink: "Sign up here",
    fillAll: "Please fill in all fields!",
    userNotFound: "Invalid email or password!",
    loginSuccess: "Login successful!"
  },
  fr: {
    title: "Connectez-vous à votre compte",
    emailLabel: "Adresse E-mail",
    passwordLabel: "Mot de passe",
    emailPlaceholder: "Entrez votre e-mail...",
    passwordPlaceholder: "Entrez votre mot de passe...",
    loginBtn: "Se connecter",
    noAccount: "Vous n'avez pas de compte?",
    signupLink: "S'inscrire ici",
    fillAll: "Veuillez remplir tous les champs!",
    userNotFound: "E-mail ou mot de passe incorrect!",
    loginSuccess: "Connexion réussie!"
  },
  nl: {
    title: "Inloggen op uw account",
    emailLabel: "E-mailadres",
    passwordLabel: "Wachtwoord",
    emailPlaceholder: "Voer uw e-mail in...",
    passwordPlaceholder: "Voer uw wachtwoord in...",
    loginBtn: "Inloggen",
    noAccount: "Nog geen account?",
    signupLink: "Meld u hier aan",
    fillAll: "Vul a.u.b. alle velden in!",
    userNotFound: "Ongeldig e-mailadres of wachtwoord!",
    loginSuccess: "Inloggen geslaagd!"
  }
};

export default function Login() {
  const [lang, setLang] = useState('rw');
  const t = loginTranslations[lang];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert(t.fillAll);
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    // Gushaka umukoresha uhuye na Email na Password
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      localStorage.setItem('loggedUser', JSON.stringify(foundUser));
      alert(`${t.loginSuccess} (${foundUser.role})`);

      if (foundUser.role === 'landlord') {
        navigate('/landlord');
      } else {
        navigate('/tenant');
      }
    } else {
      // Niba atari muri registeredUsers, twemerera demo user idahise ibyanga
      const defaultRole = email.includes('landlord') ? 'landlord' : 'tenant';
      const demoUser = { name: email.split('@')[0], email, role: defaultRole };
      
      localStorage.setItem('loggedUser', JSON.stringify(demoUser));
      if (defaultRole === 'landlord') {
        navigate('/landlord');
      } else {
        navigate('/tenant');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>🔑 {t.title}</h2>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={styles.langSelect}>
            <option value="rw">🇷🇼 Kinyarwanda</option>
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="nl">🇳🇱 Nederlands</option>
          </select>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={styles.label}>{t.emailLabel}</label>
            <input 
              type="email" 
              placeholder={t.emailPlaceholder} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          <div>
            <label style={styles.label}>{t.passwordLabel}</label>
            <input 
              type="password" 
              placeholder={t.passwordPlaceholder} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          <button type="submit" style={styles.submitBtn}>{t.loginBtn}</button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '15px', color: '#666' }}>
          {t.noAccount} <Link to="/signup" style={{ color: '#007bff', fontWeight: 'bold' }}>{t.signupLink}</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Arial' },
  card: { background: '#fff', padding: '25px', borderRadius: '8px', width: '380px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  langSelect: { padding: '5px 8px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '12px', background: '#fff', fontWeight: 'bold' },
  label: { fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: '#555' },
  input: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '13px' },
  submitBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }
};